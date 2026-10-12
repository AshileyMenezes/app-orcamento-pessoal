'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BudgetModal } from '@/components/budgets/BudgetModal';
import { Category } from '@/lib/types/database';
import { Plus } from 'lucide-react';

interface BudgetHeaderActionProps {
  categories: Category[];
  currentMonth: number;
  currentYear: number;
}

export function BudgetHeaderAction({
  categories,
  currentMonth,
  currentYear,
}: BudgetHeaderActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setIsOpen(true)}
        className="gap-1.5 shadow-md"
      >
        <Plus className="w-4 h-4" />
        Definir Teto
      </Button>

      <BudgetModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        categories={categories}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />
    </>
  );
}
