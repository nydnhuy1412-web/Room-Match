import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner@2.0.3";
import { LogIn, UserPlus, Home, AlertCircle, Database } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { authService, AuthMode } from "../utils/authService";

type AuthProps = {
  onAuthSuccess: (user: any, accessToken: string) => void;
  onSignUpSuccess?: (user: any, accessToken: string) => void;
};

export function Auth({ onAuthSuccess, onSignUpSuccess }: AuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  
  // Sign In State
  const [signInPhone, setSignInPhone] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  
  // Sign Up State
  const [signUpName, setSignUpName] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");

  // Check backend on mount
  useEffect(() => {
    const checkMode = async () => {
      await authService.checkBackend();
      setAuthMode(authService.getMode());
    };
    checkMode();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.signIn(signInPhone, signInPassword);
      const mode = authService.getMode();
      setAuthMode(mode);

      if (mode === "local") {
        toast.success("Đăng nhập thành công (Chế độ Local - Dữ liệu lưu trên trình duyệt)");
      } else {
        toast.success("Đăng nhập thành công!");
      }

      onAuthSuccess(response.user, response.accessToken);
    } catch (error) {
      console.error("Sign in error:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi đăng nhập";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signUpPassword !== signUpConfirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (signUpPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.signUp(signUpName, signUpPhone, signUpPassword);
      const mode = authService.getMode();
      setAuthMode(mode);

      if (mode === "local") {
        toast.success("Đăng ký thành công! (Chế độ Local - Dữ liệu lưu trên trình duyệt)");
      } else {
        toast.success("Đăng ký thành công!");
      }

      if (onSignUpSuccess) {
        onSignUpSuccess(response.user, response.accessToken);
      } else {
        onAuthSuccess(response.user, response.accessToken);
      }

      // Clear sign up form
      setSignUpName("");
      setSignUpPhone("");
      setSignUpPassword("");
      setSignUpConfirmPassword("");
    } catch (error) {
      console.error("Sign up error:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi đăng ký";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryConnection = async () => {
    setIsLoading(true);
    toast.loading("Đang kiểm tra kết nối backend...");
    
    const isAvailable = await authService.recheckBackend();
    
    toast.dismiss();
    
    if (isAvailable) {
      toast.success("Đã kết nối thành công với Supabase backend!");
      setAuthMode("supabase");
    } else {
      toast.info("Backend chưa khả dụng. Sử dụng chế độ Local Storage.");
      setAuthMode("local");
    }
    
    setIsLoading(false);
  };

  const handleUseDemoAccount = async () => {
    const demoCredentials = authService.getDemoCredentials();
    setSignInPhone(demoCredentials.phone);
    setSignInPassword(demoCredentials.password);
    
    // Auto submit after credentials are set
    setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await authService.signIn(demoCredentials.phone, demoCredentials.password);
        toast.success("Đăng nhập tài khoản Demo thành công!");
        onAuthSuccess(response.user, response.accessToken);
      } catch (error) {
        console.error("Demo login error:", error);
        toast.error("Không thể đăng nhập tài khoản Demo");
      } finally {
        setIsLoading(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 mb-4 shadow-lg">
            <Home className="w-8 h-8 text-amber-100" />
          </div>
          <h1 className="text-teal-900 mb-2">Tìm Trọ & Người Ở Ghép</h1>
          <p className="text-teal-700">Kết nối nhanh chóng, dễ dàng tìm phòng</p>
        </div>

        <Card className="border-2 border-teal-100 shadow-xl bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-teal-900 text-center">Chào mừng bạn!</CardTitle>
            <CardDescription className="text-center">
              Đăng nhập hoặc tạo tài khoản mới để bắt đầu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-teal-100/50">
                <TabsTrigger 
                  value="signin"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-teal-700 data-[state=active]:text-white"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Đăng Nhập
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-700 data-[state=active]:text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Đăng Ký
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-phone" className="text-teal-900">Số điện thoại</Label>
                    <Input
                      id="signin-phone"
                      type="tel"
                      placeholder="0912345678"
                      value={signInPhone}
                      onChange={(e) => setSignInPhone(e.target.value)}
                      required
                      className="border-teal-200 focus:border-teal-600 focus:ring-teal-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-teal-900">Mật khẩu</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                      className="border-teal-200 focus:border-teal-600 focus:ring-teal-600"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-teal-900">Họ và tên</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      required
                      className="border-amber-200 focus:border-amber-600 focus:ring-amber-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone" className="text-teal-900">Số điện thoại</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="0912345678"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      required
                      className="border-amber-200 focus:border-amber-600 focus:ring-amber-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-teal-900">Mật khẩu</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                      className="border-amber-200 focus:border-amber-600 focus:ring-amber-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="text-teal-900">Xác nhận mật khẩu</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="••••••••"
                      value={signUpConfirmPassword}
                      onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                      required
                      className="border-amber-200 focus:border-amber-600 focus:ring-amber-600"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang đăng ký..." : "Đăng Ký"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-teal-700 mt-4">
          Bằng việc đăng ký, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật
        </p>
      </div>
    </div>
  );
}