export const dynamic = "force-dynamic";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarWrapper from "@/app/components/SidebarWrapper";
import { createClient } from "@/utils/supabase/server";
import { fetchConversations } from "@/lib/conversations";
import { Conversation } from "@/types/conversations";
import { redirect } from "next/navigation";
import { UserProvider } from "@/app/context/UserContext";
import { PlaidProvider } from "@/app/context/PlaidContext";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const conversations: Conversation[] = await fetchConversations(
    session.access_token
  );

  return (
    <UserProvider>
      <PlaidProvider>
        <SidebarProvider>
          <SidebarWrapper isLoading={false} conversations={conversations}>
            {children}
          </SidebarWrapper>
        </SidebarProvider>
      </PlaidProvider>
    </UserProvider>
  );
}
