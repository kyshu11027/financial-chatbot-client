"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { PlaidItem, SyncStatus } from "@/types/plaid";
import {
  getPlaidLinkToken,
  getPlaidItems,
  provisionSaveTransactionsJob,
  getUpdatePlaidLinkToken,
} from "@/lib/plaid";
import { useAuth } from "./AuthContext";

interface PlaidContextType {
  items: PlaidItem[];
  errorItems: PlaidItem[];
  loading: boolean;
  linkToken: string | null;
  error: string | null;
  refreshItems: () => Promise<void>;
}

const PlaidContext = createContext<PlaidContextType>({
  items: [],
  errorItems: [],
  loading: true,
  linkToken: null,
  error: null,
  refreshItems: async () => {},
});

export function PlaidProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [items, setItems] = useState<PlaidItem[]>([]);
  const [errorItems, setErrorItems] = useState<PlaidItem[]>([]);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      const items = await getPlaidItems(session);
      setItems(items);
      // Filter out items with ERROR status
      const errorItems = items.filter((item) => item.status === "ERROR");
      getLinkTokenForItems(items);
      setErrorItems(errorItems);
      setError(null);
      triggerSyncJob(items);
    } catch (err) {
      console.error("Error fetching Plaid items:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch Plaid items"
      );
      setItems([]);
      setErrorItems([]);
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

  const triggerSyncJob = async (items: PlaidItem[]) => {
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;

    const staleItems = items.filter((item) => {
      if (item.sync_status === SyncStatus.IN_PROGRESS) return false;
      if (!item.last_synced_at.Valid) return true; // Never synced before
      if (item.sync_status === SyncStatus.FAILED) return true;
      return new Date(item.last_synced_at.Time).getTime() < threeDaysAgo;
    });

    if (staleItems.length === 0) {
      console.log("No stale items");
      return;
    }

    try {
      await provisionSaveTransactionsJob(session, staleItems);
    } catch (err) {
      console.error("Error provisioning save transactions job:", err);
    }
  };

  const getLinkTokenForItems = (items: PlaidItem[]) => {
    items.forEach(async (item) => {
      try {
        const token = await getUpdatePlaidLinkToken(session, item.access_token);
        item.link_token = token;
      } catch (err) {
        console.error("Error fetching update link token for item:", err);
      }
    });
  };

  useEffect(() => {
    fetchItems();
    fetchLinkToken();
    setLoading(false);
  }, [session]);

  return (
    <PlaidContext.Provider
      value={{
        items,
        errorItems,
        loading,
        error,
        linkToken,
        refreshItems: fetchItems,
      }}
    >
      {children}
    </PlaidContext.Provider>
  );
}

export const usePlaid = () => {
  return useContext(PlaidContext);
};
