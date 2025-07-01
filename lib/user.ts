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
      throw new Error("Failed to fetch user data");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const deleteUser = async (session: Session | null) => {
  if (!session?.access_token || !session?.user?.id) {
    return null;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/delete`,
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
      throw new Error("Failed to delete user data");
    }
    return res.json();
  } catch (error) {
    console.error("Error deleting user data:", error);
    throw error;
  }
};

export const fetchUserInfo = async (session: Session | null) => {
  if (!session?.access_token || !session?.user?.id) {
    return null;
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user-info/get`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch user info");
    }

    return await res.json();
  } catch (error) {
    throw error;
  }
};
