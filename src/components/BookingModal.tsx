import { useState } from 'react';
import { X, Calendar, Clock, CheckCircle, Loader2 } from 'lucide-react';
import type { User, Room } from '../App';
import { useHistory } from '../utils/historyContext';

interface BookingModalProps {
  room: Room;
  currentUser: User | null;
  onClose: () => void;
}

export function BookingModal({ room, currentUser, onClose }: BookingModalProps) {
  const { saveBookingHistory } = useHistory();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      shortLabel: date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' }),
    };
  });

  const availableTimes = [
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
  ];

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Vui lòng chọn ngày và giờ xem phòng!');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Save booking to history
    saveBookingHistory({
      id: `booking-${Date.now()}`,
      roomId: room.id,
      roomTitle: room.title,
      roomAddress: room.address,
      roomDistrict: room.district,
      roomPrice: room.price,
      date: selectedDate,
      time: selectedTime,
      note: note,
      status: 'confirmed',
      createdAt: new Date(),
      landlordName: room.landlord?.name,
      landlordPhone: room.landlord?.phone,
    });
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-gray-900 mb-2">Đăng ký thành công!</h3>
          <p className="text-gray-600 mb-6">
            Bạn đã đăng ký xem phòng vào{' '}
            <span className="text-indigo-600">
              {availableDates.find(d => d.value === selectedDate)?.label}
            </span>{' '}
            lúc <span className="text-indigo-600">{selectedTime}</span>
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-2">
              📱 {room.landlord?.name} sẽ liên hệ bạn qua số:
            </p>
            <p className="text-blue-900">{currentUser?.phone}</p>
          </div>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-xl flex items-center justify-between">
          <div>
            <h2 className="text-white mb-2">Đăng ký xem phòng</h2>
            <p className="text-indigo-100">{room.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Room Info */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Thông tin phòng:</p>
            <p className="text-gray-900">{room.address}, {room.district}</p>
            <p className="text-indigo-600 mt-1">{(room.price / 1000000).toFixed(1)} triệu/tháng</p>
          </div>

          {/* Select Date */}
          <div>
            <label className="block text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>Chọn ngày xem phòng</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {availableDates.map((date) => (
                <button
                  key={date.value}
                  onClick={() => setSelectedDate(date.value)}
                  className={`px-4 py-3 border-2 rounded-lg transition-all text-left ${
                    selectedDate === date.value
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {date.label}
                </button>
              ))}
            </div>
          </div>

          {/* Select Time */}
          <div>
            <label className="block text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <span>Chọn giờ xem phòng</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-4 py-2 border-2 rounded-lg transition-all ${
                    selectedTime === time
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-gray-700 mb-2">
              Ghi chú (không bắt buộc)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Tôi muốn xem cả khu vực xung quanh..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* User Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-2">Thông tin của bạn:</p>
            <p className="text-blue-900">{currentUser?.name}</p>
            <p className="text-blue-900">{currentUser?.phone}</p>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Xác nhận đăng ký'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}