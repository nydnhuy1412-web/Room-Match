import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface ChatHistory {
  id: string;
  roomId: string;
  roomTitle: string;
  tenantId: string;
  tenantName: string;
  tenantAvatar?: string;
  messages: {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
  }[];
  lastMessageTime: Date;
}

export interface BookingHistory {
  id: string;
  roomId: string;
  roomTitle: string;
  roomAddress: string;
  roomDistrict: string;
  roomPrice: number;
  date: string;
  time: string;
  note?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  landlordName?: string;
  landlordPhone?: string;
}

interface HistoryContextType {
  chatHistory: ChatHistory[];
  bookingHistory: BookingHistory[];
  saveChatHistory: (chat: ChatHistory) => void;
  saveBookingHistory: (booking: BookingHistory) => void;
  getChatHistory: (roomId: string, tenantId: string) => ChatHistory | undefined;
  clearChatHistory: (chatId: string) => void;
  clearBookingHistory: (bookingId: string) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('chatHistory');
    const savedBookings = localStorage.getItem('bookingHistory');
    
    if (savedChats) {
      try {
        const parsed = JSON.parse(savedChats);
        // Convert timestamp strings back to Date objects
        const chatsWithDates = parsed.map((chat: any) => ({
          ...chat,
          lastMessageTime: new Date(chat.lastMessageTime),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        setChatHistory(chatsWithDates);
      } catch (e) {
        console.error('Error loading chat history:', e);
      }
    }
    
    if (savedBookings) {
      try {
        const parsed = JSON.parse(savedBookings);
        // Convert timestamp strings back to Date objects
        const bookingsWithDates = parsed.map((booking: any) => ({
          ...booking,
          createdAt: new Date(booking.createdAt),
        }));
        setBookingHistory(bookingsWithDates);
      } catch (e) {
        console.error('Error loading booking history:', e);
      }
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory));
  }, [bookingHistory]);

  const saveChatHistory = useCallback((chat: ChatHistory) => {
    setChatHistory(prev => {
      const existingIndex = prev.findIndex(
        c => c.roomId === chat.roomId && c.tenantId === chat.tenantId
      );
      
      if (existingIndex >= 0) {
        // Update existing chat
        const updated = [...prev];
        updated[existingIndex] = chat;
        return updated;
      } else {
        // Add new chat
        return [...prev, chat];
      }
    });
  }, []);

  const saveBookingHistory = useCallback((booking: BookingHistory) => {
    setBookingHistory(prev => {
      // Check if already exists
      const exists = prev.some(b => b.id === booking.id);
      if (exists) {
        // Update existing
        return prev.map(b => b.id === booking.id ? booking : b);
      } else {
        // Add new
        return [booking, ...prev];
      }
    });
  }, []);

  const getChatHistory = useCallback((roomId: string, tenantId: string) => {
    return chatHistory.find(
      c => c.roomId === roomId && c.tenantId === tenantId
    );
  }, [chatHistory]);

  const clearChatHistory = useCallback((chatId: string) => {
    setChatHistory(prev => prev.filter(c => c.id !== chatId));
  }, []);

  const clearBookingHistory = useCallback((bookingId: string) => {
    setBookingHistory(prev => prev.filter(b => b.id !== bookingId));
  }, []);

  return (
    <HistoryContext.Provider
      value={{
        chatHistory,
        bookingHistory,
        saveChatHistory,
        saveBookingHistory,
        getChatHistory,
        clearChatHistory,
        clearBookingHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}