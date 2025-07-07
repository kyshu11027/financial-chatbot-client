"use client";
import { useState, useRef, useEffect } from "react";
import ChatInput from "@/app/components/ChatInput";
import { createNewConversation } from "@/lib/conversations";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";

export default function ChatPage() {
  const [isReceivingMessage, setIsReceivingMessage] = useState(false);
  const { session, loading } = useAuth();
  const router = useRouter();
  const [animateInput, setAnimateInput] = useState(false); // Track animation state
  const chatInputRef = useRef<HTMLDivElement | null>(null); // Ref to ChatInput
  const [distanceToBottom, setDistanceToBottom] = useState(0); // Store distance to the bottom of the viewport

  useEffect(() => {
    // Function to calculate the distance from the bottom of ChatInput to the bottom of the viewport
    const calculateDistanceToBottom = () => {
      if (chatInputRef.current) {
        const rect = chatInputRef.current.getBoundingClientRect();
        const distance = window.innerHeight - rect.bottom; // Calculate distance from bottom of element to bottom of viewport
        setDistanceToBottom(distance);
      }
    };

    // Calculate when the component mounts or when the window is resized
    calculateDistanceToBottom();
    const throttledCalculate = debounce(calculateDistanceToBottom, 200);
    window.addEventListener("resize", throttledCalculate);

    return () => {
      window.removeEventListener("resize", throttledCalculate);
    };
  }, []);

  const onSubmit = async (message: string) => {
    if (loading || !session?.access_token) return;
    setAnimateInput(true);
    setIsReceivingMessage(true);
    const conversation_id = await createNewConversation(
      message,
      session?.access_token
    );
    router.push(`/chat/${conversation_id}?new=true`); // Pass query param indicating a new chat was created
    router.refresh();
  };

  return (
    <main className="h-full">
      <div className="flex flex-col gap-5 items-center align-center justify-center h-full">
        <motion.div
          initial={{ opacity: 100 }}
          animate={{
            opacity: animateInput ? 0 : 100, // Animate based on distance to bottom
          }}
          transition={{ duration: 0.5 }} // Smooth transition
        >
          <h1 className="text-3xl font-bold text-center justify-center">
            How can I help you today?
          </h1>
        </motion.div>

        <motion.div
          ref={chatInputRef} // Attach ref to the motion div
          initial={{ y: 0 }}
          animate={{
            y: animateInput ? `${distanceToBottom}px` : 0, // Animate based on distance to bottom
          }}
          transition={{ duration: 0.5 }} // Smooth transition
          className="flex flex-row justify-center w-full pb-2"
        >
          <ChatInput
            isReceivingMessage={isReceivingMessage}
            onSubmit={onSubmit}
          />
        </motion.div>
      </div>
    </main>
  );
}
