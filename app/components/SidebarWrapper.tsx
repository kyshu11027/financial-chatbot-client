"use client";
import { Conversation } from "@/types/conversations";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/app/components/SidebarButtons";
import ProfileDropdown from "@/app/components/ProfileDropdown";
import { useEffect, useState } from "react";
import { ChatSidebar } from "@/app/components/ChatSidebar";
import { SubscribeButton } from "@/app/components/SubscribeButton";
import { useUser } from "@/app/context/UserContext";
import { SubscriptionStatus } from "@/types/user";
import throttle from "lodash.throttle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ConsentDialog } from "@/app/components/ConsentDialog";

export default function SidebarWrapper({
  children,
  isLoading,
  conversations,
}: {
  children: React.ReactNode;
  conversations: Conversation[];
  isLoading: boolean;
}) {
  const { open } = useSidebar();
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const { user } = useUser();
  const [openConsent, setOpenConsent] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    // Only runs on client
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth(); // Set initial width
    const throttledUpdate = throttle(updateWidth, 150);
    window.addEventListener("resize", throttledUpdate);
    return () => window.removeEventListener("resize", throttledUpdate);
  }, []);

  useEffect(() => {
    if (user && user.consent_retrieved === false) {
      setOpenConsent(true);
    }
  }, [user]);

  const handleConsent = async () => {
    // Dummy API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    setOpenConsent(false);
  };

  const shouldShowTrigger =
    windowWidth !== null && (windowWidth < 768 || !open);

  return (
    <>
      <ConsentDialog open={openConsent} onAgree={handleConsent} />
      <div className="flex w-full">
        {isLoading ? (
          <ChatSidebar
            windowWidth={windowWidth}
            conversations={[]}
            isLoading={true}
          />
        ) : (
          <ChatSidebar
            windowWidth={windowWidth}
            conversations={conversations}
            isLoading={false}
          />
        )}
        <div className="p-2 flex flex-col h-screen w-full">
          <div className="min-h-12 px-3 pb-2 w-full flex flex-row items-center position-sticky top-0 border-b justify-between">
            {shouldShowTrigger ? (
              <SidebarTrigger windowWidth={windowWidth} />
            ) : (
              <div />
            )}
            {user?.status === SubscriptionStatus.INACTIVE && (
              <SubscribeButton />
            )}
            <ProfileDropdown />
          </div>

          {children}
        </div>
      </div>
    </>
  );
}
