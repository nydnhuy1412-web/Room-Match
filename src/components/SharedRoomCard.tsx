import { MapPin, Users, Home, Star, CheckCircle, GraduationCap, Heart, Eye } from 'lucide-react';
import type { Room } from '../App';
import { useAuth } from '../utils/authContext';
import { toast } from 'sonner';

interface SharedRoomCardProps {
  room: Room;
  onClick: () => void;
}

export function SharedRoomCard({ room, onClick }: SharedRoomCardProps) {
  const { favorites, viewed, toggleFavorite } = useAuth();
  const isFavorite = favorites.includes(room.id);
  const isViewed = viewed.includes(room.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleFavorite(room.id);
      toast.success(isFavorite ? "Đã bỏ lưu phòng" : "Đã lưu phòng yêu thích");
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group border border-amber-100"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)',
      }}
    >
      <div className="relative h-56 bg-gray-200 overflow-hidden">
        <img
          src={room.images[0]}
          alt={room.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Top Left Section - Looking For & Favorite & Viewed */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {/* Available Spots Badge */}
          {room.availableSpots > 0 && (
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-2.5 py-1 rounded-full shadow-lg text-xs whitespace-nowrap">
              🔍 Tìm {room.availableSpots} {room.lookingForGender || 'người'}
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-all duration-300 ${
              isFavorite 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Viewed Badge */}
          {isViewed && (
            <div className="bg-blue-500/90 text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs shadow-lg backdrop-blur-sm">
              <Eye className="w-3 h-3" />
              <span>Đã xem</span>
            </div>
          )}
        </div>
        
        {/* Top Right Section - Price */}
        <div className="absolute top-3 right-3">
          {/* Price Tag */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
            <span className="font-semibold text-sm">{(room.price / 1000000).toFixed(1)}tr</span>
            <span className="text-xs opacity-90">/th</span>
          </div>
        </div>
        
        {/* Bottom Section - Verified & Rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          {/* Verified Badge */}
          {room.verified && (
            <div className="bg-white/90 backdrop-blur-sm text-blue-600 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="text-xs">Xác thực</span>
            </div>
          )}

          {/* Rating */}
          {room.rating && (
            <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{room.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Tags */}
        {room.tags && room.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {room.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {room.title}
        </h3>
        
        <div className="flex items-start gap-2 text-gray-600 mb-2.5">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-600" />
          <span className="text-sm line-clamp-1">{room.address}, {room.district}</span>
        </div>

        {/* Nearby Universities */}
        {room.nearbyUniversities && room.nearbyUniversities.length > 0 && (
          <div className="mb-2.5 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-1.5 text-blue-700">
              <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-xs line-clamp-1">{room.nearbyUniversities[0]}</span>
            </div>
            {room.distanceToUniversity && (
              <span className="text-xs text-blue-600 ml-5">≈ {room.distanceToUniversity.toFixed(1)} km</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs">{room.area}m²</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs">{room.currentOccupants}/{room.maxOccupants} người</span>
          </div>
        </div>

        {/* Current Tenants */}
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">
            {room.currentOccupants} người đang ở:
          </p>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {room.tenants.slice(0, 3).map((tenant, index) => (
                <div
                  key={tenant.id}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-2 border-white flex items-center justify-center text-white text-xs shadow-md"
                  title={tenant.name}
                  style={{ zIndex: 10 - index }}
                >
                  {tenant.name.charAt(0)}
                </div>
              ))}
              {room.tenants.length > 3 && (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 border-2 border-white flex items-center justify-center text-white text-xs shadow-md">
                  +{room.tenants.length - 3}
                </div>
              )}
            </div>
            <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
              Xem chi tiết →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}