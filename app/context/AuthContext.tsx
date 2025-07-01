"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { UserInfo } from "@/types/user";
import { fetchUserInfo } from "@/lib/user";

interface AuthContextType {
  session: Session | null;
  userInfo: UserInfo | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  userInfo: null,
  loading: true,
  setSession: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getSessionAndUserInfo = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (!session) {
        setLoading(false);
        return;
      }

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

      setLoading(false);
    };

    getSessionAndUserInfo();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  return (
    <AuthContext.Provider value={{ session, userInfo, loading, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
