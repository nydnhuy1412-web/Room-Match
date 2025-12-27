import { Calendar, MessageCircle, Clock, CheckCircle, XCircle, ArrowLeft, MapPin, DollarSign } from 'lucide-react';
import { useState } from 'react';

export interface RentalRequest {
  id: string;
  roomId: string;
  roomTitle: string;
  roomAddress: string;
  roomPrice: number;
  roomImage: string;
  type: 'booking' | 'rental';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  scheduledDate?: string;
  scheduledTime?: string;
  message?: string;
}

interface RequestsDashboardProps {
  requests: RentalRequest[];
  onBack: () => void;
  onCancelRequest: (id: string) => void;
}

export function RequestsDashboard({ requests, onBack, onCancelRequest }: RequestsDashboardProps) {
  const [filter, setFilter] = useState<'all' | 'booking' | 'rental'>('all');

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.type === filter;
  });

  const getStatusColor = (status: RentalRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStatusIcon = (status: RentalRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: RentalRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'Đang chờ';
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại</span>
            </button>
            <h1 className="text-gray-900">Quản lý yêu cầu</h1>
            <div className="w-24" /> {/* Spacer for center alignment */}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-white text-teal-700 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tất cả ({requests.length})
            </button>
            <button
              onClick={() => setFilter('booking')}
              className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                filter === 'booking'
                  ? 'bg-white text-teal-700 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lịch xem phòng ({requests.filter(r => r.type === 'booking').length})
            </button>
            <button
              onClick={() => setFilter('rental')}
              className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                filter === 'rental'
                  ? 'bg-white text-teal-700 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yêu cầu thuê ({requests.filter(r => r.type === 'rental').length})
            </button>
          </div>
        </div>
      </header>

      {/* Requests List */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Chưa có yêu cầu nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Room Image */}
                  <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                    <img
                      src={request.roomImage}
                      alt={request.roomTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-2">{request.roomTitle}</h3>
                        <div className="flex items-start gap-2 text-gray-600 text-sm mb-2">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{request.roomAddress}</span>
                        </div>
                        <div className="flex items-center gap-2 text-indigo-600">
                          <DollarSign className="w-4 h-4" />
                          <span>{request.roomPrice.toLocaleString('vi-VN')} đ/tháng</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="text-sm">{getStatusText(request.status)}</span>
                      </div>
                    </div>

                    {/* Request Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <div className="flex items-center gap-2 text-gray-700 mb-2">
                        {request.type === 'booking' ? (
                          <Calendar className="w-4 h-4 text-green-600" />
                        ) : (
                          <MessageCircle className="w-4 h-4 text-indigo-600" />
                        )}
                        <span>
                          {request.type === 'booking' ? 'Lịch xem phòng' : 'Yêu cầu thuê phòng'}
                        </span>
                      </div>

                      {request.type === 'booking' && request.scheduledDate && request.scheduledTime && (
                        <div className="text-sm text-gray-600">
                          <p>Ngày: {request.scheduledDate}</p>
                          <p>Giờ: {request.scheduledTime}</p>
                        </div>
                      )}

                      {request.message && (
                        <div className="text-sm text-gray-600 mt-2">
                          <p className="line-clamp-2">{request.message}</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Gửi ngày {formatDate(request.createdAt)}
                      </p>

                      {request.status === 'pending' && (
                        <button
                          onClick={() => onCancelRequest(request.id)}
                          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Hủy yêu cầu
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
