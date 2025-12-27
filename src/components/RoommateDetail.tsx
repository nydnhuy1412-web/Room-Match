import { useState } from 'react';
import { ArrowLeft, Phone, Briefcase, Heart, MessageCircle, Target, MapPin, DollarSign, Calendar, Mail, MessageSquare } from 'lucide-react';
import type { User } from '../App';

interface RoommateDetailProps {
  roommate: User;
  currentUser: User | null;
  onBack: () => void;
}

export function RoommateDetail({ roommate, currentUser, onBack }: RoommateDetailProps) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const handleContact = () => {
    setShowContactModal(true);
  };

  const handleSendMessage = () => {
    // In real app, this would send a message
    alert(`Tin nhắn đã gửi đến ${roommate.name}!`);
    setShowContactModal(false);
    setContactMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 -left-4 w-32 h-32 bg-white rounded-full blur-2xl" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xl">
                <span className="text-indigo-600 text-3xl">{roommate.name.charAt(0)}</span>
              </div>
              <div className="text-white flex-1">
                <h1 className="text-white mb-2">{roommate.name}</h1>
                <p className="text-indigo-100">{roommate.age} tuổi • {roommate.gender}</p>
                <div className="mt-3 flex gap-2">
                  <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                    🔍 Đang tìm người ở ghép
                  </div>
                  {roommate.hasRoom !== undefined && (
                    <div
                      className={`inline-block px-3 py-1 backdrop-blur-sm rounded-full text-sm ${
                        roommate.hasRoom
                          ? 'bg-green-500/30 border border-green-300'
                          : 'bg-blue-500/30 border border-blue-300'
                      }`}
                    >
                      {roommate.hasRoom ? '✓ Đã có trọ' : '🏠 Chưa có trọ'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8 space-y-6">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nghề nghiệp</p>
                  <p className="text-gray-900">{roommate.occupation}</p>
                </div>
              </div>

              {roommate.budget && (
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngân sách</p>
                    <p className="text-gray-900">
                      {(roommate.budget.min / 1000000).toFixed(1)} - {(roommate.budget.max / 1000000).toFixed(1)} triệu/tháng
                    </p>
                  </div>
                </div>
              )}

              {roommate.moveInDate && (
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dự kiến chuyển vào</p>
                    <p className="text-gray-900">{roommate.moveInDate}</p>
                  </div>
                </div>
              )}

              {roommate.preferredDistricts && roommate.preferredDistricts.length > 0 && (
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Khu vực mong muốn</p>
                    <p className="text-gray-900">{roommate.preferredDistricts.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-3 text-gray-700 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <Phone className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Số điện thoại</p>
                <p className="text-gray-900">{roommate.phone}</p>
              </div>
            </div>

            {/* Lifestyle */}
            {roommate.lifestyle && (
              <div className="flex items-start gap-3 text-gray-700">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-2">Lối sống</p>
                  <p className="text-gray-600 leading-relaxed bg-orange-50 p-4 rounded-lg">
                    {roommate.lifestyle}
                  </p>
                </div>
              </div>
            )}

            {/* Personality */}
            {roommate.personality && (
              <div className="flex items-start gap-3 text-gray-700">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-2">Tính cách</p>
                  <p className="text-gray-600 leading-relaxed bg-blue-50 p-4 rounded-lg">
                    {roommate.personality}
                  </p>
                </div>
              </div>
            )}

            {/* Preferences */}
            {roommate.preferences && (
              <div className="flex items-start gap-3 text-gray-700">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-2">Mong muốn tìm người ở ghép</p>
                  <p className="text-gray-600 leading-relaxed bg-purple-50 p-4 rounded-lg">
                    {roommate.preferences}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex gap-4">
            <button
              onClick={handleContact}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Gửi tin nhắn</span>
            </button>
            <a
              href={`tel:${roommate.phone}`}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              <span>Gọi điện</span>
            </a>
          </div>
        </div>
      </main>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-gray-900 mb-4">Gửi tin nhắn đến {roommate.name}</h2>
            <p className="text-gray-600 mb-4">
              Giới thiệu bản thân và nói về mong muốn của bạn:
            </p>
            <textarea
              value={contactMessage}
              onChange={(e) => setContactMessage(e.target.value)}
              placeholder="Xin chào! Tôi tên là... Tôi đang tìm người ở ghép vì..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-4"
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800">
                💡 Thông tin của bạn: {currentUser?.name} - {currentUser?.phone}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSendMessage}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Gửi tin nhắn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}