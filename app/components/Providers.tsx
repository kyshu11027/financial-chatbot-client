"use client";

import { AuthProvider } from "@/app/context/AuthContext";
import { PlaidProvider } from "@/app/context/PlaidContext";
import { UserProvider } from "@/app/context/UserContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <PlaidProvider>{children}</PlaidProvider>
      </UserProvider>
    </AuthProvider>
  );
}
