import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  points: number;
  joinedDate: string;
  phone?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and validate with server
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("ecotrack-token");
      if (token) {
        try {
          const response = await apiClient.getProfile();
          setUser(response.user);
        } catch (error: any) {
          // Only log error if it's not a 401 (invalid/expired token)
          if (error?.message?.includes("401")) {
            console.log("Token expired or invalid, removing from storage");
          } else {
            console.error("Token validation failed:", error);
          }
          localStorage.removeItem("ecotrack-token");
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await apiClient.login({ email, password });

      // Store token and user data
      localStorage.setItem("ecotrack-token", response.token);
      setUser(response.user);

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await apiClient.register({ name, email, password });

      // Store token and user data
      localStorage.setItem("ecotrack-token", response.token);
      setUser(response.user);

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ecotrack-token");
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await apiClient.updateProfile({
        name: updates.name || user.name,
        email: updates.email || user.email,
        phone: updates.phone,
        location: updates.location,
      });

      setUser(response.user);
      return true;
    } catch (error) {
      console.error("Profile update failed:", error);
      return false;
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
