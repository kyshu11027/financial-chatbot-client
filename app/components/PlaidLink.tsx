"use client";
import { useCallback, useState } from "react";
import {
  PlaidLinkOnSuccess,
  usePlaidLink,
  PlaidLinkError,
} from "react-plaid-link";
import { useAuth } from "@/app/context/AuthContext";
import { usePlaid } from "@/app/context/PlaidContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function PlaidLinkComponent() {
  const { session, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { linkToken, refreshItems } = usePlaid();

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
              user_id: session.user.id,
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
      disabled={isLoading || !ready}
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
