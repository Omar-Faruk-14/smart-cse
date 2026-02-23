"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface UserContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any>(null);

  const fetchUserData = async () => {
    if (status === "authenticated" && session?.user?.email) {
      try {
        const token = (session as any)?.user?.accessToken;
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://smart-cse-server-eta.vercel.app";
        const res = await fetch(`${apiUrl}/users/email/${session.user.email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Context Fetch Error:", err);
      }
    } else if (status === "unauthenticated") {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [session, status]);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser: fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
