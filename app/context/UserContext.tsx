"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/user";
import { useAuth } from "@/app/context/AuthContext";
import { fetchUser } from "@/lib/user";

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  refreshUser: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { session } = useAuth();

  const fetch = async () => {
    try {
      setUser(await fetchUser(session));
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session) return;
    fetch();
  }, [session]);

  return (
    <UserContext.Provider
      value={{ user, loading, setUser, refreshUser: fetch }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext);
};
