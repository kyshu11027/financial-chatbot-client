import { Conversation, Message } from "@/types/conversations";

export const fetchConversations = async (
  token: string
): Promise<Conversation[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversation/list`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch conversations");
  }

  return res.json();
};

export const fetchMessages = async (
  token: string,
  conversation_id: string
): Promise<Message[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/chat/message/list`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        conversation_id,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch messages info");
  }

  return res.json();
};

export const sendMessage = async (
  token: string,
  conversation_id: string,
  message: string
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/chat/message/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

export const updateTitle = async (
  token: string,
  conversation_id: string,
  title: string
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversation/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversation_id,
          title,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update title");
    }

    return res.json();
  } catch (error) {
    console.error("Error updating title:", error);
    window.alert("Please try again.");
    return;
  }
};

export const deleteConversation = async (
  token: string,
  conversation_id: string
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversation/delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversation_id,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update title");
    }

    return res.json();
  } catch (error) {
    console.error("Error updating title:", error);
    window.alert("Please try again.");
    return;
  }
};
