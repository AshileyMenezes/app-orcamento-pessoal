'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AccountModal } from '@/components/accounts/AccountModal';
import { Plus } from 'lucide-react';

export function AccountHeaderAction() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setIsOpen(true)}
        className="gap-1.5 shadow-md"
      >
        <Plus className="w-4 h-4" />
        Nova Conta
      </Button>

      <AccountModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
