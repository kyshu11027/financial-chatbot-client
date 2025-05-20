export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
}

export interface Message {
  conversation_id: string;
  user_id: string;
  sender: "UserMessage" | "AIMessage";
  message: string;
  timestamp: string;
}
