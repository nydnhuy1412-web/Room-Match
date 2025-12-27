import { ArrowLeft, MapPin, DollarSign, Users, Home, Star, Wifi, Zap, Droplet, Wind, Car, Check, CheckCircle, GraduationCap, Phone, Clock, MessageCircle, Calendar, UserCircle, Briefcase, BookOpen, UsersRound } from 'lucide-react';
import type { Room, User } from '../App';
import { ChatModal } from './ChatModal';
import { BookingModal } from './BookingModal';
import { RentalRequestModal } from './RentalRequestModal';
import { useState, useEffect } from 'react';
import { useAuth } from '../utils/authContext';

interface SharedRoomDetailProps {
  room: Room;
  currentUser: User | null;
  onBack: () => void;
}

export function SharedRoomDetail({ room, currentUser, onBack }: SharedRoomDetailProps) {
  const { markAsViewed } = useAuth();
  const [selectedTenant, setSelectedTenant] = useState<User | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLandlordChatModal, setShowLandlordChatModal] = useState(false);
  const [showRentalRequestModal, setShowRentalRequestModal] = useState(false);

  // Mark room as viewed when component mounts
  useEffect(() => {
    markAsViewed(room.id);
  }, [room.id]);

  const iconMap: { [key: string]: any } = {
    'WiFi': Wifi,
    'Điều hòa': Wind,
    'Nước nóng': Droplet,
    'Bãi xe': Car,
  };

  const handleLandlordContact = () => {
    setShowLandlordChatModal(true);
  };

  const handleRentalRequest = () => {
    setShowRentalRequestModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50">
      {/* Header với Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Quay lại</span>
              <span className="sm:hidden">Trở về</span>
            </button>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-gray-600">
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-base">Phòng Trống</span>
            </div>
            <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 bg-white text-teal-700 rounded-lg shadow-md">
              <UsersRound className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-base hidden sm:inline">Phòng Tìm Người Ở Ghép</span>
              <span className="text-xs sm:hidden">Ở Ghép</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Images Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {room.images.map((image, index) => (
            <div
              key={index}
              className="relative h-80 rounded-2xl overflow-hidden shadow-2xl group"
            >
              <img
                src={image}
                alt={`${room.title} - ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Basic Info */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-gray-900 mb-3">{room.title}</h1>
                  <div className="flex items-start gap-2 text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mt-1 text-indigo-600" />
                    <span>{room.address}, {room.district}, {room.city}</span>
                  </div>
                </div>
                {room.rating && (
                  <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-full border border-yellow-200">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-900">{room.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {room.tags && room.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {room.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-sm px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                  <DollarSign className="w-6 h-6 text-indigo-600 mb-2" />
                  <p className="text-sm text-gray-600">Giá thuê</p>
                  <p className="text-gray-900">{(room.price / 1000000).toFixed(1)}tr/tháng</p>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl border border-pink-100">
                  <Home className="w-6 h-6 text-pink-600 mb-2" />
                  <p className="text-sm text-gray-600">Diện tích</p>
                  <p className="text-gray-900">{room.area}m²</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                  <Users className="w-6 h-6 text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">Số người</p>
                  <p className="text-gray-900">{room.currentOccupants}/{room.maxOccupants} người</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100">
                  <Users className="w-6 h-6 text-orange-600 mb-2" />
                  <p className="text-sm text-gray-600">Còn trống</p>
                  <p className="text-gray-900">{room.availableSpots} chỗ</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-gray-900 mb-3">Mô tả</h3>
                <p className="text-gray-600 leading-relaxed">{room.description}</p>
              </div>
            </div>

            {/* Current Tenants Section */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-gray-900 mb-6">
                Người đang ở ({room.currentOccupants} người)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {room.tenants.map((tenant) => (
                  <div
                    key={tenant.id}
                    className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-indigo-100"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                        {tenant.avatar ? (
                          <img src={tenant.avatar} alt={tenant.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="text-2xl">{tenant.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 mb-1">{tenant.name}</h4>
                        <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                          <UserCircle className="w-4 h-4" />
                          <span>{tenant.age} tuổi • {tenant.gender}</span>
                        </div>
                        {tenant.university && tenant.yearOfStudy && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                            <GraduationCap className="w-4 h-4" />
                            <span className="line-clamp-1">{tenant.yearOfStudy}</span>
                          </div>
                        )}
                        {tenant.university && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                            <BookOpen className="w-4 h-4" />
                            <span className="line-clamp-1">{tenant.university}</span>
                          </div>
                        )}
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          <strong>Lối sống:</strong> {tenant.lifestyle}
                        </p>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          <strong>Tính cách:</strong> {tenant.personality}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedTenant(tenant)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Nhắn tin</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-gray-900 mb-6">Tiện ích</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.amenities.map((amenity, index) => {
                  const Icon = iconMap[amenity] || Check;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:shadow-md transition-all border border-indigo-100"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Service Fees */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-gray-900 mb-6">Chi phí dịch vụ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-yellow-600" />
                    <span className="text-gray-700">Điện</span>
                  </div>
                  <span className="text-gray-900">{room.serviceFees.electricity.toLocaleString()}đ/kWh</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <Droplet className="w-6 h-6 text-blue-600" />
                    <span className="text-gray-700">Nước</span>
                  </div>
                  <span className="text-gray-900">{room.serviceFees.water.toLocaleString()}đ/tháng</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-3">
                    <Wifi className="w-6 h-6 text-purple-600" />
                    <span className="text-gray-700">Internet</span>
                  </div>
                  <span className="text-gray-900">{room.serviceFees.internet.toLocaleString()}đ/tháng</span>
                </div>
                {room.serviceFees.cleaning && (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3">
                      <Check className="w-6 h-6 text-green-600" />
                      <span className="text-gray-700">Dọn dẹp</span>
                    </div>
                    <span className="text-gray-900">{room.serviceFees.cleaning.toLocaleString()}đ/tháng</span>
                  </div>
                )}
              </div>
            </div>

            {/* Nearby Places */}
            {room.nearbyPlaces && room.nearbyPlaces.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-gray-900 mb-6">Tiện ích xung quanh</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {room.nearbyPlaces.map((place, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100"
                    >
                      <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{place}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* University */}
            {room.nearbyUniversities && room.nearbyUniversities.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-xl border-2 border-blue-200">
                <div className="flex items-start gap-4">
                  <GraduationCap className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-gray-900 mb-2">Gần trường đại học</h3>
                    <p className="text-gray-700 mb-1">{room.nearbyUniversities[0]}</p>
                    {room.distanceToUniversity && (
                      <p className="text-blue-600">Khoảng cách: ≈ {room.distanceToUniversity.toFixed(1)} km</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Map */}
            {room.mapUrl && (
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <h3 className="text-gray-900 mb-6">Vị trí trên bản đồ</h3>
                <div className="relative h-96 rounded-xl overflow-hidden">
                  <iframe
                    src={room.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    className="rounded-xl"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Contact & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">
              {/* Landlord Info */}
              {room.landlord && (
                <div className="bg-white rounded-2xl p-5 shadow-xl">
                  <h3 className="text-gray-900 mb-4">Thông tin liên hệ</h3>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                        {room.landlord.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{room.landlord.name}</p>
                        <p className="text-xs text-gray-600">{room.landlord.phone}</p>
                      </div>
                    </div>
                    {room.landlord.responseTime && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 bg-green-50 p-2.5 rounded-lg border border-green-100">
                        <Clock className="w-3.5 h-3.5 text-green-600" />
                        <span>Phản hồi trong {room.landlord.responseTime}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {/* 1. NHẮN TIN */}
                    <button
                      onClick={handleLandlordContact}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg text-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Nhắn tin</span>
                    </button>

                    {/* 2. ĐẶT LỊCH XEM PHÒNG */}
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg text-sm"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Đặt lịch xem phòng</span>
                    </button>

                    {/* 3. YÊU CẦU THUÊ PHÒNG */}
                    <button
                      onClick={handleRentalRequest}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-md hover:shadow-lg text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Yêu cầu thuê phòng</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-xl border border-indigo-100">
                <h4 className="text-gray-900 mb-4">Thông tin bổ sung</h4>
                <div className="space-y-3 text-sm text-gray-700">
                  {room.hasLoft !== undefined && (
                    <div className="flex items-center justify-between">
                      <span>Gác lửng:</span>
                      <span className="font-medium">{room.hasLoft ? 'Có' : 'Không'}</span>
                    </div>
                  )}
                  {room.floor && (
                    <div className="flex items-center justify-between">
                      <span>Tầng:</span>
                      <span className="font-medium">Tầng {room.floor}</span>
                    </div>
                  )}
                  {room.verified !== undefined && (
                    <div className="flex items-center justify-between">
                      <span>Xác thực:</span>
                      <span className={`font-medium ${room.verified ? 'text-green-600' : 'text-gray-600'}`}>
                        {room.verified ? '✓ Đã xác thực' : 'Chưa xác thực'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showBookingModal && room.landlord && currentUser && (
        <BookingModal
          room={room}
          currentUser={currentUser}
          onClose={() => setShowBookingModal(false)}
        />
      )}
      {selectedTenant && currentUser && (
        <ChatModal
          tenant={selectedTenant}
          currentUser={currentUser}
          onClose={() => setSelectedTenant(null)}
          roomId={room.id}
          roomTitle={room.title}
        />
      )}
      {showLandlordChatModal && room.landlord && currentUser && (
        <ChatModal
          tenant={{
            id: 'landlord-' + room.id,
            name: room.landlord.name,
            phone: room.landlord.phone,
            age: 0,
            gender: '',
            occupation: 'Chủ trọ',
            lifestyle: '',
            personality: '',
            preferences: '',
          }}
          currentUser={currentUser}
          onClose={() => setShowLandlordChatModal(false)}
          roomId={room.id}
          roomTitle={room.title}
        />
      )}
      {showRentalRequestModal && currentUser && (
        <RentalRequestModal
          room={room}
          currentUser={currentUser}
          onClose={() => setShowRentalRequestModal(false)}
          isSharedRoom={true}
        />
      )}
    </div>
  );
}