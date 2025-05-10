"use client";
import { useEffect, useState, useContext } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/app/components/ChatSidebar";
import { SidebarTrigger } from "@/app/components/SidebarButtons";
import { useAuth } from "@/app/context/AuthContext";
import Conversation from "@/types/chat";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Use the SidebarProvider to ensure useSidebar works correctly
  const fetchConversations = async () => {
    if (loading || !session?.access_token) return;
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversation/list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch conversations");
      }

      const data = await res.json();
      setConversations(data);
    } catch (err) {
      console.error("Error loading conversations:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Call fetchConversations in useEffect
  useEffect(() => {
    fetchConversations();
  }, [session, loading]);

  return (
    <SidebarProvider>
      <SidebarWrapper isLoading={isLoading} conversations={conversations}>
        {children}
      </SidebarWrapper>
    </SidebarProvider>
  );
}

// This component is responsible for using the Sidebar context and rendering the SidebarTrigger
const SidebarWrapper = ({
  children,
  isLoading,
  conversations,
}: {
  children: React.ReactNode;
  conversations: Conversation[];
  isLoading: boolean;
}) => {
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
        <div className="min-h-12 pb-2 w-full flex flex-row items-center position-sticky top-0">
          {shouldShowTrigger && <SidebarTrigger />}
        </div>

        {children}
      </div>
    </div>
  );
};
