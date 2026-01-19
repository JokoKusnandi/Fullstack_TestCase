import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User } from "@/services/auth.service";
import { AuthService } from "@/services/auth.service";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  // login: (user: User) => void;
  signIn: (username: string, password: string) => Promise<{ error?: Error }>;
  signUp: (
    email: string,
    password: string,
    username: string
  ) => Promise<{ error?: Error }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const login = (userData: User) => {setIsAuthenticated(true); setUser(userData);}

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user]);
  
  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      // 1. Login → simpan token
      await AuthService.login({
        username, // atau email tergantung backend
        password,
      });

      // 2. Ambil user profile
      const user = await AuthService.me();

      // 3. Set user
      setUser(user);
      return {};
    } catch (error: any) {
      return { error };
    } finally {
      setLoading(false);
    }
  };


  const signUp = async (
    email: string,
    password: string,
    username: string
  ) => {
    try {
      setLoading(true);
      await AuthService.register({
        username,
        email,
        password,
      });
      // const user = await AuthService.register(email, password, fullName);
      // auto login setelah register
      await AuthService.login({
        username,
        password,
      });

      const user = await AuthService.me();
      setUser(user);
      return {};
    } catch (error: any) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("access_token");
  }
  

  return (
    <AuthContext.Provider 
    value={{ 
        isAuthenticated: !!user,
        user,
        isAdmin: user?.role?.toUpperCase() === "ADMIN",
        loading,
        signIn,
        signUp,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
