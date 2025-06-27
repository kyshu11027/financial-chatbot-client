"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/user";
import { useAuth } from "@/app/context/AuthContext";
import { fetchUser } from "@/lib/user";

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    if (!session) return;
    const fetch = async () => {
      try {
        const user = await fetchUser(session);
        setUser(user);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [session]);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext);
};
