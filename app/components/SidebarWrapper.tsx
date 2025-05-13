"use client";
import { Conversation } from "@/types/conversations";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/app/components/SidebarButtons";
import { LogoButton } from "@/app/components/ToolbarButtons";
import { useEffect, useState } from "react";
import { ChatSidebar } from "@/app/components/ChatSidebar";

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

  useEffect(() => {
    // Only runs on client
    const updateWidth = () => setWindowWidth(window.innerWidth);

    updateWidth(); // Set initial width
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);
  const shouldShowTrigger =
    windowWidth !== null && (windowWidth < 768 || !open);

  return (
    <div className="flex w-full">
      {isLoading ? (
        <ChatSidebar conversations={[]} isLoading={true} />
      ) : (
        <ChatSidebar conversations={conversations} isLoading={false} />
      )}
      <div className="p-2 flex flex-col h-screen w-full">
        <div className="min-h-12 px-3 pb-2 w-full flex flex-row items-center position-sticky top-0 border-b justify-between">
          {shouldShowTrigger ? <SidebarTrigger /> : <div />}

          <LogoButton />
        </div>

        {children}
      </div>
    </div>
  );
}
