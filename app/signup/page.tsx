"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setSession } = useAuth();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log(data);

      if (error) {
        setError(error.message);
        return;
      }

      // Wait for a moment to ensure the session is properly set
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSession(data.session);
      router.push("/signup/confirm");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen relative">
      <header className="flex items-center gap-3 px-8 py-6 fixed top-0 left-0 z-10">
        <Image
          src="/logo.png"
          alt="Penny Financial Logo"
          width={40}
          height={40}
          className="drop-shadow-lg"
        />
        <span className="text-lg font-bold text-foreground drop-shadow-sm">
          Penny Financial
        </span>
      </header>
      <div className="absolute inset-0 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Create Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSignup}>
              {error && (
                <div className="text-destructive text-center">{error}</div>
              )}
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-foreground text-black"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-foreground text-black"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Sign up
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-blue-500 hover:text-blue-500/90"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
