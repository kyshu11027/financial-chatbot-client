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
  const latestMessageRef = useRef<Message | null>(null);
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
    if (messages.length > 0) {
      latestMessageRef.current = messages[messages.length - 1];
    }
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
          if (latestMessageRef.current?.sender === "UserMessage") {
            const aiMessage: Message = {
              conversation_id: conversation_id,
              user_id: session?.user.id || "",
              sender: "AIMessage",
              message: "", // initially empty
              timestamp: new Date().toISOString(),
            };

            setMessages((prevMessages) => [...prevMessages, aiMessage]);
            latestMessageRef.current = aiMessage;
          }

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const lastIndex = updatedMessages.length - 1;

            updatedMessages[lastIndex] = {
              ...updatedMessages[lastIndex],
              message: updatedMessages[lastIndex].message + msg,
            };

            return updatedMessages;
          });
        }
      };

      eventSource.onerror = () => {
        console.log(
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
      return [...prevMessages, userMessage, aiMessage];
    });
  };
  return (
    <div className="flex flex-col justify-between items-center h-full">
      <div className="flex-grow overflow-x-hidden flex flex-col w-full max-w-[48rem] gap-5 px-6">
        {messages.map((message, index) =>
          message.sender === "UserMessage" ? (
            <div
              key={`${message.sender}-${message.timestamp}`}
              className="max-w-1/2 ml-auto mt-2 py-2.5 px-5 bg-secondary border rounded-3xl "
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
