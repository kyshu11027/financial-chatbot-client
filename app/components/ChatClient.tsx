"use client";
import { useRef, useEffect, useState, useLayoutEffect } from "react";
import ChatInput from "@/app/components/ChatInput";
import { Skeleton } from "@/components/ui/skeleton";
import { Message } from "@/types/conversations";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { sendMessage } from "@/lib/conversations";
import constants from "@/types/constants";
import ReactMarkdown from "react-markdown";

export default function ChatClient({
  serverMessages,
}: {
  serverMessages: Message[];
}) {
  const [isReceivingMessage, setIsReceivingMessage] = useState(false);
  const [messages, setMessages] = useState(serverMessages);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { conversation_id } = useParams();
  const { session, loading } = useAuth();

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

    const setUpEventSource = () => {
      if (eventSource) {
        eventSource.close();
      }

      eventSource = new EventSource(
        `${process.env.NEXT_PUBLIC_API_URL}/sse/${conversation_id}?token=${session.access_token}`
      );

      eventSource.onmessage = (event) => {
        let data = event.data;
        if (data) {
          if (data === constants.END_MESSAGE_STRING) {
            setIsReceivingMessage(false);
            return;
          }

          setIsReceivingMessage(true);

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const lastIndex = updatedMessages.length - 1;

            updatedMessages[lastIndex] = {
              ...updatedMessages[lastIndex],
              message: updatedMessages[lastIndex].message + data,
            };

            return updatedMessages;
          });
        }
      };

      eventSource.onerror = () => {
        console.log("EventSource failed, retrying in 1s...");
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
      return [...prevMessages, userMessage, aiMessage];
    });

    console.log("Message sent:", message);
  };
  return (
    <div className="flex flex-col gap-5 justify-between items-center h-full">
      <div className="flex-grow overflow-x-hidden flex flex-col w-full max-w-[48rem] gap-5 px-6">
        {messages.map((message, index) =>
          message.sender === "UserMessage" ? (
            <div
              key={`${message.sender}-${message.timestamp}`}
              className="max-w-1/2 ml-auto py-2.5 px-5 bg-secondary border rounded-3xl "
            >
              <p className="text-md">{message.message}</p>
            </div>
          ) : (
            <div key={message.timestamp} className="max-w-3/4 mr-auto p-4 ">
              {isReceivingMessage && index === messages.length - 1 ? (
                <Skeleton className="h-4 w-4 bg-foreground rounded-full" />
              ) : (
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => (
                      <p style={{ marginBottom: "1.5em" }} {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li style={{ marginBottom: "1.5em" }} {...props} />
                    ),
                    br: () => <br style={{ marginBottom: "1em" }} />,
                  }}
                >
                  {message.message}
                </ReactMarkdown>
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
