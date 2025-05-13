import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarWrapper from "@/app/components/SidebarWrapper";
import { createClient } from "@/utils/supabase/server";
import { fetchConversations } from "@/lib/conversations";
import { redirect } from "next/navigation";

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

  const conversations = await fetchConversations(session.access_token);

  return (
    <SidebarProvider>
      <SidebarWrapper isLoading={false} conversations={conversations}>
        {children}
      </SidebarWrapper>
    </SidebarProvider>
  );
}
