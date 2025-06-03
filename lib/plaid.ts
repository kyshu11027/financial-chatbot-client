import { Session } from "@supabase/supabase-js";
import { PlaidItem } from "@/types/plaid";

export const getPlaidLinkToken = async (
  session: Session | null
): Promise<string | null> => {
  if (!session?.access_token || !session?.user?.id) {
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/plaid/link-token/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          user_id: session.user.id,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Link token fetch failed:", {
        status: response.status,
        statusText: response.statusText,
        error: data,
      });
      throw new Error(
        data?.error || `Failed to fetch link token: ${response.statusText}`
      );
    }

    return data.link_token ?? null;
  } catch (error) {
    console.error("Error fetching link token:", error);
    throw error;
  }
};

export const getPlaidItems = async (
  session: Session | null
): Promise<PlaidItem[]> => {
  if (!session?.access_token || !session?.user?.id) {
    return [];
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/plaid/item/list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          user_id: session.user.id,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Plaid item fetch failed:", {
        status: response.status,
        statusText: response.statusText,
        error: data,
      });
      throw new Error(data?.error || "Failed to fetch Plaid items");
    }

    return data.items ?? [];
  } catch (error) {
    console.error("Error fetching Plaid items:", error);
    throw error;
  }
};

export const provisionSaveTransactionsJob = async (
  session: Session | null,
  items: PlaidItem[]
): Promise<boolean> => {
  if (!session?.access_token || !session?.user?.id) {
    return false;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/plaid/transaction/save`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          items,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Save transactions job failed to provision:", {
        status: response.status,
        statusText: response.statusText,
        error: data,
      });
      throw new Error(data?.error || "Failed to fetch Plaid items");
    }

    return data.success;
  } catch (error) {
    console.error("Error fetching Plaid items:", error);
    throw error;
  }
};
