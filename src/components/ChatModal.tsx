import { useState, useRef, useEffect } from 'react';
import { X, Send, Phone, Video, MoreVertical, Smile, Paperclip } from 'lucide-react';
import type { User } from '../App';
import { useHistory } from '../utils/historyContext';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatModalProps {
  tenant: User;
  currentUser: User;
  onClose: () => void;
  roomId?: string;
  roomTitle?: string;
}

export function ChatModal({ tenant, currentUser, onClose, roomId, roomTitle }: ChatModalProps) {
  const { saveChatHistory, getChatHistory } = useHistory();
  
  // Load existing chat history if available
  const existingChat = roomId && getChatHistory(roomId, tenant.id);
  
  const [messages, setMessages] = useState<Message[]>(
    existingChat?.messages || [
    {
      id: '1',
      senderId: tenant.id,
      text: `Chào ${currentUser.name}! Mình là ${tenant.name}. Bạn quan tâm đến phòng à?`,
      timestamp: new Date(Date.now() - 3600000),
      isRead: true,
    },
    {
      id: '2',
      senderId: currentUser.id,
      text: 'Chào bạn! Mình muốn hỏi về phòng và cuộc sống ở đây.',
      timestamp: new Date(Date.now() - 3000000),
      isRead: true,
    },
    {
      id: '3',
      senderId: tenant.id,
      text: 'Phòng ở đây rất tốt, chủ nhà tốt bụng. Khu vực yên tĩnh, gần chợ và trường học.',
      timestamp: new Date(Date.now() - 2400000),
      isRead: true,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  // Save chat history whenever messages change
  useEffect(() => {
    if (roomId && roomTitle && messages.length > 0) {
      saveChatHistory({
        id: `${roomId}-${tenant.id}`,
        roomId,
        roomTitle,
        tenantId: tenant.id,
        tenantName: tenant.name,
        tenantAvatar: tenant.avatar,
        messages: messages.map(m => ({
          id: m.id,
          senderId: m.senderId,
          text: m.text,
          timestamp: m.timestamp,
        })),
        lastMessageTime: messages[messages.length - 1].timestamp,
      });
    }
  }, [messages, roomId, roomTitle, tenant.id, tenant.name, tenant.avatar, saveChatHistory]);

  const handleSend = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        text: newMessage,
        timestamp: new Date(),
        isRead: false,
      };
      setMessages([...messages, message]);
      setNewMessage('');

      // Simulate tenant reply after 2 seconds
      setTimeout(() => {
        const replies = [
          'Bạn có thể đến xem phòng vào cuối tuần được không?',
          'Mình có thể giới thiệu thêm về khu vực xung quanh cho bạn.',
          'Nếu bạn cần thêm thông tin gì, cứ hỏi mình nhé!',
          'Phòng rất sạch sẽ, mình đang ở đây được 6 tháng rồi.',
        ];
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          senderId: tenant.id,
          text: replies[Math.floor(Math.random() * replies.length)],
          timestamp: new Date(),
          isRead: false,
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={tenant.avatar || `https://i.pravatar.cc/150?img=${parseInt(tenant.id.replace(/\D/g, '')) || 1}`}
                alt={tenant.name}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="text-white">
              <h3 className="font-semibold">{tenant.name}</h3>
              <p className="text-xs opacity-90">Đang hoạt động</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Phone className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Video className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors ml-2"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isCurrentUser && (
                    <img
                      src={tenant.avatar || `https://i.pravatar.cc/150?img=${parseInt(tenant.id.replace(/\D/g, '')) || 1}`}
                      alt={tenant.name}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                  )}
                  <div>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        isCurrentUser
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Paperclip className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Smile className="w-5 h-5 text-gray-500" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}