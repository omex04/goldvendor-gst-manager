
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ui/theme-provider';

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border dark:bg-gray-900/80 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold">
            <div className="w-8 h-8 rounded-md bg-gold-500 flex items-center justify-center">
              <Home className="w-5 h-5 text-black" />
            </div>
            <span className="text-foreground dark:text-white">Gold GST</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-foreground dark:text-gray-300 dark:hover:text-white">
              Home
            </Link>
            <a href="/#pricing" className="text-sm font-medium text-foreground/80 hover:text-foreground dark:text-gray-300 dark:hover:text-white">
              Pricing
            </a>
            <Link to="/about" className="text-sm font-medium text-foreground/80 hover:text-foreground dark:text-gray-300 dark:hover:text-white">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium text-foreground/80 hover:text-foreground dark:text-gray-300 dark:hover:text-white">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden md:flex"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <div className="hidden md:flex items-center space-x-2">
              <Button asChild variant="outline" className="dark:border-gray-700 dark:text-gray-300">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild className="bg-gold-500 hover:bg-gold-600 text-black dark:bg-gold-600 dark:hover:bg-gold-700">
                <Link to="/register">Sign up</Link>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-background dark:bg-gray-900 border-b border-border dark:border-gray-800 p-4 shadow-lg">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-sm font-medium text-foreground hover:text-foreground/80 dark:text-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <a 
              href="/#pricing" 
              className="text-sm font-medium text-foreground hover:text-foreground/80 dark:text-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <Link 
              to="/about" 
              className="text-sm font-medium text-foreground hover:text-foreground/80 dark:text-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-sm font-medium text-foreground hover:text-foreground/80 dark:text-gray-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex items-center space-x-2 pt-2">
              <Button asChild variant="outline" className="flex-1 dark:border-gray-700 dark:text-gray-300">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Log in</Link>
              </Button>
              <Button asChild className="flex-1 bg-gold-500 hover:bg-gold-600 text-black dark:bg-gold-600 dark:hover:bg-gold-700">
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="flex items-center justify-center w-full"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
