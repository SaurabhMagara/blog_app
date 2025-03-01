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
  loading : boolean
}

// Create Context with undefined default to enforce provider usage
const UserContext = createContext<UserState | undefined>(undefined);

// ✅ Provider Component
export const UserContextProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true); // ✅ Start with `true`

   useEffect(() => {
     const getUserData = async () => {
       try {
         const response = await axios.get("/api/auth", {
           withCredentials: true,
         });
         setUser({
           _id: response.data.data._id,
           email: response.data.data.email,
           username: response.data.data.username,
         });
       } catch (error) {
        //  console.error("Error fetching user:", error);
       } finally {
         setLoading(false); // ✅ Stop loading once request finishes
       }
     };

     getUserData();
   }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
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
