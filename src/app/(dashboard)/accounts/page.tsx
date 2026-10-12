import React from 'react';
import { getAccounts } from '@/actions/accounts';
import { AccountList } from '@/components/accounts/AccountList';
import { AccountHeaderAction } from '@/components/accounts/AccountHeaderAction';

export const dynamic = 'force-dynamic';

export default async function AccountsPage() {
  const accounts = await getAccounts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Contas & Carteiras
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gerencie suas contas bancárias, cartões, carteiras físicas e investimentos
          </p>
        </div>

        <AccountHeaderAction />
      </div>

      <AccountList accounts={accounts} />
    </div>
  );
}
