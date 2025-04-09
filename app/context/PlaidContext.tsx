"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface PlaidItem {
  ID: string;
  UserID: string;
  AccessToken: string;
  ItemID: string;
  Status: string;
  CreatedAt: {
    Time: string;
    Valid: boolean;
  };
  UpdatedAt: {
    Time: string;
    Valid: boolean;
  };
}

interface PlaidContextType {
  items: PlaidItem[];
  loading: boolean;
  error: string | null;
  refreshItems: () => Promise<void>;
}

const PlaidContext = createContext<PlaidContextType>({
  items: [],
  loading: true,
  error: null,
  refreshItems: async () => {},
});

export function PlaidProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [items, setItems] = useState<PlaidItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      if (!session?.access_token) {
        setItems([]);
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8080/api/plaid/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          user_id: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Plaid items");
      }

      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      console.error("Error fetching Plaid items:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch Plaid items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [session]);

  return (
    <PlaidContext.Provider value={{ items, loading, error, refreshItems: fetchItems }}>
      {children}
    </PlaidContext.Provider>
  );
}

export const usePlaid = () => {
  return useContext(PlaidContext);
};
