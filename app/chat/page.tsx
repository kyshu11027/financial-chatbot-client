"use client";
import ChatInput from "@/app/components/ChatInput";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function page() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const onSubmit = (message: string) => {
    const createSession = async () => {
      if (loading || !session?.access_token) return;
      try {
        const res = await fetch("http://localhost:8080/api/chat/new", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            message,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to fetch messages info");
        }

        const data = await res.json();

        const { conversation_id } = data;

        router.push(`/chat/${conversation_id}`);
        router.refresh();

      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    createSession();
  };
  return (
    <main className="h-full">
      <div className="flex flex-col gap-5 items-center align-center justify-center h-full">
        <h1 className="text-3xl font-bold">How can I help you today?</h1>
        <ChatInput onSubmit={onSubmit} />
      </div>
    </main>
  );
}
