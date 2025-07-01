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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setSession } = useAuth();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        return;
      }

      setSession(data.session);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/");
    } catch (err) {
      setError(`An unexpected error occurred: ${err}`);
    } finally {
      setLoading(false);
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
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleLogin}>
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
                    className="bg-card-foreground text-black"
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
                    className="bg-card-foreground text-black"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link
                href="/signup"
                className="text-blue-500 hover:text-blue-500/90"
              >
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
