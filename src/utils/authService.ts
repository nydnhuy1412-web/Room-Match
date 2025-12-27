import { projectId, publicAnonKey } from "./supabase/info";

export type AuthMode = "supabase" | "local";

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  [key: string]: any;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

class AuthService {
  private mode: AuthMode = "supabase";
  private backendAvailable: boolean | null = null;

  /**
   * Check if Supabase backend is available
   */
  async checkBackend(): Promise<boolean> {
    if (this.backendAvailable !== null) {
      return this.backendAvailable;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-ef0f32bc/health`,
        {
          method: "GET",
          signal: AbortSignal.timeout(3000), // 3 second timeout
        }
      );

      if (response.ok) {
        const data = await response.json();
        this.backendAvailable = data.status === "ok";
        this.mode = "supabase";
        return true;
      }

      this.backendAvailable = false;
      this.mode = "local";
      return false;
    } catch (error) {
      console.log("Backend not available, using local storage mode");
      this.backendAvailable = false;
      this.mode = "local";
      return false;
    }
  }

  /**
   * Sign in with either Supabase or localStorage
   */
<<<<<<< HEAD
  async signIn(phone: string, password: string): Promise<AuthResponse> {
=======
  async signIn(phone: string, password: string, name?: string): Promise<AuthResponse> {
>>>>>>> bd99e80f3ea55281486402e7fe4d7ad094e65b07
    await this.checkBackend();

    if (this.mode === "supabase") {
      return this.signInSupabase(phone, password);
    } else {
<<<<<<< HEAD
      return this.signInLocal(phone, password);
=======
      return this.signInLocal(phone, password, name);
>>>>>>> bd99e80f3ea55281486402e7fe4d7ad094e65b07
    }
  }

  /**
   * Sign up with either Supabase or localStorage
   */
  async signUp(name: string, phone: string, password: string): Promise<AuthResponse> {
    await this.checkBackend();

    if (this.mode === "supabase") {
      return this.signUpSupabase(name, phone, password);
    } else {
      return this.signUpLocal(name, phone, password);
    }
  }

  /**
   * Get current mode
   */
  getMode(): AuthMode {
    return this.mode;
  }

  /**
   * Force check backend availability (useful for retry)
   */
  async recheckBackend(): Promise<boolean> {
    this.backendAvailable = null;
    return this.checkBackend();
  }

  // Supabase methods
  private async signInSupabase(phone: string, password: string): Promise<AuthResponse> {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-ef0f32bc/auth/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ phone, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Đăng nhập thất bại");
    }

    return data;
  }

  private async signUpSupabase(name: string, phone: string, password: string): Promise<AuthResponse> {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-ef0f32bc/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ name, phone, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Đăng ký thất bại");
    }

    // Auto sign in after signup
    return this.signInSupabase(phone, password);
  }

  // Local storage methods
<<<<<<< HEAD
  private signInLocal(phone: string, password: string): AuthResponse {
=======
  private signInLocal(phone: string, password: string, name?: string): AuthResponse {
>>>>>>> bd99e80f3ea55281486402e7fe4d7ad094e65b07
    const users = this.getLocalUsers();
    
    // Initialize with demo account if no users exist
    if (users.length === 0) {
      this.initializeDemoAccount();
<<<<<<< HEAD
      return this.signInLocal(phone, password); // Retry with demo account
=======
      return this.signInLocal(phone, password, name); // Retry with demo account
>>>>>>> bd99e80f3ea55281486402e7fe4d7ad094e65b07
    }
    
    // Find user by phone and password
    let user = users.find((u) => u.phone === phone && u.password === password);

<<<<<<< HEAD
=======
    // If name is provided, also validate name
    if (name && user && user.name !== name) {
      throw new Error("Tên không khớp với tài khoản");
    }

>>>>>>> bd99e80f3ea55281486402e7fe4d7ad094e65b07
    if (!user) {
      // Check if phone exists but password is wrong
      const phoneExists = users.find((u) => u.phone === phone);
      if (phoneExists) {
        throw new Error("Mật khẩu không đúng");
      } else {
        throw new Error("Số điện thoại chưa được đăng ký. Vui lòng đăng ký tài khoản mới.");
      }
    }

    const { password: _, ...userWithoutPassword } = user;
    const accessToken = this.generateLocalToken(user.id);

    // Store current session
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    localStorage.setItem("accessToken", accessToken);

    return {
      user: userWithoutPassword,
      accessToken,
    };
  }

  private signUpLocal(name: string, phone: string, password: string): AuthResponse {
    const users = this.getLocalUsers();
    
    // Initialize demo account if needed
    if (users.length === 0) {
      this.initializeDemoAccount();
    }

    // Check if phone already exists
    if (users.find((u) => u.phone === phone)) {
      throw new Error("Số điện thoại đã được đăng ký");
    }

    const newUser = {
      id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      phone,
      password,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("localUsers", JSON.stringify(users));

    // Auto sign in
    return this.signInLocal(phone, password);
  }

  private getLocalUsers(): Array<{ id: string; name: string; phone: string; password: string; [key: string]: any }> {
    const usersJson = localStorage.getItem("localUsers");
    return usersJson ? JSON.parse(usersJson) : [];
  }

  /**
   * Initialize demo account for easy testing
   */
  private initializeDemoAccount(): void {
    const demoUser = {
      id: "demo-user-001",
      name: "Nguyễn Văn An",
      phone: "0909123456",
      password: "123456",
      createdAt: new Date().toISOString(),
    };
    
    localStorage.setItem("localUsers", JSON.stringify([demoUser]));
  }

  /**
   * Get demo account credentials
   */
  getDemoCredentials(): { phone: string; password: string } {
    return {
      phone: "0123456789",
      password: "demo123",
    };
  }

  private generateLocalToken(userId: string): string {
    return `local-token-${userId}-${Date.now()}`;
  }

  /**
   * Get current session from localStorage
   */
  getCurrentSession(): { user: AuthUser; accessToken: string } | null {
    const userJson = localStorage.getItem("currentUser");
    const accessToken = localStorage.getItem("accessToken");

    if (userJson && accessToken) {
      return {
        user: JSON.parse(userJson),
        accessToken,
      };
    }

    return null;
  }

  /**
   * Sign out
   */
  signOut(): void {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("accessToken");
  }

  /**
   * Update user profile in localStorage
   */
  updateLocalProfile(userId: string, updates: Partial<AuthUser>): AuthUser {
    const users = this.getLocalUsers();
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem("localUsers", JSON.stringify(users));

    // Update current session
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser.id === userId) {
      const { password, ...userWithoutPassword } = users[userIndex];
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }

    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  }

  /**
   * Get user profile from localStorage
   */
  getLocalProfile(userId: string): AuthUser | null {
    const users = this.getLocalUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();