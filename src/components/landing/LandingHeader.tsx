
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ui/theme-provider';
import { useIsMobile } from '@/hooks/use-mobile';  // Changed from useMobile to useIsMobile

const LandingHeader = () => {
  const { setTheme, theme } = useTheme();
  const isMobile = useIsMobile();  // Changed from { isMobile } to just isMobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gold-500 flex items-center justify-center">
              <Home className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white hidden sm:inline-block">Gold GST</span>
          </Link>
        </div>
        
        {!isMobile ? (
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/features" className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gold-600 dark:text-gray-200 dark:hover:text-gold-400">Features</Link>
            <Link to="/invoice-templates" className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gold-600 dark:text-gray-200 dark:hover:text-gold-400">Templates</Link>
            <Link to="/pricing" className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gold-600 dark:text-gray-200 dark:hover:text-gold-400">Pricing</Link>
            <Link to="/about" className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gold-600 dark:text-gray-200 dark:hover:text-gold-400">About</Link>
            <Link to="/contact" className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gold-600 dark:text-gray-200 dark:hover:text-gold-400">Contact</Link>
          </nav>
        ) : null}
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="mr-2 text-gray-700 dark:text-gray-200"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {!isMobile ? (
            <>
              <Button 
                variant="outline" 
                size="sm"
                asChild
                className="dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button 
                size="sm"
                asChild
                className="bg-gold-500 hover:bg-gold-600 text-black"
              >
                <Link to="/register">Register</Link>
              </Button>
            </>
          ) : (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-200"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && isMobile && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/features"
              onClick={() => setIsMenuOpen(false)} 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Features
            </Link>
            <Link 
              to="/invoice-templates"
              onClick={() => setIsMenuOpen(false)} 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Templates
            </Link>
            <Link 
              to="/pricing"
              onClick={() => setIsMenuOpen(false)} 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Pricing
            </Link>
            <Link 
              to="/about"
              onClick={() => setIsMenuOpen(false)} 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              About
            </Link>
            <Link 
              to="/contact"
              onClick={() => setIsMenuOpen(false)} 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Contact
            </Link>
            <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-3">
                <Link 
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}  
                  className="w-full block px-3 py-2 rounded-md text-center text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 mb-2"
                >
                  Login
                </Link>
              </div>
              <div className="flex items-center px-3">
                <Link 
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}  
                  className="w-full block px-3 py-2 rounded-md text-center text-base font-medium bg-gold-500 hover:bg-gold-600 text-black"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;

