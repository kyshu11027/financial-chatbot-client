export default interface UserInfo {
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
