'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TransactionModal } from '@/components/transactions/TransactionModal';
import { Category, Account } from '@/lib/types/database';
import { Plus } from 'lucide-react';

interface DashboardHeaderActionProps {
  categories: Category[];
  accounts: Account[];
}

export function DashboardHeaderAction({
  categories,
  accounts,
}: DashboardHeaderActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setIsOpen(true)}
        className="gap-1.5 shadow-md"
      >
        <Plus className="w-4 h-4" />
        Nova Movimentação
      </Button>

      <TransactionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        categories={categories}
        accounts={accounts}
      />
    </>
  );
}
