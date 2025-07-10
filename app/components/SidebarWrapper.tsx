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
import { ConsentDialog } from "@/app/components/ConsentDialog";
import PlaidLinkComponent from "@/app/components/PlaidLink";
import ErrorItemsButton from "@/app/components/ErrorItemsButton";
import { usePlaid } from "@/app/context/PlaidContext";

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
  const { errorItems } = usePlaid();

  useEffect(() => {
    // Only runs on client
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth(); // Set initial width
    const throttledUpdate = throttle(updateWidth, 150);
    window.addEventListener("resize", throttledUpdate);
    return () => window.removeEventListener("resize", throttledUpdate);
  }, []);

  const shouldShowTrigger =
    windowWidth !== null && (windowWidth < 768 || !open);

  return (
    <>
      <ConsentDialog />
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
        <div className="p-2 flex flex-col container w-full">
          <div className="h-[3rem] px-3 pb-2 w-full flex flex-row items-center position-sticky top-0 border-b justify-between">
            {shouldShowTrigger ? (
              <SidebarTrigger windowWidth={windowWidth} />
            ) : (
              <div />
            )}
            {user?.status === SubscriptionStatus.INACTIVE ? (
              <SubscribeButton />
            ) : errorItems.length > 0 ? (
              <ErrorItemsButton />
            ) : (
              <PlaidLinkComponent />
            )}
            <ProfileDropdown />
          </div>

          {children}
        </div>
      </div>
    </>
  );
}
