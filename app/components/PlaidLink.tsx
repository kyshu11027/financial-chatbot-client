"use client";

import { useCallback, useState, useEffect } from "react";
import { PlaidLinkOnSuccess, usePlaidLink } from "react-plaid-link";
import { useAuth } from "@/app/context/AuthContext";
import { usePlaid } from "@/app/context/PlaidContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function PlaidLinkComponent() {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { session, loading } = useAuth();
  const { refreshItems } = usePlaid();

  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        if (loading) {
          return;
        }

        if (!session?.access_token) {
          return;
        }

        setIsLoading(true);
        const response = await fetch("http://localhost:8080/api/plaid/create-link-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            user_id: session.user.id,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error("Link token fetch failed:", {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
          });
          throw new Error(`Failed to fetch link token: ${response.statusText}`);
        }

        const data = await response.json();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error("Error fetching link token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkToken();
  }, [session, loading]);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    async (public_token, metadata) => {
      try {
        if (!session?.access_token) {
          return;
        }

        setIsLoading(true);
        const response = await fetch("http://localhost:8080/api/plaid/exchange-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            public_token,
            user_id: session.user.id,
          }),
        });

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

  const onExit = useCallback((err: any) => {
    if (err != null) {
      console.error("Plaid Link error:", err);
    }
  }, []);
  const config = {
    token: linkToken,
    onSuccess: onSuccess,
    onExit: onExit,
  };

  const { open, ready, error } = usePlaidLink(config);
  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!session?.access_token) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Please log in to connect your bank account
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!linkToken) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Preparing Plaid connection...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Connect Your Bank Account</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center gap-4">
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg"
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
        {error && <p>Error: {error.message}</p>}
      </CardContent>
    </Card>
  );
}
