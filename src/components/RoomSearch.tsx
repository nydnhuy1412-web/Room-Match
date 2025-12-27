import { useState, useMemo, useEffect } from 'react';
import { Search, MapPin, DollarSign, Users, Filter, UserCircle, X, Home, UsersRound } from 'lucide-react';
import type { Room, User } from '../App';
import { RoomCard } from './RoomCard';
import { SharedRoomCard } from './SharedRoomCard';
import { RoomCardSkeleton } from './RoomCardSkeleton';
import { NotificationCenter, type Notification } from './NotificationCenter';
import { mockRooms } from '../data/mockData';
import { sharedRoomsData } from '../data/sharedRoomsData';
import { useAuth } from '../utils/authContext';

interface RoomSearchProps {
  currentUser: User | null;
  onViewRoom: (room: Room) => void;
  onViewProfile: () => void;
  onViewSharedRoom: (room: Room) => void;
}

export function RoomSearch({ currentUser, onViewRoom, onViewProfile, onViewSharedRoom }: RoomSearchProps) {
  const { user } = useAuth();
  const [searchMode, setSearchMode] = useState<'rooms' | 'shared'>('rooms');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    district: '',
    priceRange: '',
    areaRange: '',
    maxOccupants: '',
    amenities: [] as string[],
    lookingForGender: '', // Bộ lọc giới tính cho phòng ở ghép
  });
  const [showFilters, setShowFilters] = useState(false);

  // Mock notifications - In production, this would come from API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'message',
      title: 'Tin nhắn mới từ Nguyễn Văn A',
      message: 'Chào bạn, tôi muốn hỏi thêm về phòng ở Quận 1...',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false,
    },
    {
      id: '2',
      type: 'booking',
      title: 'Lịch xem phòng được xác nhận',
      message: 'Lịch xem phòng tại Quận 3 vào ngày 15/12 lúc 10:00 đã được xác nhận.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
    },
    {
      id: '3',
      type: 'rental_request',
      title: 'Yêu cầu thuê phòng đã được duyệt',
      message: 'Chúc mừng! Yêu cầu thuê phòng của bạn đã được chủ trọ chấp nhận.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
    },
  ]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Simulate initial loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchMode]);

  const priceRanges = [
    { label: 'Dưới 2 triệu', min: 0, max: 2000000 },
    { label: '2 - 3 triệu', min: 2000000, max: 3000000 },
    { label: '3 - 4 triệu', min: 3000000, max: 4000000 },
    { label: '4 - 5 triệu', min: 4000000, max: 5000000 },
    { label: '5 - 7 triệu', min: 5000000, max: 7000000 },
    { label: '7 - 8 triệu', min: 7000000, max: 8000000 },
    { label: 'Trên 8 triệu', min: 8000000, max: Infinity },
  ];

  const areaRanges = [
    { label: 'Dưới 20m²', min: 0, max: 20 },
    { label: '20 - 30m²', min: 20, max: 30 },
    { label: '30 - 40m²', min: 30, max: 40 },
    { label: 'Trên 40m²', min: 40, max: Infinity },
  ];

  const availableAmenities = [
    'WiFi',
    'Điều hòa',
    'Nước nóng',
    'Bãi xe',
    'An ninh 24/7',
    'Thang máy',
    'Máy giặt',
    'Tủ lạnh',
  ];

  // Filter for available rooms (phòng trống)
  const filteredRooms = useMemo(() => {
    // Lọc phòng trống (availableSpots === maxOccupants hoặc currentOccupants === 0)
    const emptyRooms = mockRooms.filter(r => r.currentOccupants === 0 || r.availableSpots === r.maxOccupants);
    
    return emptyRooms.filter(room => {
      // Search term
      if (searchTerm && !room.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !room.address.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !room.district.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // District filter
      if (filters.district && room.district !== filters.district) {
        return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const range = priceRanges.find(r => r.label === filters.priceRange);
        if (range && (room.price < range.min || room.price > range.max)) {
          return false;
        }
      }

      // Area range filter
      if (filters.areaRange) {
        const range = areaRanges.find(r => r.label === filters.areaRange);
        if (range && (room.area < range.min || room.area > range.max)) {
          return false;
        }
      }

      // Occupants filter
      if (filters.maxOccupants && room.maxOccupants !== parseInt(filters.maxOccupants)) {
        return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          room.amenities.includes(amenity)
        );
        if (!hasAllAmenities) {
          return false;
        }
      }

      return true;
    });
  }, [searchTerm, filters]);

  // Filter for shared rooms (phòng tìm người ở ghép)
  const filteredSharedRooms = useMemo(() => {
    return sharedRoomsData.filter(room => {
      // Search term
      if (searchTerm && !room.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !room.address.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !room.district.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // District filter
      if (filters.district && room.district !== filters.district) {
        return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const range = priceRanges.find(r => r.label === filters.priceRange);
        if (range && (room.price < range.min || room.price > range.max)) {
          return false;
        }
      }

      // Area range filter
      if (filters.areaRange) {
        const range = areaRanges.find(r => r.label === filters.areaRange);
        if (range && (room.area < range.min || room.area > range.max)) {
          return false;
        }
      }

      // Occupants filter
      if (filters.maxOccupants && room.maxOccupants !== parseInt(filters.maxOccupants)) {
        return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          room.amenities.includes(amenity)
        );
        if (!hasAllAmenities) {
          return false;
        }
      }

      // Gender filter
      if (filters.lookingForGender && room.lookingForGender !== filters.lookingForGender) {
        return false;
      }

      return true;
    });
  }, [searchTerm, filters]);

  const districts = Array.from(new Set([...mockRooms.map(room => room.district), ...sharedRoomsData.map(room => room.district)]));

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      district: '',
      priceRange: '',
      areaRange: '',
      maxOccupants: '',
      amenities: [],
      lookingForGender: '',
    });
  };

  const hasActiveFilters = filters.district || filters.priceRange || filters.areaRange || 
                          filters.maxOccupants || filters.amenities.length > 0 || filters.lookingForGender;

  // Tính số filters đang active cho gender search
  const activeFilterCount = () => {
    let count = 0;
    if (filters.district) count++;
    if (filters.priceRange) count++;
    if (filters.areaRange) count++;
    if (filters.maxOccupants) count++;
    if (filters.lookingForGender) count++;
    count += filters.amenities.length;
    return count;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50">
      {/* Header - Thu nhỏ */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <div />
            <div className="flex items-center gap-2">
              {/* Notification Center */}
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onClear={handleClearNotification}
              />
              
              {/* User Profile Button */}
              <button
                onClick={onViewProfile}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors text-sm"
              >
                <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{currentUser?.name}</span>
              </button>
            </div>
          </div>

          {/* Mode Toggle Tabs - Thu nhỏ */}
          <div className="flex gap-1.5 sm:gap-2 mb-2.5 sm:mb-3 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setSearchMode('rooms')}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-md transition-all text-xs sm:text-sm ${
                searchMode === 'rooms'
                  ? 'bg-white text-teal-700 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Phòng Trống</span>
            </button>
            <button
              onClick={() => setSearchMode('shared')}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-all text-xs sm:text-base ${
                searchMode === 'shared'
                  ? 'bg-white text-teal-700 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UsersRound className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden md:inline">Phòng Tìm Người Ở Ghép</span>
              <span className="md:hidden">Ở Ghép</span>
            </button>
          </div>

          {/* Search Bar - Thu nhỏ */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder={searchMode === 'rooms' ? 'Tìm kiếm phòng trống...' : 'Tìm kiếm phòng có người ở...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-sm sm:text-base"
            />
          </div>

          {/* Filter Toggle */}
          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-teal-700 hover:text-teal-800"
            >
              <Filter className="w-5 h-5" />
              <span>{showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}</span>
              {hasActiveFilters && (
                <span className="bg-teal-700 text-white text-xs px-2 py-1 rounded-full">
                  {activeFilterCount()}
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
              >
                <X className="w-4 h-4" />
                <span>Xóa bộ lọc</span>
              </button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 p-6 bg-gray-50 rounded-lg space-y-6">
              {/* Room Filters */}
              {/* Row 1: Location and Occupants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">📍 Quận/Huyện</label>
                  <select
                    value={filters.district}
                    onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  >
                    <option value="">Tất cả quận/huyện</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">👥 Số người ở</label>
                  <select
                    value={filters.maxOccupants}
                    onChange={(e) => setFilters({ ...filters, maxOccupants: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  >
                    <option value="">Tất cả</option>
                    <option value="1">1 người (phòng riêng)</option>
                    <option value="2">2 người</option>
                    <option value="3">3 người</option>
                    <option value="4">4 người</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Price and Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">💰 Khoảng giá</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  >
                    <option value="">Tất cả mức giá</option>
                    {priceRanges.map(range => (
                      <option key={range.label} value={range.label}>{range.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">📏 Diện tích</label>
                  <select
                    value={filters.areaRange}
                    onChange={(e) => setFilters({ ...filters, areaRange: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  >
                    <option value="">Tất cả diện tích</option>
                    {areaRanges.map(range => (
                      <option key={range.label} value={range.label}>{range.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-gray-700 mb-3">✨ Tiện ích</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableAmenities.map(amenity => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4 text-teal-700 rounded focus:ring-2 focus:ring-teal-700"
                      />
                      <span className="text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              {searchMode === 'shared' && (
                <div>
                  <label className="block text-gray-700 mb-3">🚻 Giới tính tìm kiếm</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <label
                      className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="radio"
                        value="Nam"
                        checked={filters.lookingForGender === 'Nam'}
                        onChange={(e) => setFilters({ ...filters, lookingForGender: e.target.value })}
                        className="w-4 h-4 text-teal-700 rounded focus:ring-2 focus:ring-teal-700"
                      />
                      <span className="text-gray-700">Nam</span>
                    </label>
                    <label
                      className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="radio"
                        value="Nữ"
                        checked={filters.lookingForGender === 'Nữ'}
                        onChange={(e) => setFilters({ ...filters, lookingForGender: e.target.value })}
                        className="w-4 h-4 text-teal-700 rounded focus:ring-2 focus:ring-teal-700"
                      />
                      <span className="text-gray-700">Nữ</span>
                    </label>
                    <label
                      className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="radio"
                        value="Không yêu cầu"
                        checked={filters.lookingForGender === 'Không yêu cầu'}
                        onChange={(e) => setFilters({ ...filters, lookingForGender: e.target.value })}
                        className="w-4 h-4 text-teal-700 rounded focus:ring-2 focus:ring-teal-700"
                      />
                      <span className="text-gray-700">Không yêu cầu</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600">
            Tìm thấy <span className="text-teal-700">
              {searchMode === 'rooms' ? filteredRooms.length : searchMode === 'shared' ? filteredSharedRooms.length : 0}
            </span> {searchMode === 'rooms' ? 'phòng trống' : searchMode === 'shared' ? 'phòng đang tìm người ở ghép' : 'phòng yêu thích'}
          </p>
        </div>

        {searchMode === 'rooms' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <RoomCardSkeleton key={index} />
                ))
              ) : (
                filteredRooms.map(room => (
                  <RoomCard key={room.id} room={room} onClick={() => onViewRoom(room)} />
                ))
              )}
            </div>

            {filteredRooms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Không tìm thấy phòng phù hợp. Thử thay đổi bộ lọc!</p>
              </div>
            )}
          </>
        ) : searchMode === 'shared' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <RoomCardSkeleton key={index} />
                ))
              ) : (
                filteredSharedRooms.map(room => (
                  <SharedRoomCard key={room.id} room={room} onClick={() => onViewSharedRoom(room)} />
                ))
              )}
            </div>

            {filteredSharedRooms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Không tìm thấy phòng phù hợp. Thử thay đổi bộ lọc!</p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* favoriteRooms.map(room => (
                <RoomCard key={room.id} room={room} onClick={() => onViewRoom(room)} />
              )) */}
            </div>

            {/* {favoriteRooms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Bạn chưa có phòng yêu thích nào. Thử thêm một số phòng vào danh sách yêu thích của bạn!</p>
              </div>
            )} */}
          </>
        )}
      </main>
    </div>
  );
}