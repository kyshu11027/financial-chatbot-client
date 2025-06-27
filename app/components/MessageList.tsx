import { fetchMessages } from "@/lib/conversations";
import ChatClient from "@/app/components/ChatClient";

export default async function MessageList({
  token,
  conversationId,
}: {
  token: string;
  conversationId: string;
}) {
  const messages = await fetchMessages(token, conversationId);
  return <ChatClient serverMessages={messages} />;
}
