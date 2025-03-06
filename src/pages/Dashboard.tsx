
import React from 'react';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentInvoices from '@/components/dashboard/RecentInvoices';
import { PageTransition } from '@/components/ui/PageTransition';

const Dashboard = () => {
  return (
    <PageTransition>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DashboardStats />
        <RecentInvoices />
      </div>
    </PageTransition>
  );
};

export default Dashboard;
