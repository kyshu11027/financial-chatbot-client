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
  stripe_customer_id: string;
  status: string;
  email: string;
  has_used_trial: boolean;
}

export const SubscriptionStatus = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
  DELETED: "deleted",
  TRIAL: "trial",
});
