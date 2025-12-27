import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner@2.0.3";
import { User, GraduationCap, Heart, Home, Sparkles, Calendar, DollarSign, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { authService } from "../utils/authService";

type ProfileCompletionProps = {
  userId: string;
  accessToken: string;
  onComplete: (profileData: any) => void;
};

export function ProfileCompletion({ userId, accessToken, onComplete }: ProfileCompletionProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Basic Info
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");

  // Student Info
  const [university, setUniversity] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");

  // Personality & Lifestyle
  const [lifestyle, setLifestyle] = useState<string[]>([]);
  const [personality, setPersonality] = useState<string[]>([]);
  const [hobbies, setHobbies] = useState("");

  // Roommate Preferences
  const [preferredGender, setPreferredGender] = useState("");
  const [preferredLifestyle, setPreferredLifestyle] = useState<string[]>([]);
  const [preferredPersonality, setPreferredPersonality] = useState<string[]>([]);
  const [otherPreferences, setOtherPreferences] = useState("");

  // Housing Preferences
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [preferredDistricts, setPreferredDistricts] = useState<string[]>([]);
  const [moveInDate, setMoveInDate] = useState("");

  const lifestyleOptions = [
    "Sạch sẽ gọn gàng",
    "Yên tĩnh",
    "Hoạt náo",
    "Thích nấu ăn",
    "Ít nấu ăn",
    "Đi ngủ sớm",
    "Đi ngủ muộn",
    "Thích nuôi thú cưng",
    "Không hút thuốc",
    "Uống rượu bia"
  ];

  const personalityOptions = [
    "Hòa đồng",
    "Thân thiện",
    "Hướng nội",
    "Hướng ngoại",
    "Dễ tính",
    "Trách nhiệm",
    "Tôn trọng riêng tư",
    "Thích giao lưu"
  ];

  const districtOptions = [
    "Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5",
    "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10",
    "Quận 11", "Quận 12", "Bình Thạnh", "Gò Vấp", "Phú Nhuận",
    "Tân Bình", "Tân Phú", "Thủ Đức"
  ];

  const toggleArrayItem = (array: string[], setArray: (arr: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const handleSubmit = async () => {
    // Validate
    if (!gender || !age || !occupation) {
      toast.error("Vui lòng điền đầy đủ thông tin cơ bản");
      return;
    }

    if (occupation === "Sinh viên" && (!university || !yearOfStudy)) {
      toast.error("Vui lòng điền thông tin sinh viên");
      return;
    }

    if (lifestyle.length === 0 || personality.length === 0) {
      toast.error("Vui lòng chọn ít nhất một lối sống và tính cách");
      return;
    }

    setIsLoading(true);

    try {
      const profileData = {
        gender,
        age: parseInt(age),
        occupation,
        university: occupation === "Sinh viên" ? university : undefined,
        yearOfStudy: occupation === "Sinh viên" ? yearOfStudy : undefined,
        lifestyle: lifestyle.join(", "),
        personality: personality.join(", "),
        hobbies,
        preferences: {
          gender: preferredGender,
          lifestyle: preferredLifestyle.join(", "),
          personality: preferredPersonality.join(", "),
          other: otherPreferences
        },
        budget: budgetMin && budgetMax ? {
          min: parseInt(budgetMin),
          max: parseInt(budgetMax)
        } : undefined,
        preferredDistricts,
        moveInDate: moveInDate || undefined,
        profileCompleted: true
      };

      const backendAvailable = await authService.checkBackend();

      if (backendAvailable && accessToken) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ef0f32bc/user/complete-profile`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(profileData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || "Có lỗi xảy ra");
          setIsLoading(false);
          return;
        }

        toast.success("Hoàn thành hồ sơ thành công!");
        onComplete(data.profile);
      } else {
        // Use localStorage fallback
        const updatedProfile = authService.updateLocalProfile(userId, profileData);
        toast.success("Hoàn thành hồ sơ thành công! (Lưu trên trình duyệt)");
        onComplete(updatedProfile);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Complete profile error:", error);
      
      // Fallback to localStorage on error
      try {
        const profileData = {
          gender,
          age: parseInt(age),
          occupation,
          university: occupation === "Sinh viên" ? university : undefined,
          yearOfStudy: occupation === "Sinh viên" ? yearOfStudy : undefined,
          lifestyle: lifestyle.join(", "),
          personality: personality.join(", "),
          hobbies,
          preferences: otherPreferences,
          budget: budgetMin && budgetMax ? `${budgetMin}-${budgetMax}` : undefined,
          preferredDistricts,
          moveInDate: moveInDate || undefined,
          profileCompleted: true
        };
        
        const updatedProfile = authService.updateLocalProfile(userId, profileData);
        toast.success("Hoàn thành hồ sơ thành công! (Lưu trên trình duyệt)");
        onComplete(updatedProfile);
      } catch (localError) {
        toast.error("Có lỗi xảy ra khi lưu thông tin");
      }
      
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8 text-amber-100" />
              </div>
              <h2 className="text-teal-900 mb-2">Thông Tin Cơ Bản</h2>
              <p className="text-teal-700">Hãy cho chúng tôi biết về bạn</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-teal-900">Giới tính</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="border-teal-200 focus:border-teal-600">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-teal-900">Tuổi</Label>
                <Input
                  type="number"
                  placeholder="18-50"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="border-teal-200 focus:border-teal-600"
                  min="18"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-teal-900">Nghề nghiệp</Label>
                <Select value={occupation} onValueChange={setOccupation}>
                  <SelectTrigger className="border-teal-200 focus:border-teal-600">
                    <SelectValue placeholder="Chọn nghề nghiệp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sinh viên">Sinh viên</SelectItem>
                    <SelectItem value="Đi làm">Đi làm</SelectItem>
                    <SelectItem value="Freelancer">Freelancer</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {occupation === "Sinh viên" && (
                <div className="space-y-4 p-4 bg-teal-50 rounded-lg border-2 border-teal-100">
                  <div className="flex items-center gap-2 text-teal-900 mb-2">
                    <GraduationCap className="w-5 h-5" />
                    <span className="font-semibold">Thông tin sinh viên</span>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-teal-900">Trường đại học</Label>
                    <Input
                      placeholder="VD: ĐH Khoa học Tự nhiên"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="border-teal-200 focus:border-teal-600 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-teal-900">Năm học</Label>
                    <Select value={yearOfStudy} onValueChange={setYearOfStudy}>
                      <SelectTrigger className="border-teal-200 focus:border-teal-600 bg-white">
                        <SelectValue placeholder="Chọn năm học" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Năm nhất">Năm nhất</SelectItem>
                        <SelectItem value="Năm hai">Năm hai</SelectItem>
                        <SelectItem value="Năm ba">Năm ba</SelectItem>
                        <SelectItem value="Năm tư">Năm tư</SelectItem>
                        <SelectItem value="Sau đại học">Sau đại học</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={!gender || !age || !occupation || (occupation === "Sinh viên" && (!university || !yearOfStudy))}
            >
              Tiếp theo
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-teal-100" />
              </div>
              <h2 className="text-teal-900 mb-2">Tính Cách & Lối Sống</h2>
              <p className="text-teal-700">Giúp chúng tôi hiểu rõ hơn về bạn</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-teal-900">Lối sống của bạn</Label>
                <div className="grid grid-cols-2 gap-2 p-4 bg-amber-50 rounded-lg border-2 border-amber-100 max-h-64 overflow-y-auto">
                  {lifestyleOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lifestyle-${option}`}
                        checked={lifestyle.includes(option)}
                        onCheckedChange={() => toggleArrayItem(lifestyle, setLifestyle, option)}
                        className="border-amber-400 data-[state=checked]:bg-amber-600"
                      />
                      <label
                        htmlFor={`lifestyle-${option}`}
                        className="text-sm text-teal-900 cursor-pointer"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-teal-900">Tính cách của bạn</Label>
                <div className="grid grid-cols-2 gap-2 p-4 bg-amber-50 rounded-lg border-2 border-amber-100">
                  {personalityOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`personality-${option}`}
                        checked={personality.includes(option)}
                        onCheckedChange={() => toggleArrayItem(personality, setPersonality, option)}
                        className="border-amber-400 data-[state=checked]:bg-amber-600"
                      />
                      <label
                        htmlFor={`personality-${option}`}
                        className="text-sm text-teal-900 cursor-pointer"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-teal-900">Sở thích (không bắt buộc)</Label>
                <Textarea
                  placeholder="VD: Đọc sách, chơi thể thao, xem phim..."
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  className="border-amber-200 focus:border-amber-600 min-h-20"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1 border-teal-600 text-teal-700 hover:bg-teal-50"
              >
                Quay lại
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={lifestyle.length === 0 || personality.length === 0}
              >
                Tiếp theo
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-amber-100" />
              </div>
              <h2 className="text-teal-900 mb-2">Mong Muốn Về Người Ở Ghép</h2>
              <p className="text-teal-700">Bạn muốn tìm người ở ghép như thế nào?</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-teal-900">Giới tính mong muốn</Label>
                <Select value={preferredGender} onValueChange={setPreferredGender}>
                  <SelectTrigger className="border-teal-200 focus:border-teal-600">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nam">Chỉ nam</SelectItem>
                    <SelectItem value="Nữ">Chỉ nữ</SelectItem>
                    <SelectItem value="Nam nữ">Nam nữ đều được</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-teal-900">Lối sống mong muốn (không bắt buộc)</Label>
                <div className="grid grid-cols-2 gap-2 p-4 bg-teal-50 rounded-lg border-2 border-teal-100 max-h-48 overflow-y-auto">
                  {lifestyleOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`pref-lifestyle-${option}`}
                        checked={preferredLifestyle.includes(option)}
                        onCheckedChange={() => toggleArrayItem(preferredLifestyle, setPreferredLifestyle, option)}
                        className="border-teal-400 data-[state=checked]:bg-teal-600"
                      />
                      <label
                        htmlFor={`pref-lifestyle-${option}`}
                        className="text-sm text-teal-900 cursor-pointer"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-teal-900">Tính cách mong muốn (không bắt buộc)</Label>
                <div className="grid grid-cols-2 gap-2 p-4 bg-teal-50 rounded-lg border-2 border-teal-100">
                  {personalityOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`pref-personality-${option}`}
                        checked={preferredPersonality.includes(option)}
                        onCheckedChange={() => toggleArrayItem(preferredPersonality, setPreferredPersonality, option)}
                        className="border-teal-400 data-[state=checked]:bg-teal-600"
                      />
                      <label
                        htmlFor={`pref-personality-${option}`}
                        className="text-sm text-teal-900 cursor-pointer"
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-teal-900">Yêu cầu khác (không bắt buộc)</Label>
                <Textarea
                  placeholder="VD: Không hút thuốc, không mang bạn về phòng..."
                  value={otherPreferences}
                  onChange={(e) => setOtherPreferences(e.target.value)}
                  className="border-teal-200 focus:border-teal-600 min-h-20"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(2)}
                variant="outline"
                className="flex-1 border-teal-600 text-teal-700 hover:bg-teal-50"
              >
                Quay lại
              </Button>
              <Button
                onClick={() => setStep(4)}
                className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Tiếp theo
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Home className="w-8 h-8 text-teal-100" />
              </div>
              <h2 className="text-teal-900 mb-2">Thông Tin Thuê Trọ</h2>
              <p className="text-teal-700">Giúp chúng tôi tìm phòng phù hợp với bạn</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-teal-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Ngân sách (triệu đồng/tháng) - Không bắt buộc
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    placeholder="Từ"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    className="border-amber-200 focus:border-amber-600"
                  />
                  <Input
                    type="number"
                    placeholder="Đến"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    className="border-amber-200 focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-teal-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Quận mong muốn (không bắt buộc)
                </Label>
                <div className="grid grid-cols-3 gap-2 p-4 bg-amber-50 rounded-lg border-2 border-amber-100 max-h-48 overflow-y-auto">
                  {districtOptions.map((district) => (
                    <div key={district} className="flex items-center space-x-2">
                      <Checkbox
                        id={`district-${district}`}
                        checked={preferredDistricts.includes(district)}
                        onCheckedChange={() => toggleArrayItem(preferredDistricts, setPreferredDistricts, district)}
                        className="border-amber-400 data-[state=checked]:bg-amber-600"
                      />
                      <label
                        htmlFor={`district-${district}`}
                        className="text-sm text-teal-900 cursor-pointer"
                      >
                        {district}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-teal-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Ngày dự kiến chuyển vào (không bắt buộc)
                </Label>
                <Input
                  type="date"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="border-amber-200 focus:border-amber-600"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(3)}
                variant="outline"
                className="flex-1 border-teal-600 text-teal-700 hover:bg-teal-50"
              >
                Quay lại
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Đang lưu..." : "Hoàn thành"}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 mx-1 rounded-full transition-all duration-300 ${
                  s <= step
                    ? "bg-gradient-to-r from-teal-600 to-amber-600"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-teal-700">
            Bước {step} / 4
          </p>
        </div>

        <Card className="border-2 border-teal-100 shadow-xl bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-teal-900 text-center">Hoàn Thiện Hồ Sơ</CardTitle>
            <CardDescription className="text-center">
              Điền đầy đủ thông tin để tìm phòng trọ và người ở ghép phù hợp
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-teal-700 mt-4">
          Thông tin của bạn sẽ được bảo mật và chỉ hiển thị cho người dùng phù hợp
        </p>
      </div>
    </div>
  );
}