'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatters';

interface ExpensesPieChartProps {
  data: {
    categoryName: string;
    color: string;
    total: number;
    percentage: number;
  }[];
}

export function ExpensesPieChart({ data }: ExpensesPieChartProps) {
  const hasData = data && data.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Despesas por Categoria (Mês)</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
            Nenhuma despesa registrada neste mês
          </div>
        ) : (
          <div className="h-72 w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="total"
                  nameKey="categoryName"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#6366f1'} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${formatCurrency(Number(value) || 0)} (${formatPercentage(item.payload.percentage)})`,
                    item.payload.categoryName,
                  ]}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
