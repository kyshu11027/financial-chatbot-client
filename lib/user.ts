import { User } from "@/types/user";
import { Session } from "@supabase/supabase-js";

export const fetchUser = async (
  session: Session | null
): Promise<User | null> => {
  if (!session?.access_token || !session?.user?.id) {
    return null;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch conversations");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};
