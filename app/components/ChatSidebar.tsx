"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
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
import { Conversation } from "@/types/conversations";
import ConversationDropdown from "./ConversationDropdown";
import { useAuth } from "@/app/context/AuthContext";
import { updateTitle } from "@/lib/conversations";

interface SidebarProps {
  conversations: Conversation[];
  isLoading: boolean;
}

export function ChatSidebar({ conversations, isLoading }: SidebarProps) {
  const params = useParams();
  const { conversation_id } = params;
  const [conversationsClient, setConversations] =
    useState<Conversation[]>(conversations);
  const [editingId, setEditingId] = useState<string>("");
  const [editingTitle, setEditingTitle] = useState<string>("");
  const { session, loading } = useAuth();

  const handleEditing = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditingTitle(conversation.title);
  };

  const handleSave = async (conversation: Conversation, title: string) => {
    if (!session || loading) return;
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversation.id ? { ...conv, title: title } : conv
      )
    );
    setEditingId("");
    if (conversation.title === title) {
      return;
    }

    await updateTitle(session.access_token, conversation.id, title);
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row drop-shadow-lg justify-between items-center gap-2">
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
                {[...conversationsClient]
                  .reverse()
                  .map((conversation: Conversation) => (
                    <SidebarMenuItem key={conversation.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={conversation.id === conversation_id}
                      >
                        <Link href={`/chat/${conversation.id}`}>
                          {editingId === conversation.id ? (
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleSave(
                                  conversation,
                                  e.currentTarget.textContent || ""
                                )
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  e.currentTarget.blur(); // Trigger onBlur to exit editing
                                }
                              }}
                              autoFocus
                              className="bg-transparent cursor-text"
                            >
                              {editingTitle}
                            </div>
                          ) : (
                            <div
                              onDoubleClick={() => handleEditing(conversation)}
                              className="truncate w-full flex flex-row justify-between align-middle items-center"
                            >
                              <span className="w-full truncate align-middle">
                                {conversation.title}
                              </span>
                              <ConversationDropdown
                                handleEditing={handleEditing}
                                conversation={conversation}
                                setConversations={setConversations}
                              />
                            </div>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-2 px-2 py-4">
        <PlaidLinkComponent />
      </SidebarFooter>
    </Sidebar>
  );
}
