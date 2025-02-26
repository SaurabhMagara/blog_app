"use client";

import axios from "axios";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define user state type
interface User {
  _id: string;
  username: string;
  email: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create Context with undefined default to enforce provider usage
const UserContext = createContext<UserState | undefined>(undefined);

// ✅ Provider Component
export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // Load user from cookies when the app starts
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get("/api/auth", {
          withCredentials: true,
        });
        setUser((prev )=>({...prev,
          _id : response.data.data._id,
          email : response.data.data.email,
          username : response.data.data.username
        }));
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// ✅ Custom Hook
export const useUserContext = (): UserState => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};
