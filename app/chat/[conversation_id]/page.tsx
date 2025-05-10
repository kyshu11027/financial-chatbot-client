"use client";
import { useEffect, useState, useRef } from "react";
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  if (typeof conversation_id !== "string") {
    throw new Error("Invalid conversation ID");
  }

  const setUpEventSource = () => {
    if (loading || !session?.access_token) return;
  
    const eventSource = new EventSource(
      `http://localhost:8080/sse/${conversation_id}?token=${session.access_token}`
    );
  
    eventSource.onmessage = (event) => {
      const data = event.data;
      if (data) {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const lastIndex = updatedMessages.length - 1;
  
          // Append to the message field of the last message
          updatedMessages[lastIndex] = {
            ...updatedMessages[lastIndex],
            message: updatedMessages[lastIndex].message + data,
          };
  
          return updatedMessages;
        });
      }
    };
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages]);

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

        const aiMessage: Message = {
          conversation_id: conversation_id,
          user_id: session?.user.id || "",
          sender: "AIMessage",
          message: "", // initially empty
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => {
          return [...prevMessages, aiMessage];
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchMessages();

    setLoading(false);
  }, [session, loading]);

  useEffect(() => {
    if (loading || !session?.access_token || !conversation_id) return;

    setUpEventSource();
  }, [conversation_id, session?.access_token, loading]);
  
  const onSubmit = (message: string) => {
    if (loading || !session?.access_token) {
      window.alert("Please try again.");
      return;
    }

    const sendMessage = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/chat/messages/send",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              conversation_id,
              message,
              sender: "UserMessage",
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        window.alert("Please try again.");
        return;
      }
    };

    sendMessage();

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

    setUpEventSource()
    console.log("Message sent:", message);
  };

  return (
    <main className="h-[calc(100%-3rem)] pt-2 ">
      <div className="flex flex-col gap-5 justify-between items-center h-full">
        <div className="flex-grow overflow-x-hidden flex flex-col w-full max-w-[48rem] gap-5 px-6">
          {messages.map((message) =>
            message.sender === "UserMessage" ? (
              <div
                key={`${message.sender}-${message.timestamp}`}
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
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSubmit={onSubmit} />
      </div>
    </main>
  );
}
