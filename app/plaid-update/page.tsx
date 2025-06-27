"use client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ErrorItemUpdateButton from "@/app/components/ErrorItemUpdateButton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePlaid } from "@/app/context/PlaidContext";

export default function PlaidUpdatePage() {
  const router = useRouter();
  const { errorItems } = usePlaid();

  useEffect(() => {
    if (errorItems.length === 0) {
      router.push("/");
    }
  }, [errorItems.length, router]);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Update Bank Connections</h1>
        <p className="text-muted-foreground mb-8">
          Some of your bank connections need to be updated. Please fix them to
          continue using the app.
        </p>
        <div className="space-y-4">
          {errorItems.map((item) => (
            <ErrorItemUpdateButton key={item.item_id} item={item} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button variant="outline" asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Chat
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
