import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, LoaderCircle } from "lucide-react";
import constants from "@/types/constants";
import { useAutosizeTextArea } from "@/hooks/use-autosize-text-area"; // adjust path as needed
import { useUser } from "@/app/context/UserContext";
import { SubscriptionStatus } from "@/types/user";

export default function ChatInput({
  isReceivingMessage,
  onSubmit,
}: {
  isReceivingMessage: boolean;
  onSubmit: (message: string) => void;
}) {
  const { user, loading } = useUser();
  const [message, setMessage] = useState("");
  const textAreaRef = useAutosizeTextArea(
    message,
    constants.MAX_CHAT_INPUT_HEIGHT
  );

  const handleSend = () => {
    if (!message.trim()) return;
    onSubmit(message.trim());
    setMessage(""); // Clears textarea and triggers effect to resize
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isReceivingMessage) {
      e.preventDefault();
      handleSend();
    }
  };

  const chatDisabled =
    loading ||
    isReceivingMessage ||
    user?.status === SubscriptionStatus.INACTIVE;

  return (
    <Card className="w-full max-w-[48rem] border-gray-600 gap-2 px-0 py-5 rounded-[32px]">
      <CardContent>
        <Textarea
          ref={textAreaRef}
          placeholder="Ask away!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            maxHeight: `${constants.MAX_CHAT_INPUT_HEIGHT}px`,
          }}
          className="rounded-none min-h-[26px] px-0 py-0 border-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent resize-none overflow-hidden"
          rows={1}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          disabled={chatDisabled}
          size="icon"
          className="rounded-full"
          onClick={handleSend}
        >
          {isReceivingMessage ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <ArrowUp />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
