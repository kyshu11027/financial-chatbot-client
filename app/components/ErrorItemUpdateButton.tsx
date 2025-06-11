"use client";
import { Button } from "@/components/ui/button";
import { usePlaidLink } from "react-plaid-link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useCallback } from "react";
import { updatePlaidItemStatus } from "@/lib/plaid";

export default function ErrorItemUpdateButton({ item }: { item: any }) {
  const { session } = useAuth();
  const router = useRouter();

  const onSuccess = useCallback(async () => {
    await updatePlaidItemStatus(session, item.item_id);
    router.refresh();
  }, [router, session]);

  const onExit = useCallback((err: any) => {
    if (err != null) {
      console.error("Plaid Link error:", err);
    }
  }, []);

  const config = {
    token: item.link_token,
    onSuccess,
    onExit,
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <div className="flex items-center p-4 border rounded-lg gap-10">
      <div>
        <p className="font-medium">Account ID: {item.item_id}</p>
        <p className="text-sm text-muted-foreground">
          Last synced:{" "}
          {item.last_synced_at.Valid
            ? new Date(item.last_synced_at.Time).toLocaleDateString()
            : "Never"}
        </p>
      </div>
      <Button
        variant="default"
        size="sm"
        disabled={!ready}
        onClick={() => {
          if (ready) {
            open();
          }
        }}
      >
        Update Account
      </Button>
    </div>
  );
}
