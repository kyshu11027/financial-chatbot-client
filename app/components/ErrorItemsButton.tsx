"use client";
import { usePlaid } from "@/app/context/PlaidContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function ErrorItemsButton() {
  const { errorItems, loading } = usePlaid();

  if (loading) {
    return (
      <Button
        variant="destructive"
        size="sm"
        className="text-sm text-foreground w-full"
        disabled
      >
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Loading...
      </Button>
    );
  }

  return (
    <Link href="/chat/plaid-update">
      <Button
        variant="destructive"
        size="sm"
        className="text-sm text-foreground w-full"
      >
        Fix Bank Connection Issues ({errorItems.length})
      </Button>
    </Link>
  );
}
