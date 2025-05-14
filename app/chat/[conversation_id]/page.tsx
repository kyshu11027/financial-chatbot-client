import ChatClient from "@/app/components/ChatClient";
import { fetchMessages } from "@/lib/conversations";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function page({
  params,
}: {
  params: { conversation_id: string };
}) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { conversation_id } = await params;

  const messages = await fetchMessages(session.access_token, conversation_id);

  return (
    <main className="h-[calc(100%-3rem)] ">
      <ChatClient serverMessages={messages} />
    </main>
  );
}
