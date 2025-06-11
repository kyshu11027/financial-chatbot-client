import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MessageList from "@/app/components/MessageList";
import MessagesLoadingSkeleton from "@/app/components/MessagesLoadingSkeleton";

export default async function Page({
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

  return (
    <main className="h-[calc(100%-3rem)]">
      <Suspense fallback={<MessagesLoadingSkeleton />}>
        <MessageList
          token={session.access_token}
          conversationId={conversation_id}
        />
      </Suspense>
    </main>
  );
}
