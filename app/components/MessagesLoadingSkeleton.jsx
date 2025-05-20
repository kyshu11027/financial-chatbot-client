"use client";
import ChatInput from "@/app/components/ChatInput";

export default function MessagesLoadingSkeleton() {
  return (
    <div className="flex flex-col justify-between items-center h-full">
      <div className="flex-grow overflow-x-hidden flex flex-col w-full max-w-[48rem] gap-5 px-6"></div>

      <ChatInput isReceivingMessage={false} onSubmit={() => {}} />
    </div>
  );
}
