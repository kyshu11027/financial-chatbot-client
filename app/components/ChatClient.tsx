"use client";
import { useRef, useEffect, useState, useLayoutEffect } from "react";
import ChatInput from "@/app/components/ChatInput";
import { Skeleton } from "@/components/ui/skeleton";
import { Message } from "@/types/conversations";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { sendMessage } from "@/lib/conversations";
import constants from "@/types/constants";
import AIOutput from "@/app/components/AIOutput";

export default function ChatClient({
  serverMessages,
}: {
  serverMessages: Message[];
}) {
  const [isReceivingMessage, setIsReceivingMessage] = useState(false);
  const [messages, setMessages] = useState(serverMessages);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const latestMessageRef = useRef<Message | null>(
    serverMessages.length > 0 ? serverMessages[serverMessages.length - 1] : null
  );
  const { conversation_id } = useParams();
  const { session, loading } = useAuth();
  const searchParams = useSearchParams();

  if (typeof conversation_id !== "string") {
    throw new Error("Invalid conversation ID");
  }

  const scrollToBottom = (smooth: boolean) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setIsReceivingMessage(true);
      const aiMessage: Message = {
        conversation_id: conversation_id,
        user_id: session?.user.id || "",
        sender: "AIMessage",
        message: "", // initially empty
        timestamp: new Date().toISOString(),
      };

      // Add the placeholder message
      setMessages((prevMessages) => {
        latestMessageRef.current = aiMessage;
        return [...prevMessages, aiMessage];
      });

      const params = new URLSearchParams(window.location.search);
      params.delete("new");
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  useLayoutEffect(() => {
    scrollToBottom(false);
  }, []);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages]);

  useEffect(() => {
    if (loading || !session?.access_token || !conversation_id) return;

    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout;
    let retryCount = 0;

    const setUpEventSource = () => {
      if (retryCount >= constants.MAX_SSE_RETRIES) {
        window.alert("Stale connection with server. Please refresh the page.");
        return;
      }
      if (eventSource) {
        eventSource.close();
      }

      eventSource = new EventSource(
        `${process.env.NEXT_PUBLIC_API_URL}/sse/${conversation_id}?token=${session.access_token}`
      );

      eventSource.onopen = () => {
        retryCount = 0; // reset on success
      };

      eventSource.onmessage = (event) => {
        const data = event.data;
        if (data) {
          const parsedData = JSON.parse(data);

          const msg = parsedData.message;

          if (msg === constants.ERROR_MESSAGE_STRING) {
            setIsReceivingMessage(false);
            window.alert(
              "There was an issue generating your response. Please try again."
            );
            return;
          }

          if (msg === constants.END_MESSAGE_STRING) {
            setIsReceivingMessage(false);
            return;
          }

          setIsReceivingMessage(true);

          // If we are redirected to this page from the new conversation workflow, a new AIMessage placeholder must be created
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const lastIndex = updatedMessages.length - 1;
            const lastMessage = updatedMessages[lastIndex];

            // If last message is not an AI message, append one
            if (lastMessage?.sender !== "AIMessage") {
              const aiMessage: Message = {
                conversation_id: conversation_id,
                user_id: session?.user.id || "",
                sender: "AIMessage",
                message: "", // initially empty
                timestamp: new Date().toISOString(),
              };
              latestMessageRef.current = aiMessage;
              return [...updatedMessages, aiMessage];
            }

            // Otherwise, append new chunk to last AI message
            updatedMessages[lastIndex] = {
              ...lastMessage,
              message: lastMessage.message + msg,
            };

            latestMessageRef.current = updatedMessages[lastIndex];
            return updatedMessages;
          });
        }
      };

      eventSource.onerror = () => {
        retryCount++;
        console.error(
          `EventSource failed, retrying in ${constants.SSE_TIMEOUT / 1000}s...`
        );
        eventSource?.close();
        retryTimeout = setTimeout(setUpEventSource, constants.SSE_TIMEOUT); // Retry after 1 second
      };
    };

    setUpEventSource();

    return () => {
      eventSource?.close();
      clearTimeout(retryTimeout);
    };
  }, [conversation_id, session?.access_token, loading]);

  const onSubmit = (message: string) => {
    if (loading || !session?.access_token) {
      window.alert("Please try again.");
      return;
    }

    setIsReceivingMessage(true);
    sendMessage(session.access_token, conversation_id, message);

    const userMessage: Message = {
      conversation_id: conversation_id,
      user_id: session?.user.id || "",
      sender: "UserMessage",
      message: message,
      timestamp: new Date().toISOString(),
    };

    const aiMessage: Message = {
      conversation_id: conversation_id,
      user_id: session?.user.id || "",
      sender: "AIMessage",
      message: "", // initially empty
      timestamp: new Date().toISOString(),
    };

    // Add the placeholder message and get its index
    setMessages((prevMessages) => {
      latestMessageRef.current = aiMessage;
      return [...prevMessages, userMessage, aiMessage];
    });
  };
  return (
    <div className="flex flex-col justify-between items-center h-full">
      <div className="flex-grow overflow-x-hidden flex flex-col w-full max-w-[48rem] gap-5 px-6">
        {messages.map((message, index) =>
          message.sender === "UserMessage" ? (
            <div
              key={`${message.sender}-${message.timestamp}-${index}`}
              className="max-w-1/2 ml-auto mt-2 py-2.5 px-5 bg-secondary border rounded-3xl "
            >
              <p className="text-md">{message.message}</p>
            </div>
          ) : (
            <div
              key={`${message.sender}-${message.timestamp}-${index}`}
              className="max-w-3/4 mr-auto"
            >
              {isReceivingMessage &&
              index === messages.length - 1 &&
              message.message === "" ? (
                <Skeleton className="h-4 w-4 bg-foreground rounded-full" />
              ) : (
                <AIOutput message={message} />
              )}
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput isReceivingMessage={isReceivingMessage} onSubmit={onSubmit} />
    </div>
  );
}
