'use server';

import { createClient } from '@/lib/supabase/server';
import { DashboardMetrics, TransactionWithDetails } from '@/lib/types/database';
import { MONTH_NAMES } from '@/lib/utils/formatters';
import {
  calculateTotalBalance,
  calculateFinancialTotals,
  calculateCategoryExpenseTotals,
  toBig,
  roundCurrency,
} from '@/lib/utils/finance';

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      totalBalance: 0,
      totalIncomeMonth: 0,
      totalExpenseMonth: 0,
      savingsRate: 0,
      recentTransactions: [],
      expensesByCategory: [],
      monthlyEvolution: [],
    };
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const startOfMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
  const lastDay = new Date(currentYear, currentMonth, 0).getDate();
  const endOfMonth = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

  // 1. Buscar contas
  const { data: accounts, error: accError } = await supabase
    .from('accounts')
    .select('initial_balance');

  if (accError && (accError.code === '401' || accError.code === '403')) {
    return {
      totalBalance: 0,
      totalIncomeMonth: 0,
      totalExpenseMonth: 0,
      savingsRate: 0,
      recentTransactions: [],
      expensesByCategory: [],
      monthlyEvolution: [],
    };
  }

  // 2. Buscar todas as transações concluídas do usuário
  const { data: allTransactions, error: txError } = await supabase
    .from('transactions')
    .select(`
      *,
      category:categories(*),
      account:accounts(*)
    `)
    .eq('status', 'completed')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (txError && (txError.code === '401' || txError.code === '403')) {
    return {
      totalBalance: 0,
      totalIncomeMonth: 0,
      totalExpenseMonth: 0,
      savingsRate: 0,
      recentTransactions: [],
      expensesByCategory: [],
      monthlyEvolution: [],
    };
  }

  const txList = (allTransactions || []).map((t) => ({
    ...t,
    amount: roundCurrency(t.amount),
  })) as TransactionWithDetails[];

  // 3. Saldo Total Global usando big.js
  const totalBalance = calculateTotalBalance(accounts || [], txList);

  // 4. Mês atual: Entradas, Saídas e Poupança usando big.js
  const currentMonthTx = txList.filter(
    (t) => t.date >= startOfMonth && t.date <= endOfMonth
  );

  const { totalIncome, totalExpense, savingsRate } = calculateFinancialTotals(currentMonthTx);

  // 5. Transações recentes (top 5)
  const recentTransactions = txList.slice(0, 5);

  // 6. Despesas por categoria no mês atual usando big.js
  const expensesByCategory = calculateCategoryExpenseTotals(currentMonthTx);

  // 7. Evolução dos últimos 6 meses usando big.js
  const monthlyEvolution: { monthLabel: string; income: number; expense: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(currentYear, currentMonth - 1 - i, 1);
    const y = targetDate.getFullYear();
    const m = targetDate.getMonth() + 1;
    const sDate = `${y}-${String(m).padStart(2, '0')}-01`;
    const lDay = new Date(y, m, 0).getDate();
    const eDate = `${y}-${String(m).padStart(2, '0')}-${String(lDay).padStart(2, '0')}`;

    const monthTx = txList.filter((t) => t.date >= sDate && t.date <= eDate);
    const monthTotals = calculateFinancialTotals(monthTx);

    monthlyEvolution.push({
      monthLabel: `${MONTH_NAMES[m - 1].slice(0, 3)}/${String(y).slice(2)}`,
      income: monthTotals.totalIncome,
      expense: monthTotals.totalExpense,
    });
  }

  return {
    totalBalance,
    totalIncomeMonth: totalIncome,
    totalExpenseMonth: totalExpense,
    savingsRate,
    recentTransactions,
    expensesByCategory,
    monthlyEvolution,
  };
}
