"use client";
import ChatInput from "@/app/components/ChatInput";

export default function page() {
  return (
    <main className="h-full">
      <div className="flex flex-col gap-5 items-center align-center justify-center h-full">
        <h1 className="text-3xl font-bold">How can I help you today?</h1>
        <ChatInput />
      </div>
    </main>
  );
}
