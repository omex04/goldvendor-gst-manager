
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 text-xl font-semibold mb-4">
              <div className="w-8 h-8 rounded-md bg-gold-500 flex items-center justify-center">
                <Home className="w-5 h-5 text-black" />
              </div>
              <span className="text-foreground dark:text-white">Gold GST</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Simplifying GST invoicing for gold vendors across India.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gold-600 dark:hover:text-gold-500">
                  Pricing
                </a>
              </li>
              <li>
                <a href="/#features" className="text-gray-600 dark:text-gray-300 hover:text-gold-600 dark:hover:text-gold-500">
                  Features
                </a>
              </li>
              <li>
                <Link to="/register" className="text-gray-600 dark:text-gray-300 hover:text-gold-600 dark:hover:text-gold-500">
                  Free Trial
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-gold-600 dark:hover:text-gold-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-gold-600 dark:hover:text-gold-500">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-gold-600 dark:hover:text-gold-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-gold-600 dark:hover:text-gold-500">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            © {currentYear} Gold GST Manager. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
