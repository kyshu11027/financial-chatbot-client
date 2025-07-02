export interface UserInfo {
  no_user_info: boolean;
  user_id: string;
  name: string;
  income: number;
  savings_goal: number;
  additional_monthly_expenses: Expense[];
  created_at: string;
  updated_at: string;
}

interface Expense {
  name: string;
  description: string;
  amount: number;
}

export interface User {
  user_id: string;
  stripe_id: string | null;
  email: string;
  status: string;
  subscription_id: string | null;
  has_used_trial: boolean;
  plaid_user_token: string | null;
  consent_retrieved: boolean;
  consent_retrieved_at: string | null;
}

export const SubscriptionStatus = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
  DELETED: "deleted",
  TRIAL: "trial",
});
