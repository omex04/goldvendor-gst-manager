
import React from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchInvoices } from '@/services/invoiceService';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/exportUtils';
import { DollarSign, FileText, TrendingUp, BarChart3 } from 'lucide-react';

const Index = () => {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  });

  // Calculate dashboard stats
  const totalRevenue = invoices?.reduce((sum, invoice) => sum + invoice.grandTotal, 0) || 0;
  const totalInvoices = invoices?.length || 0;
  const paidInvoices = invoices?.filter(invoice => invoice.status === 'paid').length || 0;
  const pendingInvoices = totalInvoices - paidInvoices;
  const cgstCollected = invoices?.reduce((sum, invoice) => sum + invoice.cgstTotal, 0) || 0;
  const sgstCollected = invoices?.reduce((sum, invoice) => sum + invoice.sgstTotal, 0) || 0;

  // Get recent invoices (last 4)
  const recentInvoices = invoices?.slice(0, 4) || [];

  // Generate monthly data
  const getMonthlyData = () => {
    if (!invoices || invoices.length === 0) return [];
    
    const monthlyData: { [key: string]: number } = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize with zero values
    monthNames.forEach(month => {
      monthlyData[month] = 0;
    });
    
    // Add up invoice totals by month
    invoices.forEach(invoice => {
      const month = monthNames[invoice.date.getMonth()];
      monthlyData[month] += invoice.grandTotal;
    });
    
    // Convert to array format for chart
    return Object.keys(monthlyData).map(month => ({
      name: month,
      total: monthlyData[month],
    }));
  };

  const chartData = getMonthlyData();

  return (
    <MainLayout>
      <PageTransition>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your Gold GST Manager dashboard</p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card-hover dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+{(paidInvoices / (totalInvoices || 1) * 100).toFixed(1)}%</span> paid rate
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-hover dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Invoices</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalInvoices}</div>
                <p className="text-xs text-muted-foreground mt-1">{pendingInvoices} pending, {paidInvoices} paid</p>
              </CardContent>
            </Card>
            
            <Card className="card-hover dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CGST Collected</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{cgstCollected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>
            
            <Card className="card-hover dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SGST Collected</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{sgstCollected.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[350px] flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Loading chart data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData}>
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
                        formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                      />
                      <Bar 
                        dataKey="total" 
                        fill="hsl(47, 100%, 50%)" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-3 dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Loading activity data...</p>
                  </div>
                ) : recentInvoices.length > 0 ? (
                  <div className="space-y-8">
                    {recentInvoices.map((invoice, index) => (
                      <div key={invoice.id} className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {invoice.status === 'paid' ? 'Payment received' : 'New invoice created'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {invoice.status === 'paid' 
                              ? `₹${invoice.grandTotal.toLocaleString('en-IN')} for Invoice #${invoice.invoiceNumber}`
                              : `Invoice #${invoice.invoiceNumber} for ${invoice.customer.name}`
                            }
                          </p>
                        </div>
                        <div className="ml-auto text-xs text-muted-foreground">
                          {formatDate(invoice.date)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-medium">Recent Invoices</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/invoice-history">View all</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[200px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Loading invoices...</p>
                </div>
              ) : recentInvoices.length > 0 ? (
                <div className="space-y-4">
                  {recentInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 bg-secondary/50 dark:bg-gray-700/50 rounded-md">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/20 dark:bg-gray-600">
                            {invoice.customer.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{invoice.customer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {invoice.invoiceNumber} • {formatDate(invoice.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-right">
                          ₹{invoice.grandTotal.toLocaleString('en-IN')}
                          <p className="text-xs text-muted-foreground capitalize">{invoice.status}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                          <Link to={`/view-invoice/${invoice.id}`}>
                            <span className="sr-only">View</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No invoices created yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Index;
