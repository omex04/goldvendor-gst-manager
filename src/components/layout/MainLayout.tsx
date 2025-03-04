
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger, SidebarFooter } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart3, FileText, Home, LayoutDashboard, LogOut, Moon, Settings, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ui/theme-provider';
import { toast } from 'sonner';
import { signOut, getCurrentUser } from '@/lib/supabase';
import { useState, useEffect } from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('user@example.com');
  const [userInitials, setUserInitials] = useState('U');
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'Create Invoice', path: '/create-invoice' },
    { icon: BarChart3, label: 'Invoice History', path: '/invoice-history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  useEffect(() => {
    // Fetch current user data from Supabase
    const fetchUserData = async () => {
      const user = await getCurrentUser();
      if (user) {
        const name = user.user_metadata?.name || 'User';
        setUserName(name);
        setUserEmail(user.email || 'user@example.com');
        setUserInitials(name.substring(0, 2).toUpperCase());
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const { success, error } = await signOut();
      
      if (success) {
        toast.success('Logged out successfully');
        navigate('/login');
      } else {
        toast.error(error || 'Logout failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
      console.error('Logout error:', error);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary/30 dark:bg-gray-900">
        <Sidebar className="border-r border-border bg-background dark:bg-gray-800 dark:border-gray-700">
          <div className="p-4 flex items-center justify-center py-8">
            <Link to="/" className="flex items-center gap-2 text-xl font-semibold">
              <div className="w-8 h-8 rounded-md bg-gold-500 flex items-center justify-center">
                <Home className="w-5 h-5 text-black" />
              </div>
              <span className="text-foreground dark:text-white">Gold GST</span>
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
                      ? "bg-primary text-primary-foreground dark:bg-gold-600 dark:text-white"
                      : "text-foreground/70 hover:bg-secondary hover:text-foreground dark:text-gray-300 dark:hover:bg-gray-700"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </SidebarContent>
          
          <SidebarFooter className="p-4 mt-auto border-t dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-secondary text-secondary-foreground dark:bg-gray-700 dark:text-gray-300">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium dark:text-white">{userName}</p>
                <p className="text-xs text-muted-foreground dark:text-gray-400">{userEmail}</p>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-auto dark:bg-gray-900">
          <div className="p-4 h-16 border-b bg-background dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-lg font-medium dark:text-white">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Gold GST Manager'}
              </h1>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-auto mr-2 dark:border-gray-700 dark:text-gray-200"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
          <div className="p-6 animate-fade-in dark:text-white">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default MainLayout;
