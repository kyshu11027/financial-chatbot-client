import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import {
  SidebarTrigger,
  SidebarNewConversation,
} from "@/app/components/SidebarButtons";
import UserInfoDialog from "@/app/components/UserInfoDialog";
import PlaidLinkComponent from "@/app/components/PlaidLink";
import Conversation from "@/types/chat";
import { useParams } from "next/navigation";

interface SidebarProps {
  conversations: Conversation[];
  isLoading: boolean;
}

export function ChatSidebar({ conversations, isLoading }: SidebarProps) {
  const params = useParams();
  const { conversation_id } = params;
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row justify-between items-center gap-2">
        <SidebarTrigger />
        <div>
          <UserInfoDialog />
          <SidebarNewConversation />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            {isLoading ? (
              <SidebarMenu>
                {Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : (
              <SidebarMenu>
                {[...conversations]
                  .reverse()
                  .map((conversation: Conversation) => (
                    <SidebarMenuItem key={conversation.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={conversation.id === conversation_id}
                      >
                        <Link href={`/chat/${conversation.id}`}>
                          <span>{conversation.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <PlaidLinkComponent />
      </SidebarFooter>
    </Sidebar>
  );
}
