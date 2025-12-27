import { MapPin, Briefcase, Heart, Calendar, DollarSign, UserCircle } from 'lucide-react';
import type { User } from '../App';

interface RoommateCardProps {
  roommate: User;
  onClick: () => void;
}

export function RoommateCard({ roommate, onClick }: RoommateCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group relative"
    >
      {/* Gradient Background Header */}
      <div className="h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-24 h-24 bg-white rounded-full blur-xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl" />
        </div>
      </div>

      {/* Avatar */}
      <div className="relative px-6 -mt-12">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-4 border-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <UserCircle className="w-16 h-16 text-white" />
        </div>
      </div>

      <div className="px-6 pb-6 pt-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-gray-900 group-hover:text-indigo-600 transition-colors">
              {roommate.name}
            </h3>
            <p className="text-gray-600">{roommate.age} tuổi • {roommate.gender}</p>
          </div>
          {roommate.hasRoom !== undefined && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              roommate.hasRoom 
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {roommate.hasRoom ? '✓ Có trọ' : '🔍 Tìm trọ'}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {/* Occupation */}
          <div className="flex items-start gap-3 text-gray-700">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Nghề nghiệp</p>
              <p className="truncate">{roommate.occupation}</p>
            </div>
          </div>

          {/* Budget */}
          {roommate.budget && (
            <div className="flex items-start gap-3 text-gray-700">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Ngân sách</p>
                <p className="truncate">
                  {(roommate.budget.min / 1000000).toFixed(1)} - {(roommate.budget.max / 1000000).toFixed(1)} triệu
                </p>
              </div>
            </div>
          )}

          {/* Preferred Districts */}
          {roommate.preferredDistricts && roommate.preferredDistricts.length > 0 && (
            <div className="flex items-start gap-3 text-gray-700">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Khu vực mong muốn</p>
                <p className="truncate">{roommate.preferredDistricts.slice(0, 2).join(', ')}</p>
              </div>
            </div>
          )}

          {/* Move-in Date */}
          {roommate.moveInDate && (
            <div className="flex items-start gap-3 text-gray-700">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">Dự kiến chuyển vào</p>
                <p>{roommate.moveInDate}</p>
              </div>
            </div>
          )}

          {/* Lifestyle Preview */}
          {roommate.lifestyle && (
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-pink-500 flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-600 line-clamp-2">{roommate.lifestyle}</p>
              </div>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <button className="mt-4 w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
          Xem chi tiết & Liên hệ
        </button>
      </div>
    </div>
  );
}