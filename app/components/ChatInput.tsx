"use client";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

export default function ChatInput() {
  return (
    <Card className="w-full max-w-[48rem] border-gray-600 gap-2 px-0 py-5 rounded-[32px]">
      <CardContent>
        <Textarea
          placeholder="Ask away!"
          className="rounded-none h-[32px] px-0 py-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent resize-none"
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button size="icon" className="rounded-full">
          <ArrowUp />
        </Button>
      </CardFooter>
    </Card>
  );
}
