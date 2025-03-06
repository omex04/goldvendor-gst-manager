
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/exportUtils';
import { Link } from 'react-router-dom';
import { Invoice } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentInvoicesProps {
  invoices: Invoice[];
  isLoading: boolean;
}

export function RecentInvoices({ invoices, isLoading }: RecentInvoicesProps) {
  // Get the most recent 4 invoices
  const recentInvoices = [...invoices]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 4);

  if (isLoading) {
    return <RecentInvoicesSkeleton />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-medium">Recent Invoices</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/invoice-history">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentInvoices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No invoices found</p>
          ) : (
            recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/20">
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RecentInvoicesSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-16" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-10" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentInvoices;
