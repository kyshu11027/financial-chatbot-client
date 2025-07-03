"use client";
import { useCallback, useState, useEffect } from "react";
import {
  PlaidLinkOnSuccess,
  usePlaidLink,
  PlaidLinkError,
} from "react-plaid-link";
import { getPlaidLinkToken } from "@/lib/plaid";
import { useUser } from "@/app/context/UserContext";
import { SubscriptionStatus } from "@/types/user";
import { useAuth } from "@/app/context/AuthContext";
import { usePlaid } from "@/app/context/PlaidContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function PlaidLinkComponent() {
  const { session, loading } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const { refreshItems } = usePlaid();
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const fetchLinkToken = async () => {
    try {
      const token = await getPlaidLinkToken(session);
      setLinkToken(token);
    } catch (err) {
      console.error("Error fetching Plaid link token:", err);
      setLinkToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinkToken();
  }, [session]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token) => {
      try {
        if (!session?.access_token) {
          return;
        }

        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/plaid/token/exchange`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              public_token,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error("Token exchange failed:", {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
          });
          throw new Error(`Failed to exchange token: ${response.statusText}`);
        }

        // Refresh the Plaid items list after successful token exchange
        await refreshItems();
      } catch (error) {
        console.error("Error exchanging public token:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [session, refreshItems]
  );

  const onExit = useCallback((err: PlaidLinkError | null) => {
    if (err != null) {
      console.error("Plaid Link error:", err);
    }
  }, []);

  const config = {
    token: linkToken,
    onSuccess: onSuccess,
    onExit: onExit,
  };

  const { open, ready } = usePlaidLink(config);
  if (loading || !linkToken) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!session?.access_token) {
    return (
      <div className="text-center text-muted-foreground">
        Please log in to connect your bank account
      </div>
    );
  }

  return (
    <Button
      variant="default"
      size="lg"
      className="text-lg text-foreground"
      disabled={
        isLoading || !ready || user?.status !== SubscriptionStatus.ACTIVE
      }
      onClick={() => open()}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        "Connect Bank Account"
      )}
    </Button>
  );
}
