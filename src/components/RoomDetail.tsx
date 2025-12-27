import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, DollarSign, Users, Home, Wifi, Zap, Droplet, Wind, Car, Shield, CheckCircle, Receipt, MessageCircle, Calendar, Map, MapPinned, ShoppingBag, Hospital, School, Phone } from 'lucide-react';
import type { Room, User } from '../App';
import { TenantCard } from './TenantCard';
import { ChatModal } from './ChatModal';
import { BookingModal } from './BookingModal';
import { RentalRequestModal } from './RentalRequestModal';
import { useAuth } from '../utils/authContext';

interface RoomDetailProps {
  room: Room;
  currentUser: User | null;
  onBack: () => void;
}

export function RoomDetail({ room, currentUser, onBack }: RoomDetailProps) {
  const { markAsViewed } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showLandlordChatModal, setShowLandlordChatModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRentalRequestModal, setShowRentalRequestModal] = useState(false);

  // Mark room as viewed when component mounts
  useEffect(() => {
    markAsViewed(room.id);
  }, [room.id]);

  const amenityIcons: Record<string, any> = {
    'WiFi': Wifi,
    'Điện': Zap,
    'Nước': Droplet,
    'Điều hòa': Wind,
    'Bãi xe': Car,
    'An ninh 24/7': Shield,
  };

  const handleContact = () => {
    setShowChatModal(true);
  };

  const handleBooking = () => {
    setShowBookingModal(true);
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
          
          {/* Navigation Tabs - giống như trong RoomSearch */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 bg-white text-teal-700 rounded-lg shadow-md">
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-base">Phòng Trống</span>
            </div>
            <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 text-gray-600">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-base hidden sm:inline">Phòng Tìm Người Ở Ghép</span>
              <span className="text-xs sm:hidden">Ở Ghép</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-96 bg-gray-200">
                <img
                  src={room.images[selectedImage]}
                  alt={room.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 grid grid-cols-4 gap-2">
                {room.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-lg overflow-hidden ${selectedImage === index ? 'ring-2 ring-indigo-600' : ''}`}
                  >
                    <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Room Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h1 className="text-gray-900 mb-4">{room.title}</h1>
              
              <div className="flex items-start gap-2 text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>{room.address}, {room.district}, {room.city}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <DollarSign className="w-6 h-6 text-indigo-600 mb-2" />
                  <p className="text-gray-600">Giá thuê</p>
                  <p className="text-indigo-600">{room.price.toLocaleString('vi-VN')} đ</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <Home className="w-6 h-6 text-green-600 mb-2" />
                  <p className="text-gray-600">Diện tích</p>
                  <p className="text-green-600">{room.area}m²</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <Users className="w-6 h-6 text-blue-600 mb-2" />
                  <p className="text-gray-600">Đang ở</p>
                  <p className="text-blue-600">{room.currentOccupants}/{room.maxOccupants}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <CheckCircle className="w-6 h-6 text-orange-600 mb-2" />
                  <p className="text-gray-600">Còn trống</p>
                  <p className="text-orange-600">{room.availableSpots} chỗ</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-gray-900 mb-3">Mô tả</h2>
                <p className="text-gray-600 leading-relaxed">{room.description}</p>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h2 className="text-gray-900 mb-3">Tiện nghi</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {room.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity] || CheckCircle;
                    return (
                      <div key={amenity} className="flex items-center gap-2 text-gray-700">
                        <Icon className="w-5 h-5 text-indigo-600" />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Service Fees */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Receipt className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-gray-900">Phí dịch vụ</h2>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-600" />
                      <span className="text-gray-700">Tiền điện</span>
                    </div>
                    <span className="text-gray-900">{room.serviceFees.electricity.toLocaleString('vi-VN')} đ/kWh</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Tiền nước</span>
                    </div>
                    <span className="text-gray-900">{room.serviceFees.water.toLocaleString('vi-VN')} đ/m³</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-indigo-600" />
                      <span className="text-gray-700">Internet</span>
                    </div>
                    <span className="text-gray-900">{room.serviceFees.internet.toLocaleString('vi-VN')} đ/tháng</span>
                  </div>
                  {room.serviceFees.cleaning && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">Vệ sinh</span>
                      </div>
                      <span className="text-gray-900">{room.serviceFees.cleaning.toLocaleString('vi-VN')} đ/tháng</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tenants */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-gray-900 mb-4">
                Người đang ở ({room.tenants.length}/{room.maxOccupants})
              </h2>
              
              {room.tenants.length > 0 ? (
                <div className="space-y-4">
                  {room.tenants.map((tenant) => (
                    <TenantCard key={tenant.id} tenant={tenant} />
                  ))}</div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Chưa có người ở. Bạn có thể là người đầu tiên!</p>
                </div>
              )}
            </div>

            {/* Additional Room Features */}
            {(room.hasLoft !== undefined || room.floor !== undefined) && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-gray-900 mb-4">Đặc điểm phòng</h2>
                <div className="grid grid-cols-2 gap-4">
                  {room.hasLoft !== undefined && (
                    <div className="bg-purple-50 rounded-lg p-4">
                      <Home className="w-6 h-6 text-purple-600 mb-2" />
                      <p className="text-gray-600">Gác</p>
                      <p className="text-purple-600">{room.hasLoft ? 'Có gác' : 'Không gác'}</p>
                    </div>
                  )}
                  {room.floor !== undefined && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <MapPinned className="w-6 h-6 text-blue-600 mb-2" />
                      <p className="text-gray-600">Vị trí</p>
                      <p className="text-blue-600">Tầng {room.floor}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Nearby Places */}
            {room.nearbyPlaces && room.nearbyPlaces.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPinned className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-gray-900">Khu vực xung quanh</h2>
                </div>
                <div className="space-y-3">
                  {room.nearbyPlaces.map((place, index) => {
                    let Icon = ShoppingBag;
                    if (place.includes('Bệnh viện')) Icon = Hospital;
                    else if (place.includes('Trường') || place.includes('ĐH')) Icon = School;
                    
                    return (
                      <div key={index} className="flex items-center gap-3 text-gray-700 bg-gray-50 rounded-lg p-3">
                        <Icon className="w-5 h-5 text-indigo-600" />
                        <span>{place}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Google Map */}
            {room.mapUrl && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Map className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-gray-900">Vị trí trên bản đồ</h2>
                </div>
                <a
                  href={room.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg p-6 text-center hover:border-indigo-400 transition-all group"
                >
                  <MapPin className="w-12 h-12 text-indigo-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-gray-900 mb-2">Xem vị trí trên Google Maps</p>
                  <p className="text-sm text-gray-600">{room.address}, {room.district}</p>
                  <p className="text-indigo-600 mt-3 text-sm">
                    Nhấn để mở Google Maps →
                  </p>
                </a>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-5 sticky top-24 space-y-4">
              <div className="mb-5">
                <p className="text-sm text-gray-600 mb-1">Giá thuê</p>
                <p className="text-2xl text-indigo-600">{room.price.toLocaleString('vi-VN')} đ<span className="text-base">/tháng</span></p>
              </div>

              {/* Thông tin chủ trọ */}
              {room.landlord && (
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-teal-700" />
                    <h3 className="text-sm text-teal-900">Thông tin liên hệ</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Users className="w-3.5 h-3.5 text-teal-600" />
                      <span>{room.landlord.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                      <span>{room.landlord.phone}</span>
                    </div>
                    {room.landlord.responseTime && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MessageCircle className="w-3.5 h-3.5 text-teal-600" />
                        <span>Phản hồi trong {room.landlord.responseTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {room.availableSpots > 0 ? (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-800">
                      ✓ Còn {room.availableSpots} chỗ trống
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {/* 1. NHẮN TIN - Đặt lên đầu */}
                    {room.landlord && (
                      <button
                        onClick={handleLandlordContact}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Nhắn tin</span>
                      </button>
                    )}

                    {/* 2. ĐẶT LỊCH XEM PHÒNG */}
                    <button
                      onClick={handleBooking}
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

                  <p className="text-center text-gray-600 text-xs mt-4">
                    Xem thông tin người đang ở để biết thêm chi tiết
                  </p>
                </>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">
                    ✗ Phòng đã đủ người
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Chat Modal */}
      {showChatModal && room.landlord && currentUser && (
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
          onClose={() => setShowChatModal(false)}
          roomId={room.id}
          roomTitle={room.title}
        />
      )}
      
      {/* Landlord Chat Modal */}
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

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          room={room}
          currentUser={currentUser}
          onClose={() => setShowBookingModal(false)}
        />
      )}

      {/* Rental Request Modal */}
      {showRentalRequestModal && (
        <RentalRequestModal
          room={room}
          currentUser={currentUser}
          onClose={() => setShowRentalRequestModal(false)}
        />
      )}
    </div>
  );
}