import { useState } from 'react';
import { User, Phone } from 'lucide-react';
import type { User as UserType } from '../App';

interface RegistrationProps {
  onComplete: (user: UserType) => void;
}

export function Registration({ onComplete }: RegistrationProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    age: '',
    gender: '',
    occupation: '',
    lifestyle: '',
    personality: '',
    preferences: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete registration
      const user: UserType = {
        id: Math.random().toString(36).substr(2, 9),
        phone: formData.phone,
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        occupation: formData.occupation,
        lifestyle: formData.lifestyle,
        personality: formData.personality,
        preferences: formData.preferences,
      };
      onComplete(user);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-indigo-600 rounded-full p-3">
            <User className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-center text-indigo-600 mb-2">Đăng Ký Tài Khoản</h1>
        <p className="text-center text-gray-600 mb-8">Tìm kiếm phòng trọ và người ở ghép phù hợp</p>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              1
            </div>
            <div className={`flex-1 h-1 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          </div>
          <div className="flex items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
            <div className={`flex-1 h-1 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            3
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-indigo-600">Thông Tin Cơ Bản</h2>
            
            <div>
              <label className="block text-gray-700 mb-2">Số Điện Thoại *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0123456789"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Họ Tên *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Tuổi *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="25"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Giới Tính *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Nghề Nghiệp *</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="Nhân viên văn phòng, Sinh viên, ..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Lifestyle */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-indigo-600">Lối Sống & Tính Cách</h2>
            
            <div>
              <label className="block text-gray-700 mb-2">Mô Tả Lối Sống</label>
              <textarea
                name="lifestyle"
                value={formData.lifestyle}
                onChange={handleChange}
                placeholder="Ví dụ: Thích sạch sẽ, gọn gàng, thường về muộn, không hút thuốc, không nuôi thú cưng..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Tính Cách</label>
              <textarea
                name="personality"
                value={formData.personality}
                onChange={handleChange}
                placeholder="Ví dụ: Hòa đồng, thân thiện, tôn trọng không gian riêng tư, thích yên tĩnh..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-indigo-600">Mong Muốn Người Ở Ghép</h2>
            
            <div>
              <label className="block text-gray-700 mb-2">Yêu Cầu & Mong Muốn</label>
              <textarea
                name="preferences"
                value={formData.preferences}
                onChange={handleChange}
                placeholder="Ví dụ: Tìm người cùng giới, đồng nghiệp, không ồn ào, chia sẻ chi phí công bằng, có thói quen sinh hoạt giống nhau..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                💡 Mô tả chi tiết giúp bạn tìm được người ở ghép phù hợp hơn!
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Quay Lại
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {step === 3 ? 'Hoàn Thành' : 'Tiếp Theo'}
          </button>
        </div>
      </div>
    </div>
  );
}
