import Big from 'big.js';

// Configuração padrão do Big.js para precisão financeira
Big.DP = 2; // 2 casas decimais padrão
Big.RM = Big.roundHalfUp; // Arredondamento bancário padrão

/**
 * Converte com segurança qualquer valor para uma instância Big do big.js
 */
export function toBig(value: number | string | Big): Big {
  if (value instanceof Big) return value;
  if (typeof value === 'number') {
    if (isNaN(value)) return new Big(0);
    return new Big(value);
  }
  if (!value || typeof value !== 'string') return new Big(0);
  
  const cleaned = value.trim();
  if (!cleaned) return new Big(0);
  try {
    return new Big(cleaned);
  } catch {
    return new Big(0);
  }
}

/**
 * Retorna o número arredondado a 2 casas decimais monetárias
 */
export function roundCurrency(val: Big | number | string): number {
  return Number(toBig(val).toFixed(2));
}

export interface TransactionCalcItem {
  type: string;
  amount: number | string;
  status?: string;
  account_id?: string;
  category_id?: string | null;
  category?: {
    name?: string;
    color?: string;
  } | null;
  date?: string;
  deleted_at?: string | null;
}

/**
 * Calcula a variação líquida (delta) das transações concluídas utilizando Big.js
 * Receitas somam, despesas subtraem. Itens com soft-delete (deleted_at) são ignorados.
 */
export function calculateBalanceDelta(transactions: TransactionCalcItem[]): Big {
  return transactions.reduce((acc, t) => {
    // Salvaguarda Regra 1: ignorar registros com soft-delete
    if (t.deleted_at) return acc;
    if (t.status && t.status !== 'completed') return acc;
    const amount = toBig(t.amount);
    
    if (t.type === 'income') {
      return acc.plus(amount);
    }
    if (t.type === 'expense') {
      return acc.minus(amount);
    }
    return acc;
  }, new Big(0));
}

/**
 * Calcula o saldo atual de uma conta com precisão decimal arbitrária
 */
export function calculateAccountBalance(
  initialBalance: number | string,
  transactions: TransactionCalcItem[]
): number {
  const init = toBig(initialBalance);
  const delta = calculateBalanceDelta(transactions);
  return roundCurrency(init.plus(delta));
}

/**
 * Calcula o saldo geral consolidado de todas as contas
 */
export function calculateTotalBalance(
  accounts: Array<{ initial_balance: number | string; id?: string }>,
  transactions: TransactionCalcItem[]
): number {
  const totalInitial = accounts.reduce(
    (sum, acc) => sum.plus(toBig(acc.initial_balance)),
    new Big(0)
  );

  const delta = calculateBalanceDelta(transactions);
  return roundCurrency(totalInitial.plus(delta));
}

/**
 * Calcula totais de receitas, despesas, economia líquida e taxa de poupança (%) com Big.js
 */
export function calculateFinancialTotals(transactions: TransactionCalcItem[]): {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingsRate: number;
} {
  let incomeBig = new Big(0);
  let expenseBig = new Big(0);

  for (const t of transactions) {
    if (t.deleted_at) continue;
    if (t.status && t.status !== 'completed') continue;
    const amt = toBig(t.amount);
    if (t.type === 'income') {
      incomeBig = incomeBig.plus(amt);
    } else if (t.type === 'expense') {
      expenseBig = expenseBig.plus(amt);
    }
  }

  const netSavingsBig = incomeBig.minus(expenseBig);
  let savingsRateBig = new Big(0);

  if (incomeBig.gt(0)) {
    const rawRate = netSavingsBig.div(incomeBig).times(100);
    savingsRateBig = rawRate.lt(0) ? new Big(0) : rawRate;
  }

  return {
    totalIncome: roundCurrency(incomeBig),
    totalExpense: roundCurrency(expenseBig),
    netSavings: roundCurrency(netSavingsBig),
    savingsRate: Number(savingsRateBig.toFixed(1)),
  };
}

/**
 * Agrega e calcula totais de despesas por categoria e respectivas porcentagens
 */
export function calculateCategoryExpenseTotals(
  transactions: TransactionCalcItem[]
): Array<{
  categoryName: string;
  color: string;
  total: number;
  percentage: number;
}> {
  const categoryMap = new Map<
    string,
    { categoryName: string; color: string; totalBig: Big }
  >();

  let totalExpenseBig = new Big(0);

  for (const t of transactions) {
    if (t.deleted_at) continue;
    if (t.status && t.status !== 'completed') continue;
    if (t.type !== 'expense') continue;

    const amt = toBig(t.amount);
    totalExpenseBig = totalExpenseBig.plus(amt);

    const name = t.category?.name || 'Sem Categoria';
    const color = t.category?.color || '#94a3b8';

    const existing = categoryMap.get(name);
    if (existing) {
      existing.totalBig = existing.totalBig.plus(amt);
    } else {
      categoryMap.set(name, {
        categoryName: name,
        color,
        totalBig: amt,
      });
    }
  }

  const result: Array<{
    categoryName: string;
    color: string;
    total: number;
    percentage: number;
  }> = [];

  for (const item of categoryMap.values()) {
    let percentageBig = new Big(0);
    if (totalExpenseBig.gt(0)) {
      percentageBig = item.totalBig.div(totalExpenseBig).times(100);
    }

    result.push({
      categoryName: item.categoryName,
      color: item.color,
      total: roundCurrency(item.totalBig),
      percentage: Number(percentageBig.toFixed(1)),
    });
  }

  return result.sort((a, b) => b.total - a.total);
}

/**
 * Calcula o uso percentual e o valor restante do orçamento
 */
export function calculateBudgetUsage(
  amountLimit: number | string,
  spentAmount: number | string
): {
  limit: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  isOverLimit: boolean;
} {
  const limitBig = toBig(amountLimit);
  const spentBig = toBig(spentAmount);
  const remainingBig = limitBig.minus(spentBig);

  let percentageBig = new Big(0);
  if (limitBig.gt(0)) {
    percentageBig = spentBig.div(limitBig).times(100);
  }

  return {
    limit: roundCurrency(limitBig),
    spent: roundCurrency(spentBig),
    remaining: roundCurrency(remainingBig),
    percentageUsed: Number(percentageBig.toFixed(1)),
    isOverLimit: spentBig.gt(limitBig),
  };
}

/**
 * Validação rigorosa de integridade de dados financeiros:
 * - Rejeita entradas negativas em receita
 * - Valida coerência de despesa
 */
export function validateFinancialInput(
  type: 'income' | 'expense' | 'transfer',
  amount: number | string
): { valid: boolean; error?: string; cleanAmount?: number } {
  const valBig = toBig(amount);

  if (valBig.eq(0)) {
    return { valid: false, error: 'O valor da operação deve ser maior que zero.' };
  }

  if (type === 'income') {
    if (valBig.lt(0)) {
      return {
        valid: false,
        error: 'Valores negativos são inválidos no campo de receita.',
      };
    }
  }

  if (type === 'expense') {
    if (valBig.lt(0)) {
      return {
        valid: false,
        error: 'Valores negativos são inválidos no campo de despesa (insira o valor positivo da despesa).',
      };
    }
  }

  if (type === 'transfer') {
    if (valBig.lt(0)) {
      return {
        valid: false,
        error: 'Valores negativos são inválidos em transferências.',
      };
    }
  }

  return { valid: true, cleanAmount: roundCurrency(valBig) };
}
