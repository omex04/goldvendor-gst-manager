
import React from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { MainLayout } from '@/components/layout/MainLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentInvoices from '@/components/dashboard/RecentInvoices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  {
    name: 'Jan',
    total: 18000,
  },
  {
    name: 'Feb',
    total: 23500,
  },
  {
    name: 'Mar',
    total: 29000,
  },
  {
    name: 'Apr',
    total: 42000,
  },
  {
    name: 'May',
    total: 37500,
  },
  {
    name: 'Jun',
    total: 43000,
  },
];

const Index = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your Gold GST Manager dashboard</p>
          
          <DashboardStats />
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data}>
                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`₹${value}`, 'Revenue']}
                      cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                    />
                    <Bar 
                      dataKey="total" 
                      fill="hsl(47, 100%, 50%)" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        New invoice created
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Invoice #INV-006 for Vikram Singh
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      2 hours ago
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Payment received
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ₹18,540 for Invoice #INV-002
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      Yesterday
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        GST Report generated
                      </p>
                      <p className="text-sm text-muted-foreground">
                        April 2023 GSTR-1 report
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      2 days ago
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Data backed up
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Automatic system backup completed
                      </p>
                    </div>
                    <div className="ml-auto text-xs text-muted-foreground">
                      3 days ago
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <RecentInvoices />
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Index;
