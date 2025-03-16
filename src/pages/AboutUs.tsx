
import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import { Shield, Award, Users } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <LandingHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 dark:text-white">About Gold GST Manager</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're on a mission to make GST invoicing simple, accurate, and affordable for gold vendors across India.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 dark:text-white">Our Story</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Gold GST Manager was born out of frustration with existing invoicing solutions that weren't tailored to the unique needs of gold vendors.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  As gold jewelry retailers ourselves, we understood the challenges of managing GST calculations specific to precious metals, maintaining compliance with frequently changing regulations, and keeping track of business metrics.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  We created Gold GST Manager in 2023 to address these pain points, offering an intuitive, affordable solution designed specifically for gold vendors. Today, we serve thousands of jewelry businesses across India, from small family shops to large retail chains.
                </p>
              </div>
              <div className="bg-gold-50 dark:bg-gray-800 rounded-lg p-8 border border-gold-100 dark:border-gray-700">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="mt-1 bg-gold-100 dark:bg-gray-700 p-2 rounded">
                      <Shield className="h-6 w-6 text-gold-600 dark:text-gold-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold dark:text-white">Our Mission</h3>
                      <p className="text-gray-600 dark:text-gray-300">To simplify GST compliance for gold vendors through user-friendly technology.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mt-1 bg-gold-100 dark:bg-gray-700 p-2 rounded">
                      <Award className="h-6 w-6 text-gold-600 dark:text-gold-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold dark:text-white">Our Values</h3>
                      <p className="text-gray-600 dark:text-gray-300">Simplicity, accuracy, affordability, and exceptional customer support.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mt-1 bg-gold-100 dark:bg-gray-700 p-2 rounded">
                      <Users className="h-6 w-6 text-gold-600 dark:text-gold-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold dark:text-white">Our Team</h3>
                      <p className="text-gray-600 dark:text-gray-300">A passionate group of gold industry experts and software developers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 bg-gold-50 dark:bg-gray-800">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold dark:text-white">Our Impact</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-sm text-center">
                <div className="text-4xl font-bold text-gold-500 mb-2">5,000+</div>
                <div className="text-gray-600 dark:text-gray-300">Satisfied Customers</div>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-sm text-center">
                <div className="text-4xl font-bold text-gold-500 mb-2">250,000+</div>
                <div className="text-gray-600 dark:text-gray-300">Invoices Generated</div>
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-sm text-center">
                <div className="text-4xl font-bold text-gold-500 mb-2">₹500 Cr+</div>
                <div className="text-gray-600 dark:text-gray-300">Transactions Processed</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default AboutUs;
