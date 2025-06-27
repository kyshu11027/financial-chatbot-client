"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { fetchStripeSession } from "@/lib/stripe";
import { useAuth } from "@/app/context/AuthContext";
import { LoaderCircle } from "lucide-react";

export default function SubscribePage() {
  const router = useRouter();
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = () => {
    setLoading(true);
    const startStripeSession = async () => {
      try {
        const response = await fetchStripeSession(session);

        if (!response) {
          throw new Error("Failed to create Stripe session");
        }
        router.push(response.url);
      } catch (error) {
        console.error("Error fetching Stripe session:", error);
        window.alert(
          "An error occurred while starting the subscription process. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    startStripeSession();
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative">
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/chat")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      <div
        className="flex flex-col items-center justify-center w-full"
        style={{ minHeight: "60vh" }}
      >
        <h1 className="text-4xl font-bold tracking-tight  mb-8 text-center">
          Penny Financial Advisor
        </h1>
        <Card className="w-full max-w-xs border-2 border-primary">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <h2 className="text-2xl font-bold mb-2">Subscribe</h2>
            <p className="text-lg mb-4">
              $5<span className="text-base font-normal">/month</span>
            </p>
            <Button
              disabled={loading}
              onClick={handleSubscribe}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleSubscribe();
              }}
              className="w-full mt-2"
            >
              {loading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                "Subscribe Now"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
