"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, Loader, LoaderCircle } from "lucide-react";

export default function ChatInput({
  isReceivingMessage,
  onSubmit,
}: {
  isReceivingMessage: boolean;
  onSubmit: (message: string) => void;
}) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSubmit(message.trim());
    setMessage(""); // Clear after submit
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline
      handleSend();
    }
  };

  return (
    <Card className="w-full max-w-[48rem] border-gray-600 gap-2 px-0 py-5 rounded-[32px]">
      <CardContent>
        <Textarea
          placeholder="Ask away!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="rounded-none h-[32px] px-0 py-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent resize-none"
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          disabled={isReceivingMessage}
          size="icon"
          className="rounded-full"
          onClick={handleSend}
        >
          {isReceivingMessage ? (
            <LoaderCircle className="rotate" />
          ) : (
            <ArrowUp />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
