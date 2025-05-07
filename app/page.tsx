"use client";

import { useState } from "react";
import PlaidLinkComponent from "./components/PlaidLink";
import { useAuth } from "@/app/context/AuthContext";

export default function Home() {
  const { session } = useAuth();
  const [income, setIncome] = useState<number | "">("");
  const [savingsGoal, setSavingsGoal] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:8080/api/user-info/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            income: income,
            savings_goal: savingsGoal,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit user info");
      }

      // Handle successful submission if needed
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <PlaidLinkComponent />
      <form onSubmit={handleSubmit} className="space-y-4 mt-8">
        {error && <div className="text-destructive">{error}</div>}
        <div>
          <label htmlFor="income" className="block">
            Income
          </label>
          <input
            id="income"
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            required
            className="border p-2 w-full text-black"
          />
        </div>
        <div>
          <label htmlFor="savingsGoal" className="block">
            Monthly Savings Goal
          </label>
          <input
            id="savingsGoal"
            type="number"
            value={savingsGoal}
            onChange={(e) => setSavingsGoal(Number(e.target.value))}
            required
            className="border p-2 w-full text-black"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </main>
  );
}
