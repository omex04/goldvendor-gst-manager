
import React from 'react';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentInvoices from '@/components/dashboard/RecentInvoices';
import { PageTransition } from '@/components/ui/PageTransition';
import { useQuery } from '@tanstack/react-query';
import { fetchInvoices } from '@/services/invoiceService';

const Dashboard = () => {
  // Fetch invoices data that will be passed to child components
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  });

  return (
    <PageTransition>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DashboardStats invoices={invoices} isLoading={isLoading} />
        <RecentInvoices invoices={invoices} isLoading={isLoading} />
      </div>
    </PageTransition>
  );
};

export default Dashboard;
