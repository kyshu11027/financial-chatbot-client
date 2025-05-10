"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { usePlaid } from "@/app/context/PlaidContext";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  name: string;
  category: string[];
  item_id?: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function TransactionsPage() {
  const { session, loading: sessionLoading } = useAuth();
  const { items, loading: itemsLoading, error: itemsError } = usePlaid();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!session?.access_token) {
          setTransactions([]);
          setLoading(false);
          return;
        }

        if (!items.length) {
          setTransactions([]);
          setLoading(false);
          return;
        }

        // Fetch transactions for each Plaid item
        const allTransactions: Transaction[] = [];
        for (const item of items) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/plaid/transaction/list`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({
                access_token: item.AccessToken,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(
              `Failed to fetch transactions for item ${item.ItemID}`
            );
          }

          const data = await response.json();
          // Add item_id to each transaction
          const transactionsWithItemId = data.transactions.map(
            (t: Transaction) => ({
              ...t,
              item_id: item.ItemID,
            })
          );
          allTransactions.push(...transactionsWithItemId);
        }

        setTransactions(allTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch transactions"
        );
      } finally {
        setLoading(false);
      }
    };

    if (!itemsLoading && !sessionLoading) {
      fetchTransactions();
    }
  }, [session, items, itemsLoading, sessionLoading]);

  const handleSaveContext = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/new-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to save context: ${response.statusText}`);
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error saving context:", error);
    }
  }, [session]);

  if (sessionLoading || itemsLoading || loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!session?.access_token) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Please log in to view your transactions
            </h2>
            <Button asChild>
              <a href="/login">Go to Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (itemsError) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-destructive">
              Error loading Plaid items
            </h2>
            <p className="text-muted-foreground">{itemsError}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              No bank accounts connected
            </h2>
            <p className="text-muted-foreground mb-4">
              Please connect your bank account to view transactions.
            </p>
            <Button asChild>
              <a href="/">Connect Bank Account</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Your Transactions</h1>
          <Button onClick={handleSaveContext}>Save context</Button>
        </div>

        <AnimatePresence>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-4"
          >
            {transactions.map((transaction) => (
              <motion.div
                key={`${transaction.item_id}-${transaction.id}`}
                variants={item}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{transaction.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.category &&
                            transaction.category.join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.amount >= 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
