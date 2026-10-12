import { describe, it, expect } from 'vitest';
import {
  toBig,
  roundCurrency,
  calculateAccountBalance,
  calculateTotalBalance,
  calculateFinancialTotals,
  calculateCategoryExpenseTotals,
  calculateBudgetUsage,
  validateFinancialInput,
} from './finance';

describe('Integridade e Validação de Dados Financeiros (big.js)', () => {
  it('deve evitar erros clássicos de arredondamento IEEE 754 de ponto flutuante (ex: 0.1 + 0.2 = 0.30)', () => {
    // No JS nativo, 0.1 + 0.2 === 0.30000000000000004
    const a = toBig(0.1);
    const b = toBig(0.2);
    const sum = a.plus(b);
    expect(sum.toFixed(2)).toBe('0.30');
    expect(roundCurrency(sum)).toBe(0.3);
  });

  it('deve calcular o saldo da conta com precisão exata somando receitas e subtraindo despesas', () => {
    const initialBalance = 1000.55;
    const transactions = [
      { type: 'income', amount: 500.25, status: 'completed' },
      { type: 'expense', amount: 200.30, status: 'completed' },
      { type: 'expense', amount: 50.50, status: 'completed' },
      { type: 'transfer', amount: 100.00, status: 'completed' }, // transferência interna não altera delta direto da conta se for genérica
    ];

    // 1000.55 + 500.25 - 200.30 - 50.50 = 1250.00
    const saldo = calculateAccountBalance(initialBalance, transactions);
    expect(saldo).toBe(1250.0);
  });

  it('deve ignorar transações pendentes no cálculo de saldo real', () => {
    const initialBalance = 100.0;
    const transactions = [
      { type: 'income', amount: 50.0, status: 'completed' },
      { type: 'expense', amount: 30.0, status: 'pending' }, // pendente
    ];

    const saldo = calculateAccountBalance(initialBalance, transactions);
    expect(saldo).toBe(150.0);
  });

  it('deve calcular o saldo geral consolidado de múltiplas contas', () => {
    const accounts = [
      { initial_balance: 1000.0 },
      { initial_balance: 500.5 },
      { initial_balance: 200.0 },
    ];
    const transactions = [
      { type: 'income', amount: 300.0, status: 'completed' },
      { type: 'expense', amount: 150.25, status: 'completed' },
    ];

    // (1000 + 500.5 + 200) + (300 - 150.25) = 1700.5 + 149.75 = 1850.25
    const total = calculateTotalBalance(accounts, transactions);
    expect(total).toBe(1850.25);
  });

  it('deve calcular totais financeiros (receitas, despesas, economia líquida e taxa de poupança)', () => {
    const transactions = [
      { type: 'income', amount: 3000.0, status: 'completed' },
      { type: 'expense', amount: 1200.0, status: 'completed' },
      { type: 'expense', amount: 300.0, status: 'completed' },
    ];

    // Total Receitas: 3000.00
    // Total Despesas: 1500.00
    // Net: 1500.00
    // Taxa de Poupança: (1500 / 3000) * 100 = 50.0%
    const metrics = calculateFinancialTotals(transactions);
    expect(metrics.totalIncome).toBe(3000.0);
    expect(metrics.totalExpense).toBe(1500.0);
    expect(metrics.netSavings).toBe(1500.0);
    expect(metrics.savingsRate).toBe(50.0);
  });

  it('deve retornar taxa de poupança 0% se as despesas forem maiores que as receitas', () => {
    const transactions = [
      { type: 'income', amount: 1000.0, status: 'completed' },
      { type: 'expense', amount: 1500.0, status: 'completed' },
    ];

    const metrics = calculateFinancialTotals(transactions);
    expect(metrics.savingsRate).toBe(0);
  });

  it('deve calcular o total de despesas por categoria e porcentagens corretas', () => {
    const transactions = [
      {
        type: 'expense',
        amount: 300.0,
        category: { name: 'Alimentação', color: '#ff0000' },
        status: 'completed',
      },
      {
        type: 'expense',
        amount: 700.0,
        category: { name: 'Moradia', color: '#00ff00' },
        status: 'completed',
      },
      {
        type: 'income',
        amount: 5000.0,
        category: { name: 'Salário', color: '#0000ff' },
        status: 'completed',
      },
    ];

    // Total despesas: 1000.00
    // Moradia: 700.00 (70.0%)
    // Alimentação: 300.00 (30.0%)
    const catTotals = calculateCategoryExpenseTotals(transactions);
    expect(catTotals).toHaveLength(2);
    expect(catTotals[0].categoryName).toBe('Moradia');
    expect(catTotals[0].total).toBe(700.0);
    expect(catTotals[0].percentage).toBe(70.0);

    expect(catTotals[1].categoryName).toBe('Alimentação');
    expect(catTotals[1].total).toBe(300.0);
    expect(catTotals[1].percentage).toBe(30.0);
  });

  it('deve calcular uso do orçamento e alertar quando estoura o limite', () => {
    const normal = calculateBudgetUsage(1000.0, 750.0);
    expect(normal.percentageUsed).toBe(75.0);
    expect(normal.remaining).toBe(250.0);
    expect(normal.isOverLimit).toBe(false);

    const estourado = calculateBudgetUsage(500.0, 650.0);
    expect(estourado.percentageUsed).toBe(130.0);
    expect(estourado.remaining).toBe(-150.0);
    expect(estourado.isOverLimit).toBe(true);
  });

  describe('Regras de validação estrita de entradas monetárias', () => {
    it('deve rejeitar entradas negativas em campo de receita', () => {
      const res = validateFinancialInput('income', -150.0);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('negativos são inválidos no campo de receita');
    });

    it('deve rejeitar entradas negativas em campo de despesa', () => {
      const res = validateFinancialInput('expense', -50.0);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('negativos são inválidos no campo de despesa');
    });

    it('deve rejeitar valor zero', () => {
      const res = validateFinancialInput('income', 0);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('maior que zero');
    });

    it('deve aceitar valores estritamente positivos', () => {
      const resIncome = validateFinancialInput('income', 2500.5);
      expect(resIncome.valid).toBe(true);
      expect(resIncome.cleanAmount).toBe(2500.5);

      const resExpense = validateFinancialInput('expense', 150.2);
      expect(resExpense.valid).toBe(true);
      expect(resExpense.cleanAmount).toBe(150.2);
    });
  });
});
