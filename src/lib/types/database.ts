export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionStatus = 'completed' | 'pending';
export type AccountType = 'checking' | 'savings' | 'wallet' | 'investment';
export type CategoryType = 'income' | 'expense';

export interface Profile {
  id: string;
  full_name: string | null;
  currency: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  created_at: string;
  deleted_at?: string | null;
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  initial_balance: number;
  color: string;
  created_at: string;
  deleted_at?: string | null;
  current_balance?: number;
}

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string | null;
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
  status: TransactionStatus;
  created_at: string;
  deleted_at?: string | null;
}

export interface TransactionWithDetails extends Transaction {
  category?: Category | null;
  account?: Account | null;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  month: number;
  year: number;
  amount_limit: number;
  created_at: string;
  deleted_at?: string | null;
}

export interface BudgetWithCategory extends Budget {
  category: Category;
  spent_amount: number;
  percentage_used: number;
}

export interface DashboardMetrics {
  totalBalance: number;
  totalIncomeMonth: number;
  totalExpenseMonth: number;
  savingsRate: number;
  recentTransactions: TransactionWithDetails[];
  expensesByCategory: {
    categoryName: string;
    color: string;
    total: number;
    percentage: number;
  }[];
  monthlyEvolution: {
    monthLabel: string;
    income: number;
    expense: number;
  }[];
}
