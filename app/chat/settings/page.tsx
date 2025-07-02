"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  XCircle,
  ArrowLeft,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import { unsubscribe } from "@/lib/stripe";
import { deleteUser } from "@/lib/user";
import { useAuth } from "@/app/context/AuthContext";
import { useUser } from "@/app/context/UserContext";
import { SubscriptionStatus } from "@/types/user";

export default function SettingsPage() {
  const [error, setError] = useState("");
  const { session } = useAuth();
  const { user, setUser } = useUser();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 4000); // auto-reset after 4s
      return;
    }
    try {
      setDeleteLoading(true);
      await deleteUser(session);

      router.push("/login");
    } catch {
      setError("Issue when deleting account. Try again.");
    } finally {
      setDeleteLoading(false);
    }
    setConfirmDelete(false);
  };

  const handleCancelSubscription = async () => {
    if (!confirmCancel) {
      setConfirmCancel(true);
      setTimeout(() => setConfirmCancel(false), 4000); // auto-reset after 4s
      return;
    }
    try {
      setCancelLoading(true);
      await unsubscribe(session);
      setUser({
        ...user!,
        status: SubscriptionStatus.INACTIVE,
      });
    } catch {
      setError("Issue when cancelling subscription. Try again.");
    } finally {
      setCancelLoading(false);
    }
    setConfirmCancel(false);
  };

  const handleCreateSubscription = () => {
    router.push("/subscribe");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative">
      {/* Back button */}
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/chat")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      {/* Error message */}
      {error && (
        <div className="mb-4 flex items-center gap-2 bg-black border border-destructive text-destructive px-4 py-2 rounded-md max-w-lg w-full">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
      <Card className="w-full max-w-lg shadow-lg border border-border">
        <CardHeader>
          <CardTitle className="text-2xl">Settings</CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your account and subscription. Deleting or cancelling your
            subscription will immediately remove your bank information and
            render Penny services inaccessible.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 py-4">
          {/* Account Section */}
          <div className="flex flex-row items-center justify-between py-2 border-b last:border-b-0">
            <div className="flex flex-col">
              <span className="text-base font-medium">Delete Account</span>
              <span className="text-sm text-muted-foreground">
                Permanently remove your account
              </span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="flex min-w-[110px] items-center gap-2 text-sm"
              onClick={handleDeleteAccount}
            >
              {deleteLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-2 w-2" />
                  {confirmDelete ? "Are you sure?" : "Delete"}
                </>
              )}
            </Button>
          </div>
          {(user?.status === SubscriptionStatus.ACTIVE ||
            user?.status === SubscriptionStatus.TRIAL) && (
            <div className="flex flex-row items-center justify-between py-2">
              <div className="flex flex-col">
                <span className="text-base font-medium">
                  {user?.status === SubscriptionStatus.ACTIVE &&
                    "Cancel Subscription"}
                  {user?.status === SubscriptionStatus.TRIAL && "Cancel Trial"}
                </span>
                <span className="text-sm text-muted-foreground">
                  Stop your monthly subscription
                </span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="flex min-w-[110px] items-center gap-2 text-sm "
                onClick={handleCancelSubscription}
              >
                {cancelLoading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <>
                    <XCircle className="h-2 w-2" />
                    {confirmCancel ? "Are you sure?" : "Cancel"}
                  </>
                )}
              </Button>
            </div>
          )}
          {user?.status === SubscriptionStatus.INACTIVE && (
            <div className="flex flex-row items-center justify-between py-2">
              <div className="flex flex-col">
                <span className="text-base font-medium">
                  Create Subscription
                </span>
                <span className="text-sm text-muted-foreground">
                  Start a monthly subscription
                </span>
              </div>
              <Button
                variant="default"
                size="sm"
                className="flex min-w-[110px] items-center gap-2 text-sm text-white"
                onClick={handleCreateSubscription}
              >
                Subscribe
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
