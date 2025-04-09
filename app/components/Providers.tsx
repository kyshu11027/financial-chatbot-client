"use client";

import { AuthProvider } from "../context/AuthContext";
import { PlaidProvider } from "../context/PlaidContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PlaidProvider>{children}</PlaidProvider>
    </AuthProvider>
  );
}
