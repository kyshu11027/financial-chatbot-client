"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { session } = useAuth();

  useEffect(() => {
    if (!conversationId) return;

    // Connect to the SSE endpoint
    const eventSource = new EventSource(`http://localhost:8080/api/sse/${conversationId}`);

    eventSource.onmessage = (event) => {
      const message = event.data;
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close(); // Clean up on component unmount
    };
  }, [conversationId]);

  const sendMessage = async () => {
    if (!newMessage) return;

    try {
      const response = await fetch("http://localhost:8080/api/message/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newMessage, conversationId }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setNewMessage(""); // Clear the input after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      <h1>Chat</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            {msg}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
