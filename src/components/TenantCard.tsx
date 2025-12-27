import { User, Briefcase, Heart, MessageCircle } from 'lucide-react';
import type { User as UserType } from '../App';

interface TenantCardProps {
  tenant: UserType;
}

export function TenantCard({ tenant }: TenantCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all duration-300 bg-white">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center flex-shrink-0 shadow-md">
          <User className="w-7 h-7 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-3">
            <h3 className="text-gray-900 mb-0.5">{tenant.name}</h3>
            <p className="text-sm text-gray-600">{tenant.age} tuổi • {tenant.gender}</p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2">
              <Briefcase className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-600" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Nghề nghiệp</p>
                <p className="text-sm text-gray-900">{tenant.occupation}</p>
              </div>
            </div>

            {tenant.lifestyle && (
              <div className="flex items-start gap-2">
                <Heart className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">Lối sống</p>
                  <p className="text-sm text-gray-900 line-clamp-2">{tenant.lifestyle}</p>
                </div>
              </div>
            )}

            {tenant.personality && (
              <div className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">Tính cách</p>
                  <p className="text-sm text-gray-900 line-clamp-2">{tenant.personality}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}