import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { getCurrentUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import { SidebarProvider } from '@/components/providers/SidebarProvider';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authData = await getCurrentUser();

  if (!authData?.user) {
    redirect('/login');
  }

  const userName = authData.profile?.full_name;
  const userEmail = authData.user.email;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50/70 dark:bg-slate-950 transition-colors duration-200">
        <Sidebar userName={userName} userEmail={userEmail} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header userName={userName} userEmail={userEmail} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
