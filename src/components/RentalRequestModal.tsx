import { X, Send, CheckCircle, Loader2, Calendar, Clock, FileText, Home } from 'lucide-react';
import { useState } from 'react';
import type { Room, User } from '../App';
import { toast } from 'sonner@2.0.3';

interface RentalRequestModalProps {
  room: Room;
  currentUser: User | null;
  onClose: () => void;
  isSharedRoom?: boolean;
}

export function RentalRequestModal({ room, currentUser, onClose, isSharedRoom = false }: RentalRequestModalProps) {
  const [message, setMessage] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [rentalDuration, setRentalDuration] = useState('6');
  const [specialRequests, setSpecialRequests] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Start loading animation
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate sending request
    setSent(true);
    setIsSubmitting(false);
    toast.success('Yêu cầu thuê đã được gửi!', {
      description: isSharedRoom 
        ? 'Người ở ghép sẽ nhận được thông báo và xem xét yêu cầu của bạn.'
        : 'Chủ phòng sẽ nhận được thông báo và xem xét yêu cầu của bạn.'
    });
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (sent) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-gray-900 mb-2">Đã gửi yêu cầu!</h2>
          <p className="text-gray-600">
            {isSharedRoom 
              ? 'Người ở ghép sẽ xem xét và phản hồi sớm nhất.'
              : 'Chủ phòng sẽ xem xét và phản hồi sớm nhất.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Gửi yêu cầu thuê phòng</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
          <p className="text-gray-900 mb-1">{room.title}</p>
          <p className="text-sm text-gray-600">{room.address}, {room.district}</p>
          <p className="text-indigo-600 mt-2">{room.price.toLocaleString('vi-VN')} đ/tháng</p>
        </div>

        {isSharedRoom && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-800">
              <strong>Lưu ý:</strong> Yêu cầu của bạn sẽ được gửi đến người đang ở ghép trong phòng. 
              Họ sẽ xem xét và quyết định có chấp nhận bạn làm người ở ghép hay không.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Thông tin của bạn
            </label>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-gray-900">{currentUser?.name}</p>
              <p className="text-sm text-gray-600">{currentUser?.phone}</p>
              <p className="text-sm text-gray-600">
                {currentUser?.age} tuổi • {currentUser?.gender}
              </p>
              <p className="text-sm text-gray-600">{currentUser?.occupation}</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Ngày di chuyển vào
            </label>
            <input
              type="date"
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Thời gian thuê (tháng)
            </label>
            <select
              value={rentalDuration}
              onChange={(e) => setRentalDuration(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="6">6 tháng</option>
              <option value="12">12 tháng</option>
              <option value="24">24 tháng</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Yêu cầu đặc biệt (không bắt buộc)
            </label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Mô tả bất kỳ yêu cầu đặc biệt nào bạn có..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
              rows={4}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">
              Lời nhắn (không bắt buộc)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Giới thiệu bản thân và lý do bạn muốn thuê phòng này..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Gửi yêu cầu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}