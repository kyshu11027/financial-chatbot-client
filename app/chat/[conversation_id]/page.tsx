"use client";
import { useParams } from "next/navigation";
export default function page() {
  const params = useParams();
  const { conversation_id } = params;
  return (
    <main>
      <h1>Chat</h1>
      <p>Chat page</p>
      <p>Conversation ID: {conversation_id}</p>
    </main>
  );
}
