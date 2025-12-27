import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { projectId, publicAnonKey } from "./supabase/info";
import { authService } from "./authService";

type AuthUser = {
  id: string;
  name: string;
  phone: string;
  profileCompleted?: boolean;
  age?: number;
  gender?: string;
  occupation?: string;
  lifestyle?: string;
  personality?: string;
  preferences?: string;
  university?: string;
  yearOfStudy?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  accessToken: string | null;
  signIn: (user: AuthUser, token: string) => void;
  signOut: () => void;
  updateProfile: (name: string, phone: string) => Promise<void>;
  completeProfile: (profileData: any) => void;
  favorites: string[];
  viewed: string[];
  toggleFavorite: (roomId: string) => Promise<void>;
  markAsViewed: (roomId: string) => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewed, setViewed] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Load favorites and viewed when user changes
  useEffect(() => {
    if (user && accessToken) {
      loadFavorites();
      loadViewed();
    }
  }, [user, accessToken]);

  const checkSession = async () => {
    // First check localStorage for session
    const session = authService.getCurrentSession();
    
    if (!session) {
      setIsLoading(false);
      return;
    }

    // Check if backend is available
    const backendAvailable = await authService.checkBackend();
    
    if (backendAvailable) {
      // Try to validate session with backend
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ef0f32bc/auth/session`,
          {
            headers: {
              "Authorization": `Bearer ${session.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Session check failed:", response.status);
          authService.signOut();
          setIsLoading(false);
          return;
        }

        const data = await response.json();

        if (data.user) {
          setUser(data.user);
          setAccessToken(session.accessToken);
        } else {
          authService.signOut();
        }
      } catch (error) {
        console.error("Session check error:", error);
        // Fallback to local session
        setUser(session.user);
        setAccessToken(session.accessToken);
      }
    } else {
      // Use local session
      setUser(session.user);
      setAccessToken(session.accessToken);
    }

    setIsLoading(false);
  };

  const signIn = (user: AuthUser, token: string) => {
    setUser(user);
    setAccessToken(token);
    localStorage.setItem("accessToken", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const signOut = async () => {
    const backendAvailable = await authService.checkBackend();
    
    try {
      if (backendAvailable && accessToken) {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ef0f32bc/auth/signout`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
            },
          }
        );
      }
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      authService.signOut();
      setUser(null);
      setAccessToken(null);
      setFavorites([]);
      setViewed([]);
    }
  };

  const updateProfile = async (name: string, phone: string) => {
    if (!accessToken || !user) return;

    const backendAvailable = await authService.checkBackend();

    if (backendAvailable) {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ef0f32bc/user/profile`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ name, phone }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Update profile error:", error);
        throw error;
      }
    } else {
      // Update local profile
      const updatedUser = authService.updateLocalProfile(user.id, { name, phone });
      setUser(updatedUser);
    }
  };

  const completeProfile = (profileData: any) => {
    if (!user) return;

    const updatedUser = { 
      ...user, 
      ...profileData,
      profileCompleted: true 
    };

    setUser(updatedUser);

    // Update local storage
    authService.updateLocalProfile(user.id, updatedUser);
  };

  const loadFavorites = async () => {
    if (!accessToken || !user) return;

    const backendAvailable = await authService.checkBackend();

    if (backendAvailable) {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ef0f32bc/favorites`,
          {
            headers: {
              "Authorization": `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setFavorites(data.favorites || []);
        }
      } catch (error) {
        console.error("Load favorites error:", error);
        // Load from localStorage with userId
        const localFavorites = localStorage.getItem(`favorites_${user.id}`);
        if (localFavorites) {
          setFavorites(JSON.parse(localFavorites));
        }
      }
    } else {
      // Load from localStorage with userId
      const localFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (localFavorites) {
        setFavorites(JSON.parse(localFavorites));
      }
    }
  };

  const loadViewed = async () => {
    if (!accessToken || !user) return;

    const backendAvailable = await authService.checkBackend();

    if (backendAvailable) {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ef0f32bc/viewed`,
          {
            headers: {
              "Authorization": `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setViewed(data.viewed || []);
        }
      } catch (error) {
        console.error("Load viewed error:", error);
        // Load from localStorage with userId
        const localViewed = localStorage.getItem(`viewed_${user.id}`);
        if (localViewed) {
          setViewed(JSON.parse(localViewed));
        }
      }
    } else {
      // Load from localStorage with userId
      const localViewed = localStorage.getItem(`viewed_${user.id}`);
      if (localViewed) {
        setViewed(JSON.parse(localViewed));
      }
    }
  };

  const toggleFavorite = async (roomId: string) => {
    if (!accessToken || !user) return;

    const isFavorite = favorites.includes(roomId);
    const method = isFavorite ? "DELETE" : "POST";
    
    const backendAvailable = await authService.checkBackend();

    if (backendAvailable) {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ef0f32bc/favorites/${roomId}`,
          {
            method,
            headers: {
              "Authorization": `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setFavorites(data.favorites || []);
        }
      } catch (error) {
        console.error("Toggle favorite error:", error);
        throw error;
      }
    } else {
      // Toggle in localStorage with userId
      const newFavorites = isFavorite
        ? favorites.filter(id => id !== roomId)
        : [...favorites, roomId];
      setFavorites(newFavorites);
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    }
  };

  const markAsViewed = async (roomId: string) => {
    if (!accessToken || !user || viewed.includes(roomId)) return;

    const backendAvailable = await authService.checkBackend();

    if (backendAvailable) {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-ef0f32bc/viewed/${roomId}`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setViewed(data.viewed || []);
        }
      } catch (error) {
        console.error("Mark as viewed error:", error);
      }
    } else {
      // Mark in localStorage with userId
      const newViewed = [...viewed, roomId];
      setViewed(newViewed);
      localStorage.setItem(`viewed_${user.id}`, JSON.stringify(newViewed));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        signIn,
        signOut,
        updateProfile,
        completeProfile,
        favorites,
        viewed,
        toggleFavorite,
        markAsViewed,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}