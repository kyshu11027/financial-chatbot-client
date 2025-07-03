"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, UserInfo } from "@/types/user";
import { useAuth } from "@/app/context/AuthContext";
import { fetchUser } from "@/lib/user";
import { fetchUserInfo } from "@/lib/user";

interface UserContextType {
  user: User | null;
  userInfo: UserInfo | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  userInfo: null,
  loading: true,
  setUser: () => {},
  refreshUser: async () => {},
  refreshUserInfo: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const { session } = useAuth();

  const getUser = async () => {
    try {
      setUser(await fetchUser(session));
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const getUserInfo = async () => {
    try {
      const data = await fetchUserInfo(session);

      if (data.no_user_info) {
        setUserInfo(null);
      } else {
        setUserInfo(data);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    if (!session) return;
    getUser();
    getUserInfo();
  }, [session]);

  return (
    <UserContext.Provider
      value={{
        user,
        userInfo,
        loading,
        setUser,
        refreshUser: getUser,
        refreshUserInfo: getUserInfo,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext);
};
