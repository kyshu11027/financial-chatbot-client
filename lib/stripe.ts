import { Session } from "@supabase/supabase-js";

type StripeSessionResponse = {
  url: string;
};

export const fetchStripeSession = async (
  session: Session | null
): Promise<StripeSessionResponse | null> => {
  if (!session?.access_token || !session?.user?.id) {
    return null;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/session/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch conversations");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};
