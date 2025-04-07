
import React from 'react';

const RegisterBenefits = () => {
  return (
    <div className="bg-gradient-to-r from-gold-500 to-gold-600 p-8 flex flex-col justify-between text-black h-full">
      <div>
        <h2 className="text-3xl font-bold mb-4">Gold GST Manager</h2>
        <p className="text-lg mb-6">
          Simplify your GST filing and management for gold and jewelry businesses.
        </p>
        
        <div className="bg-white/20 p-6 rounded-xl backdrop-blur-sm">
          <h3 className="font-medium text-xl mb-4">Why Choose Us?</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                <span className="text-gold-600">✓</span>
              </div>
              <span>Easy GST calculation</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                <span className="text-gold-600">✓</span>
              </div>
              <span>Professional invoice generation</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                <span className="text-gold-600">✓</span>
              </div>
              <span>HSN code management</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                <span className="text-gold-600">✓</span>
              </div>
              <span>Detailed reporting and analytics</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-10 bg-black/10 p-4 rounded-lg">
        <p className="italic text-sm">
          "Gold GST Manager has transformed how we handle our invoicing and tax filing. 
          The time saved is incredible!" — Rajesh Jewelers
        </p>
      </div>
    </div>
  );
};

export default RegisterBenefits;
