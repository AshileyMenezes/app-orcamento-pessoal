'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { formatCurrency } from '@/lib/utils/formatters';
import { useTheme } from '@/components/providers/ThemeProvider';

interface EvolutionChartProps {
  data: {
    monthLabel: string;
    income: number;
    expense: number;
  }[];
}

export function EvolutionChart({ data }: EvolutionChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const hasData = data.some((d) => d.income > 0 || d.expense > 0);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Evolução Mensal (Receitas vs. Despesas)</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
            Nenhuma movimentação registrada nos últimos meses
          </div>
        ) : (
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={isDark ? '#334155' : '#e2e8f0'}
                  opacity={0.6}
                />
                <XAxis
                  dataKey="monthLabel"
                  stroke={isDark ? '#94a3b8' : '#64748b'}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={isDark ? '#94a3b8' : '#64748b'}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) =>
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 0,
                    }).format(Number(val) || 0)
                  }
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value) || 0), '']}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#1e293b' : '#e2e8f0',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    fontSize: '12px',
                  }}
                  itemStyle={{
                    color: isDark ? '#f8fafc' : '#0f172a',
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
                />
                <Bar
                  dataKey="income"
                  name="Receitas"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
                <Bar
                  dataKey="expense"
                  name="Despesas"
                  fill="#f43f5e"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
