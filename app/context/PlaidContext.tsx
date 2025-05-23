"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { PlaidItem } from "@/types/plaid";
import { getPlaidLinkToken, getPlaidItems } from "@/lib/plaid";
import { useAuth } from "./AuthContext";

interface PlaidContextType {
  items: PlaidItem[];
  loading: boolean;
  linkToken: string | null;
  error: string | null;
  refreshItems: () => Promise<void>;
}

const PlaidContext = createContext<PlaidContextType>({
  items: [],
  loading: true,
  linkToken: null,
  error: null,
  refreshItems: async () => {},
});

export function PlaidProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [items, setItems] = useState<PlaidItem[]>([]);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const items = await getPlaidItems(session);
      setItems(items);
      setError(null);
    } catch (err) {
      console.error("Error fetching Plaid items:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch Plaid items"
      );
      setItems([]);
    }
  };

  const fetchLinkToken = async () => {
    try {
      const token = await getPlaidLinkToken(session);
      setLinkToken(token);
    } catch (err) {
      console.error("Error fetching Plaid link token:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch Plaid link token"
      );
      setLinkToken(null);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchLinkToken();
    setLoading(false);
  }, [session]);

  return (
    <PlaidContext.Provider
      value={{ items, loading, error, linkToken, refreshItems: fetchItems }}
    >
      {children}
    </PlaidContext.Provider>
  );
}

export const usePlaid = () => {
  return useContext(PlaidContext);
};
