
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger, SidebarFooter } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart3, FileText, Home, LayoutDashboard, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'Create Invoice', path: '/create-invoice' },
    { icon: BarChart3, label: 'Invoice History', path: '/invoice-history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary/30">
        <Sidebar className="border-r border-border bg-background">
          <div className="p-4 flex items-center justify-center py-8">
            <Link to="/" className="flex items-center gap-2 text-xl font-semibold">
              <div className="w-8 h-8 rounded-md bg-gold-500 flex items-center justify-center">
                <Home className="w-5 h-5 text-black" />
              </div>
              <span className="text-foreground">Gold GST</span>
            </Link>
          </div>
          
          <SidebarContent className="px-2">
            <nav className="space-y-1">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </SidebarContent>
          
          <SidebarFooter className="p-4 mt-auto border-t">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-secondary text-secondary-foreground">GV</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Gold Vendor</p>
                <p className="text-xs text-muted-foreground">vendor@example.com</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="p-4 h-16 border-b bg-background flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-lg font-medium">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Gold GST Manager'}
              </h1>
            </div>
          </div>
          <div className="p-6 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default MainLayout;
