import { ArrowLeft, User, Phone, Briefcase, Heart, MessageCircle, Target, LogOut, Edit, GraduationCap, Home, Sparkles, MapPin, Calendar, DollarSign, Smile, Coffee, BookOpen, Users, Clock, Eye } from 'lucide-react';
import type { User as UserType } from '../App';
import { useAuth } from '../utils/authContext';
import { useHistory } from '../utils/historyContext';
import { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { RoomCard } from './RoomCard';
import { SharedRoomCard } from './SharedRoomCard';
import { mockRooms } from '../data/mockData';
import { sharedRoomsData } from '../data/sharedRoomsData';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { authService } from '../utils/authService';

interface UserProfileProps {
  user: UserType | null;
  onBack: () => void;
  onViewRoom?: (room: any) => void;
  onViewSharedRoom?: (room: any) => void;
}

export function UserProfile({ user: propUser, onBack, onViewRoom, onViewSharedRoom }: UserProfileProps) {
  const { user: authUser, signOut, accessToken, favorites, viewed } = useAuth();
  const { chatHistory, bookingHistory, clearChatHistory, clearBookingHistory } = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'favorites' | 'viewed' | 'bookings'>('info');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fullProfile, setFullProfile] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: '',
    occupation: '',
    university: '',
    yearOfStudy: '',
    lifestyle: '',
    personality: '',
    hobbies: '',
    preferences: '',
    budget: '',
    preferredDistricts: '',
    moveInDate: '',
  });

  useEffect(() => {
    loadFullProfile();
  }, [authUser, accessToken]);

  const loadFullProfile = async () => {
    if (!authUser) {
      setIsLoading(false);
      return;
    }

    try {
      const backendAvailable = await authService.checkBackend();
      
      if (backendAvailable && accessToken) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ef0f32bc/user/profile-full`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.profile) {
          setFullProfile(data.profile);
          setFormData({
            name: data.profile.name || '',
            phone: data.profile.phone || '',
            age: data.profile.age?.toString() || '',
            gender: data.profile.gender || '',
            occupation: data.profile.occupation || '',
            university: data.profile.university || '',
            yearOfStudy: data.profile.yearOfStudy || '',
            lifestyle: data.profile.lifestyle || '',
            personality: data.profile.personality || '',
            hobbies: data.profile.hobbies || '',
            preferences: data.profile.preferences || '',
            budget: data.profile.budget || '',
            preferredDistricts: Array.isArray(data.profile.preferredDistricts) 
              ? data.profile.preferredDistricts.join(', ') 
              : data.profile.preferredDistricts || '',
            moveInDate: data.profile.moveInDate || '',
          });
        }
      } else {
        // Load from localStorage
        const localProfile = authService.getLocalProfile(authUser.id);
        
        if (localProfile) {
          setFullProfile(localProfile);
          setFormData({
            name: localProfile.name || '',
            phone: localProfile.phone || '',
            age: localProfile.age?.toString() || '',
            gender: localProfile.gender || '',
            occupation: localProfile.occupation || '',
            university: localProfile.university || '',
            yearOfStudy: localProfile.yearOfStudy || '',
            lifestyle: localProfile.lifestyle || '',
            personality: localProfile.personality || '',
            hobbies: localProfile.hobbies || '',
            preferences: localProfile.preferences || '',
            budget: localProfile.budget || '',
            preferredDistricts: Array.isArray(localProfile.preferredDistricts) 
              ? localProfile.preferredDistricts.join(', ') 
              : localProfile.preferredDistricts || '',
            moveInDate: localProfile.moveInDate || '',
          });
        } else {
          // Use authUser data as fallback
          setFullProfile(authUser);
          setFormData({
            name: authUser.name || '',
            phone: authUser.phone || '',
            age: authUser.age?.toString() || '',
            gender: authUser.gender || '',
            occupation: authUser.occupation || '',
            university: authUser.university || '',
            yearOfStudy: authUser.yearOfStudy || '',
            lifestyle: authUser.lifestyle || '',
            personality: authUser.personality || '',
            hobbies: '',
            preferences: authUser.preferences || '',
            budget: '',
            preferredDistricts: '',
            moveInDate: '',
          });
        }
      }
    } catch (error) {
      console.error('Error loading full profile:', error);
      // Fallback to authUser
      if (authUser) {
        setFullProfile(authUser);
        setFormData({
          name: authUser.name || '',
          phone: authUser.phone || '',
          age: authUser.age?.toString() || '',
          gender: authUser.gender || '',
          occupation: authUser.occupation || '',
          university: authUser.university || '',
          yearOfStudy: authUser.yearOfStudy || '',
          lifestyle: authUser.lifestyle || '',
          personality: authUser.personality || '',
          hobbies: '',
          preferences: authUser.preferences || '',
          budget: '',
          preferredDistricts: '',
          moveInDate: '',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Đăng xuất thành công');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const backendAvailable = await authService.checkBackend();
      
      const updateData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined,
        preferredDistricts: formData.preferredDistricts 
          ? formData.preferredDistricts.split(',').map(d => d.trim()).filter(Boolean)
          : [],
      };

      if (backendAvailable && accessToken) {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ef0f32bc/user/profile-full`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updateData),
          }
        );

        if (response.ok) {
          await loadFullProfile();
          toast.success('Cập nhật thông tin thành công');
          setIsEditing(false);
        } else {
          toast.error('Có lỗi xảy ra khi cập nhật thông tin');
        }
      } else {
        // Update in localStorage
        if (authUser) {
          authService.updateLocalProfile(authUser.id, updateData);
          await loadFullProfile();
          toast.success('Cập nhật thông tin thành công (Lưu trên trình duyệt)');
          setIsEditing(false);
        }
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setIsUpdating(false);
    }
  };

  // Get favorite and viewed rooms
  const favoriteRooms = [...mockRooms, ...sharedRoomsData].filter(room => favorites.includes(room.id));
  const viewedRooms = [...mockRooms, ...sharedRoomsData].filter(room => viewed.includes(room.id));

  if (!authUser) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại tìm kiếm</span>
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="text-white">
                  <h1 className="text-white mb-2">{fullProfile?.name || authUser.name}</h1>
                  <p className="text-teal-100">{fullProfile?.phone || authUser.phone}</p>
                  {fullProfile?.age && fullProfile?.gender && (
                    <p className="text-teal-100 mt-1">
                      {fullProfile.gender} • {fullProfile.age} tuổi
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all border border-white/30"
              >
                <Edit className="w-5 h-5" />
                <span>{isEditing ? 'Hủy' : 'Chỉnh sửa'}</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-6 px-8">
              <button
                onClick={() => setActiveTab('info')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'info'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>Thông tin cá nhân</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'favorites'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span>Yêu thích ({favorites.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('viewed')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'viewed'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  <span>Đã xem ({viewed.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === 'bookings'
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Lịch sử đặt phòng ({bookingHistory.length})</span>
                </div>
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {activeTab === 'info' && (
              <>
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-teal-900">Họ và tên *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="border-teal-200 focus:border-teal-600 focus:ring-teal-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-teal-900">Số điện thoại *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                          className="border-teal-200 focus:border-teal-600 focus:ring-teal-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="age" className="text-teal-900">Tuổi</Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          className="border-teal-200 focus:border-teal-600 focus:ring-teal-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-teal-900">Giới tính</Label>
                        <select
                          id="gender"
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="occupation" className="text-teal-900">Nghề nghiệp</Label>
                        <Input
                          id="occupation"
                          type="text"
                          value={formData.occupation}
                          onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                          placeholder="Ví dụ: Sinh viên, Nhân viên văn phòng..."
                          className="border-teal-200 focus:border-teal-600 focus:ring-teal-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="university" className="text-teal-900">Trường học</Label>
                        <Input
                          id="university"
                          type="text"
                          value={formData.university}
                          onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                          placeholder="Ví dụ: ĐH Khoa học Tự nhiên"
                          className="border-teal-200 focus:border-teal-600 focus:ring-teal-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yearOfStudy" className="text-teal-900">Năm học</Label>
                        <select
                          id="yearOfStudy"
                          value={formData.yearOfStudy}
                          onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                          className="w-full px-4 py-2 border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                        >
                          <option value="">Chọn năm học</option>
                          <option value="Năm nhất">Năm nhất</option>
                          <option value="Năm hai">Năm hai</option>
                          <option value="Năm ba">Năm ba</option>
                          <option value="Năm tư">Năm tư</option>
                          <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget" className="text-teal-900">Ngân sách</Label>
                        <Input
                          id="budget"
                          type="text"
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          placeholder="Ví dụ: 2-3 triệu"
                          className="border-teal-200 focus:border-teal-600 focus:ring-teal-600"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="preferredDistricts" className="text-teal-900">Quận mong muốn</Label>
                        <Input
                          id="preferredDistricts"
                          type="text"
                          value={formData.preferredDistricts}
                          onChange={(e) => setFormData({ ...formData, preferredDistricts: e.target.value })}
                          placeholder="Ví dụ: Quận 1, Quận 3, Bình Thạnh"
                          className="border-teal-200 focus:border-teal-600 focus:ring-teal-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="moveInDate" className="text-teal-900">Ngày chuyển vào</Label>
                        <Input
                          id="moveInDate"
                          type="date"
                          value={formData.moveInDate}
                          onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                          className="border-teal-200 focus:border-teal-600 focus:ring-teal-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="lifestyle" className="text-teal-900">Lối sống</Label>
                        <Textarea
                          id="lifestyle"
                          value={formData.lifestyle}
                          onChange={(e) => setFormData({ ...formData, lifestyle: e.target.value })}
                          placeholder="Mô tả lối sống của bạn..."
                          className="border-teal-200 focus:border-teal-600 focus:ring-teal-600 min-h-24"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="personality" className="text-teal-900">Tính cách</Label>
                        <Textarea
                          id="personality"
                          value={formData.personality}
                          onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                          placeholder="Mô tả tính cách của bạn..."
                          className="border-teal-200 focus:border-teal-600 focus:ring-teal-600 min-h-24"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hobbies" className="text-teal-900">Sở thích</Label>
                        <Textarea
                          id="hobbies"
                          value={formData.hobbies}
                          onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                          placeholder="Mô tả sở thích của bạn..."
                          className="border-teal-200 focus:border-teal-600 focus:ring-teal-600 min-h-24"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferences" className="text-teal-900">Mong muốn về người ở ghép</Label>
                        <Textarea
                          id="preferences"
                          value={formData.preferences}
                          onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                          placeholder="Mô tả mong muốn của bạn về người ở ghép..."
                          className="border-teal-200 focus:border-teal-600 focus:ring-teal-600 min-h-24"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {/* Personal Info Section */}
                    <div>
                      <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-teal-600" />
                        Thông tin cơ bản
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl border border-teal-100">
                          <Phone className="w-5 h-5 text-teal-600" />
                          <div>
                            <p className="text-sm text-gray-600">Số điện thoại</p>
                            <p className="text-gray-900">{fullProfile?.phone ? String(fullProfile.phone) : 'Chưa cập nhật'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                          <Users className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-600">Giới tính</p>
                            <p className="text-gray-900">{fullProfile?.gender ? String(fullProfile.gender) : 'Chưa cập nhật'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                          <Briefcase className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-600">Nghề nghiệp</p>
                            <p className="text-gray-900">{fullProfile?.occupation ? String(fullProfile.occupation) : 'Chưa cập nhật'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                          <GraduationCap className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="text-sm text-gray-600">Trường học</p>
                            <p className="text-gray-900">{fullProfile?.university ? String(fullProfile.university) : 'Chưa cập nhật'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Preferences Section */}
                    {(fullProfile?.budget || fullProfile?.preferredDistricts || fullProfile?.moveInDate) && (
                      <div>
                        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-teal-600" />
                          Tìm kiếm phòng
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {fullProfile?.budget && (
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                              <DollarSign className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="text-sm text-gray-600">Ngân sách</p>
                                <p className="text-gray-900">{String(fullProfile.budget)}</p>
                              </div>
                            </div>
                          )}
                          {fullProfile?.preferredDistricts && fullProfile.preferredDistricts.length > 0 && (
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                              <MapPin className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="text-sm text-gray-600">Quận mong muốn</p>
                                <p className="text-gray-900">
                                  {Array.isArray(fullProfile.preferredDistricts) 
                                    ? fullProfile.preferredDistricts.join(', ') 
                                    : String(fullProfile.preferredDistricts)}
                                </p>
                              </div>
                            </div>
                          )}
                          {fullProfile?.moveInDate && (
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                              <Calendar className="w-5 h-5 text-purple-600" />
                              <div>
                                <p className="text-sm text-gray-600">Ngày chuyển vào</p>
                                <p className="text-gray-900">{new Date(fullProfile.moveInDate).toLocaleDateString('vi-VN')}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Lifestyle & Personality Section */}
                    {(fullProfile?.lifestyle || fullProfile?.personality || fullProfile?.hobbies || fullProfile?.preferences) && (
                      <div>
                        <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-teal-600" />
                          Thông tin chi tiết
                        </h3>
                        <div className="space-y-4">
                          {fullProfile?.lifestyle && (
                            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                              <div className="flex items-center gap-2 mb-2">
                                <Coffee className="w-5 h-5 text-amber-600" />
                                <p className="text-gray-900">Lối sống</p>
                              </div>
                              <p className="text-gray-700 pl-7">{String(fullProfile.lifestyle)}</p>
                            </div>
                          )}
                          {fullProfile?.personality && (
                            <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100">
                              <div className="flex items-center gap-2 mb-2">
                                <Smile className="w-5 h-5 text-pink-600" />
                                <p className="text-gray-900">Tính cách</p>
                              </div>
                              <p className="text-gray-700 pl-7">{String(fullProfile.personality)}</p>
                            </div>
                          )}
                          {fullProfile?.hobbies && (
                            <div className="p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                              <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-5 h-5 text-cyan-600" />
                                <p className="text-gray-900">Sở thích</p>
                              </div>
                              <p className="text-gray-700 pl-7">{String(fullProfile.hobbies)}</p>
                            </div>
                          )}
                          {fullProfile?.preferences && (
                            <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
                              <div className="flex items-center gap-2 mb-2">
                                <Target className="w-5 h-5 text-violet-600" />
                                <p className="text-gray-900">Mong muốn về người ở ghép</p>
                              </div>
                              <p className="text-gray-700 pl-7">{String(fullProfile.preferences)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!fullProfile?.lifestyle && !fullProfile?.personality && !fullProfile?.occupation && (
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100">
                        <h3 className="text-gray-900 mb-2">Hoàn thiện hồ sơ</h3>
                        <p className="text-gray-700">
                          Hãy cập nhật thông tin chi tiết để chúng tôi có thể gợi ý những phòng trọ và người ở ghép phù hợp nhất với bạn.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h2 className="text-gray-900 mb-6">Phòng yêu thích của bạn</h2>
                {favoriteRooms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoriteRooms.map((room) => {
                      const isSharedRoom = sharedRoomsData.some(r => r.id === room.id);
                      return isSharedRoom ? (
                        <SharedRoomCard
                          key={room.id}
                          room={room}
                          onClick={() => onViewSharedRoom?.(room)}
                        />
                      ) : (
                        <RoomCard
                          key={room.id}
                          room={room}
                          onClick={() => onViewRoom?.(room)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Bạn chưa có phòng yêu thích nào</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Nhấn vào biểu tượng trái tim khi xem phòng để lưu vào danh sách yêu thích
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'viewed' && (
              <div>
                <h2 className="text-gray-900 mb-6">Phòng bạn đã xem</h2>
                {viewedRooms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {viewedRooms.map((room) => {
                      const isSharedRoom = sharedRoomsData.some(r => r.id === room.id);
                      return isSharedRoom ? (
                        <SharedRoomCard
                          key={room.id}
                          room={room}
                          onClick={() => onViewSharedRoom?.(room)}
                        />
                      ) : (
                        <RoomCard
                          key={room.id}
                          room={room}
                          onClick={() => onViewRoom?.(room)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Home className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Bạn chưa xem phòng nào</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Các phòng bạn đã xem sẽ được lưu lại tại đây
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-gray-900 mb-6">Lịch sử đặt lịch xem phòng</h2>
                {bookingHistory.length > 0 ? (
                  <div className="space-y-4">
                    {bookingHistory.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((booking) => (
                      <div key={booking.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                              <Home className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="text-gray-900">{booking.roomTitle}</h3>
                              <p className="text-sm text-gray-600">{booking.roomAddress}, {booking.roomDistrict}</p>
                              <p className="text-sm text-teal-600">{(booking.roomPrice / 1000000).toFixed(1)} triệu/tháng</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {booking.status === 'confirmed' ? 'Đã xác nhận' :
                               booking.status === 'pending' ? 'Đang chờ' :
                               'Đã hủy'}
                            </span>
                            <button
                              onClick={() => clearBookingHistory(booking.id)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-lg p-3">
                            <Calendar className="w-5 h-5 text-teal-600" />
                            <div>
                              <p className="text-sm text-gray-600">Ngày xem</p>
                              <p className="font-medium">{new Date(booking.date).toLocaleDateString('vi-VN')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-lg p-3">
                            <Clock className="w-5 h-5 text-teal-600" />
                            <div>
                              <p className="text-sm text-gray-600">Giờ xem</p>
                              <p className="font-medium">{booking.time}</p>
                            </div>
                          </div>
                        </div>
                        {booking.note && (
                          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                            <p className="text-sm text-gray-600 mb-1">Ghi chú:</p>
                            <p className="text-gray-700">{booking.note}</p>
                          </div>
                        )}
                        {booking.landlordName && (
                          <div className="mt-4 p-3 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg border border-teal-100">
                            <p className="text-sm text-gray-600 mb-1">Thông tin liên hệ:</p>
                            <p className="text-gray-900">{booking.landlordName}</p>
                            {booking.landlordPhone && (
                              <p className="text-teal-600">{booking.landlordPhone}</p>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                          <Clock className="w-4 h-4" />
                          <span>Đặt lúc: {new Date(booking.createdAt).toLocaleString('vi-VN')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Bạn chưa đặt lịch xem phòng nào</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Các lịch đặt xem phòng sẽ được lưu lại tại đây
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}