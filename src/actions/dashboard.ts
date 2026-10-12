'use server';

import { createClient } from '@/lib/supabase/server';
import { DashboardMetrics, TransactionWithDetails } from '@/lib/types/database';
import { MONTH_NAMES } from '@/lib/utils/formatters';

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
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
  const { data: accounts } = await supabase.from('accounts').select('initial_balance');
  const initialBalanceTotal = (accounts || []).reduce(
    (sum, acc) => sum + (Number(acc.initial_balance) || 0),
    0
  );

  // 2. Buscar todas as transações concluídas do usuário
  const { data: allTransactions } = await supabase
    .from('transactions')
    .select(`
      *,
      category:categories(*),
      account:accounts(*)
    `)
    .eq('status', 'completed')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  const txList = (allTransactions || []).map((t) => ({
    ...t,
    amount: Number(t.amount),
  })) as TransactionWithDetails[];

  // 3. Saldo Total Global
  const balanceDelta = txList.reduce((acc, t) => {
    if (t.type === 'income') return acc + t.amount;
    if (t.type === 'expense') return acc - t.amount;
    return acc;
  }, 0);
  const totalBalance = initialBalanceTotal + balanceDelta;

  // 4. Mês atual: Entradas e Saídas
  const currentMonthTx = txList.filter(
    (t) => t.date >= startOfMonth && t.date <= endOfMonth
  );

  const totalIncomeMonth = currentMonthTx
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenseMonth = currentMonthTx
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalIncomeMonth - totalExpenseMonth;
  const savingsRate =
    totalIncomeMonth > 0 ? Math.max(0, (netSavings / totalIncomeMonth) * 100) : 0;

  // 5. Transações recentes (top 5)
  const recentTransactions = txList.slice(0, 5);

  // 6. Despesas por categoria no mês atual
  const categoryMap: Record<
    string,
    { categoryName: string; color: string; total: number }
  > = {};

  currentMonthTx
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const catName = t.category?.name || 'Sem Categoria';
      const catColor = t.category?.color || '#94a3b8';

      if (!categoryMap[catName]) {
        categoryMap[catName] = {
          categoryName: catName,
          color: catColor,
          total: 0,
        };
      }
      categoryMap[catName].total += t.amount;
    });

  const expensesByCategory = Object.values(categoryMap)
    .map((item) => ({
      ...item,
      percentage: totalExpenseMonth > 0 ? (item.total / totalExpenseMonth) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);

  // 7. Evolução dos últimos 6 meses
  const monthlyEvolution: { monthLabel: string; income: number; expense: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const targetDate = new Date(currentYear, currentMonth - 1 - i, 1);
    const y = targetDate.getFullYear();
    const m = targetDate.getMonth() + 1;
    const sDate = `${y}-${String(m).padStart(2, '0')}-01`;
    const lDay = new Date(y, m, 0).getDate();
    const eDate = `${y}-${String(m).padStart(2, '0')}-${String(lDay).padStart(2, '0')}`;

    const monthTx = txList.filter((t) => t.date >= sDate && t.date <= eDate);

    const mIncome = monthTx
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const mExpense = monthTx
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    monthlyEvolution.push({
      monthLabel: `${MONTH_NAMES[m - 1].slice(0, 3)}/${String(y).slice(2)}`,
      income: mIncome,
      expense: mExpense,
    });
  }

  return {
    totalBalance,
    totalIncomeMonth,
    totalExpenseMonth,
    savingsRate,
    recentTransactions,
    expensesByCategory,
    monthlyEvolution,
  };
}
