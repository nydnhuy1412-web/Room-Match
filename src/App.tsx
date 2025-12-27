import { useState } from "react";
import { Registration } from "./components/Registration";
import { RoomSearch } from "./components/RoomSearch";
import { RoomDetail } from "./components/RoomDetail";
import { SharedRoomDetail } from "./components/SharedRoomDetail";
import { UserProfile } from "./components/UserProfile";
import { Auth } from "./components/Auth";
import { ProfileCompletion } from "./components/ProfileCompletion";
import { AuthProvider, useAuth } from "./utils/authContext";
import { HistoryProvider } from "./utils/historyContext";
import { Toaster } from "./components/ui/sonner";

export type User = {
  id: string;
  phone: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  lifestyle: string;
  personality: string;
  preferences: string;
  avatar?: string;
  lookingForRoommate?: boolean;
  budget?: {
    min: number;
    max: number;
  };
  preferredDistricts?: string[];
  moveInDate?: string;
  hasRoom?: boolean;
  // Thông tin sinh viên
  university?: string;
  yearOfStudy?: string; // e.g., "Năm nhất", "Năm hai", "Năm ba", "Năm tư"
};

export type Room = {
  id: string;
  title: string;
  address: string;
  district: string;
  city: string;
  price: number;
  maxOccupants: number;
  currentOccupants: number;
  area: number;
  images: string[];
  amenities: string[];
  description: string;
  tenants: User[];
  availableSpots: number;
  serviceFees: {
    electricity: number;
    water: number;
    internet: number;
    cleaning?: number;
  };
  nearbyUniversities?: string[];
  distanceToUniversity?: number;
  tags?: string[];
  rating?: number;
  verified?: boolean;
  hasLoft?: boolean;
  floor?: number;
  nearbyPlaces?: string[];
  landlord?: {
    name: string;
    phone: string;
    responseTime?: string;
  };
  mapUrl?: string;
  lookingForGender?: 'Nam' | 'Nữ' | 'Nam nữ'; // Giới tính đang tìm cho phòng ở ghép
};

function AppContent() {
  const { user, signIn, completeProfile, accessToken, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<
    | "registration"
    | "search"
    | "detail"
    | "sharedDetail"
    | "profile"
  >("search");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(
    null,
  );

  // Convert Supabase user to User type
  const currentUser: User | null = user?.profileCompleted ? {
    id: user.id,
    phone: user.phone || '',
    name: user.user_metadata?.name || '',
    age: user.user_metadata?.age || 0,
    gender: user.user_metadata?.gender || '',
    occupation: user.user_metadata?.occupation || '',
    lifestyle: user.user_metadata?.lifestyle || '',
    personality: user.user_metadata?.personality || '',
    preferences: user.user_metadata?.preferences || '',
    university: user.user_metadata?.university || '',
    yearOfStudy: user.user_metadata?.yearOfStudy || '',
  } : null;

  const handleAuthSuccess = (authUser: any, accessToken: string) => {
    signIn(authUser, accessToken);
  };

  const handleProfileComplete = (profileData: any) => {
    completeProfile(profileData);
  };

  const handleViewRoom = (room: Room) => {
    setSelectedRoom(room);
    setCurrentView("detail");
  };

  const handleViewSharedRoom = (room: Room) => {
    setSelectedRoom(room);
    setCurrentView("sharedDetail");
  };

  const handleBackToSearch = () => {
    setCurrentView("search");
  };

  const handleViewProfile = () => {
    setCurrentView("profile");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-teal-700">Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  // Show ProfileCompletion if user hasn't completed their profile
  if (!user.profileCompleted && accessToken) {
    return (
      <ProfileCompletion
        userId={user.id}
        accessToken={accessToken}
        onComplete={handleProfileComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50">
      {currentView === "search" && (
        <RoomSearch
          currentUser={currentUser}
          onViewRoom={handleViewRoom}
          onViewSharedRoom={handleViewSharedRoom}
          onViewProfile={handleViewProfile}
        />
      )}

      {currentView === "detail" && selectedRoom && (
        <RoomDetail
          room={selectedRoom}
          currentUser={currentUser}
          onBack={handleBackToSearch}
        />
      )}

      {currentView === "sharedDetail" && selectedRoom && (
        <SharedRoomDetail
          room={selectedRoom}
          currentUser={currentUser}
          onBack={handleBackToSearch}
        />
      )}

      {currentView === "profile" && (
        <UserProfile
          user={currentUser}
          onBack={handleBackToSearch}
          onViewRoom={handleViewRoom}
          onViewSharedRoom={handleViewSharedRoom}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <HistoryProvider>
        <AppContent />
        <Toaster />
      </HistoryProvider>
    </AuthProvider>
  );
}

export default App;