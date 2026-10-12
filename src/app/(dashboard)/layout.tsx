import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { getCurrentUser } from '@/actions/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authData = await getCurrentUser();

  if (!authData?.user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-slate-50/60 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userName={authData.profile?.full_name}
          userEmail={authData.user.email}
        />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
