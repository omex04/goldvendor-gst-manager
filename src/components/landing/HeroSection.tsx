
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#f1e26a_1px,transparent_1px)] [background-size:20px_20px] opacity-20 dark:opacity-10"></div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 dark:text-white">
              <span className="text-gold-500">GST Invoices</span> Made Simple for Gold Vendors
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-xl">
              Create professional GST invoices in minutes. Start with 3 free invoices, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                size="lg" 
                className="bg-gold-500 hover:bg-gold-600 text-black dark:bg-gold-600 dark:hover:bg-gold-700"
              >
                <Link to="/register">Start Free Trial</Link>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="dark:border-gray-700 dark:text-gray-300"
              >
                <a href="#pricing">View Pricing</a>
              </Button>
            </div>
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              Join thousands of gold vendors already using our platform
            </div>
          </div>
          
          <div className="lg:w-1/2 lg:pl-12">
            <div className="relative rounded-lg overflow-hidden shadow-xl">
              <div className="bg-gray-900 p-2 rounded-t-lg flex items-center">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mx-auto text-white text-xs">Gold GST Manager</div>
              </div>
              <div className="relative bg-white dark:bg-gray-800 p-6 rounded-b-lg">
                <div className="space-y-4">
                  <div className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
                    Professional Gold Invoice
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Vendor Details</div>
                      <div className="text-sm font-medium dark:text-white">Gold Jewelry Shop</div>
                    </div>
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Invoice #</div>
                      <div className="text-sm font-medium dark:text-white">INV-2023-001</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 border-t border-b py-4 border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium dark:text-white">Item Description</span>
                      <span className="font-medium dark:text-white">Amount</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Gold Ring (10g)</span>
                      <span className="text-gray-600 dark:text-gray-300">₹52,000</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Making Charges</span>
                      <span className="text-gray-600 dark:text-gray-300">₹5,000</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="font-medium dark:text-white">SGST (1.5%)</span>
                    <span className="text-gray-600 dark:text-gray-300">₹855</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium dark:text-white">CGST (1.5%)</span>
                    <span className="text-gray-600 dark:text-gray-300">₹855</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="dark:text-white">Total Amount</span>
                    <span className="text-gold-600 dark:text-gold-500">₹58,710</span>
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <div className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      GST Compliant
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
