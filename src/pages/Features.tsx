
import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Receipt, Shield, Calculator, FileText, 
  Clock, Sparkles, Cloud, Smartphone
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Receipt,
      title: "GST Invoice Generation",
      description: "Create professional GST compliant invoices in minutes with our easy-to-use interface."
    },
    {
      icon: Shield,
      title: "Compliance Guaranteed",
      description: "Stay compliant with the latest GST regulations. We keep our system updated with the newest tax rules."
    },
    {
      icon: Calculator,
      title: "Automatic Calculations",
      description: "Let our system handle all GST calculations automatically, eliminating manual errors."
    },
    {
      icon: FileText,
      title: "Custom Templates",
      description: "Choose from a variety of professional invoice templates or create your own branded design."
    },
    {
      icon: Clock,
      title: "Time-Saving",
      description: "Save hours on invoice preparation with our streamlined process and bulk operations."
    },
    {
      icon: Sparkles,
      title: "Smart Analytics",
      description: "Get insights into your business with detailed reports and analytics dashboards."
    },
    {
      icon: Cloud,
      title: "Cloud Storage",
      description: "Access your invoices from anywhere with secure cloud storage and backup."
    },
    {
      icon: Smartphone,
      title: "Mobile Responsive",
      description: "Create and manage invoices on any device with our responsive design."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <LandingHeader />
      
      <main className="flex-grow py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gold-600 to-gold-400 bg-clip-text text-transparent">
              Features
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover how Gold GST Manager simplifies your invoicing process and helps you stay compliant.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gold-100 dark:bg-gold-900/20 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-gold-500" />
                  </div>
                  <CardTitle className="text-xl mb-2 dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default Features;
