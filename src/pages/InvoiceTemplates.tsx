
import React from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Eye, Download } from 'lucide-react';

const InvoiceTemplates = () => {
  const templates = [
    {
      id: 'classic',
      name: 'Classic Gold',
      description: 'Traditional invoice design with gold accents for established jewelers',
      image: '/templates/classic.png',
      popular: false,
    },
    {
      id: 'modern',
      name: 'Modern Minimal',
      description: 'Clean, contemporary design with focus on simplicity and elegance',
      image: '/templates/modern.png',
      popular: true,
    },
    {
      id: 'premium',
      name: 'Premium Luxury',
      description: 'Sophisticated template with luxury finishes for high-end jewelry businesses',
      image: '/templates/premium.png',
      popular: false,
    },
    {
      id: 'boutique',
      name: 'Boutique Style',
      description: 'Stylish design for independent jewelry boutiques with artistic flair',
      image: '/templates/boutique.png',
      popular: false,
    },
    {
      id: 'retail',
      name: 'Retail Chain',
      description: 'Professional template designed for multi-location jewelry retailers',
      image: '/templates/retail.png',
      popular: false,
    },
    {
      id: 'wholesale',
      name: 'Wholesale Trade',
      description: 'Specialized template for B2B gold and jewelry wholesalers',
      image: '/templates/wholesale.png',
      popular: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <LandingHeader />
      
      <main className="flex-grow py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gold-600 to-gold-400 bg-clip-text text-transparent">
              Invoice Templates
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose from our professionally designed GST invoice templates tailored specifically for gold and jewelry businesses.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {templates.map((template) => (
              <Card 
                key={template.id}
                className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col"
              >
                <div className="relative">
                  {template.popular && (
                    <div className="absolute top-3 right-3 bg-gold-500 text-black px-3 py-1 rounded-full text-sm font-medium z-10">
                      Popular
                    </div>
                  )}
                  <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <img 
                      src={template.image} 
                      alt={`${template.name} template preview`}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl mb-2 dark:text-white">{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 dark:text-gray-300">{template.description}</p>
                </CardContent>
                <CardFooter className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button 
                    className="flex-1 bg-gold-500 hover:bg-gold-600 text-black"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Need a Custom Template?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              We can create a bespoke invoice template that perfectly matches your brand identity and specific business requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="bg-gold-500 hover:bg-gold-600 text-black dark:bg-gold-600 dark:hover:bg-gold-700 shadow-lg"
              >
                <Link to="/contact">Contact Us for Custom Design</Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
              >
                <Link to="/register">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default InvoiceTemplates;
