"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import ChatInput from "@/app/components/ChatInput";

interface Message {
  conversation_id: string;
  user_id: string;
  sender: "UserMessage" | "AIMessage";
  message: string;
  timestamp: string;
}

export default function page() {
  const [isLoading, setLoading] = useState(true);
  const params = useParams();
  const { conversation_id } = params;
  const { session, loading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (loading || !session?.access_token) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/chat/messages/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            conversation_id,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch messages info");
        }

        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchMessages();

    setLoading(false);
  }, [session, loading]);

  return (
    <main className="h-full">
      <div className="flex flex-col gap-5 justify-between items-center h-full">
        <div className="flex flex-col w-full max-w-[48rem] gap-5 px-6">
          {messages.map((message) =>
            message.sender === "UserMessage" ? (
              <div
                key={message.timestamp}
                className="max-w-1/2 ml-auto py-4 px-6 bg-secondary border rounded-2xl "
              >
                <p className="text-lg">{message.message}</p>
              </div>
            ) : (
              <div key={message.timestamp} className="max-w-3/4 mr-auto p-4 ">
                <p className="text-lg">{message.message}</p>
              </div>
            )
          )}
        </div>

        <ChatInput />
      </div>
    </main>
  );
}
