
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, FileText, Shield, TrendingUp, Settings, Clock } from 'lucide-react';
import LandingFooter from '@/components/landing/LandingFooter';
import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import TestimonialCarousel from '@/components/landing/TestimonialCarousel';

const LandingPage = () => {
  const features = [
    {
      icon: FileText,
      title: 'Quick GST Invoicing',
      description: 'Create professional GST invoices in minutes with our intuitive interface.',
    },
    {
      icon: Shield,
      title: 'Compliance Guaranteed',
      description: 'All invoices are 100% compliant with the latest GST regulations.',
    },
    {
      icon: TrendingUp,
      title: 'Business Insights',
      description: 'Track your sales performance with comprehensive analytics.',
    },
    {
      icon: Settings,
      title: 'Customizable Templates',
      description: 'Personalize your invoices with your business branding.',
    },
    {
      icon: Clock,
      title: 'Time-Saving',
      description: 'Automate calculations and focus on growing your jewelry business.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '₹499',
      period: '/month',
      description: 'Perfect for small gold shops',
      features: [
        '10 Invoices per month',
        'Basic invoice templates',
        'GST calculation',
        'Email support',
      ],
      cta: 'Start Free Trial',
      highlight: false,
    },
    {
      name: 'Professional',
      price: '₹999',
      period: '/month',
      description: 'Ideal for growing businesses',
      features: [
        'Unlimited invoices',
        'Premium templates',
        'Business analytics',
        'Priority support',
        'PDF exports',
      ],
      cta: 'Start Free Trial',
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: '₹1,999',
      period: '/month',
      description: 'For established jewelry chains',
      features: [
        'Unlimited invoices',
        'Advanced reporting',
        'Multi-user access',
        'Dedicated account manager',
        'API access',
        'Custom branding',
      ],
      cta: 'Contact Sales',
      highlight: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <LandingHeader />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Why Choose Gold GST Manager?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our specialized platform is designed specifically for gold vendors, making GST invoicing simple, accurate, and cost-effective.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-2 bg-white/90 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gold-100 dark:bg-gold-900/20 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-gold-500" />
                  </div>
                  <CardTitle className="dark:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Free Trial Banner */}
      <section className="py-12 px-4 bg-gradient-to-r from-gold-400 to-gold-600 dark:from-gold-700 dark:to-gold-900">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-black dark:text-gray-900">Start with 3 Free Invoices</h2>
          <p className="text-lg text-gray-800 dark:text-gray-900 mb-8 max-w-2xl mx-auto">
            Try Gold GST Manager risk-free. Create your first 3 invoices with no commitment or credit card required.
          </p>
          <Button 
            asChild
            size="lg" 
            className="bg-black text-white hover:bg-gray-800 dark:bg-gray-900 dark:text-gold-500 dark:hover:bg-gray-800 transform transition-transform hover:scale-105 shadow-lg"
          >
            <Link to="/register">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 dark:bg-gray-900 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the plan that works best for your gold jewelry business needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`border ${plan.highlight ? 'border-gold-500 shadow-lg dark:border-gold-600' : 'border-gray-200 dark:border-gray-700'} 
                relative dark:bg-gray-800 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white backdrop-blur-sm`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gold-500 text-black px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="dark:text-white">{plan.name}</CardTitle>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-3xl font-extrabold dark:text-white">{plan.price}</span>
                    <span className="ml-1 text-gray-500 dark:text-gray-400">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2 dark:text-gray-300">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-gold-500 mr-2" />
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    asChild
                    className={`w-full transition-all duration-300 hover:shadow-md ${plan.highlight 
                      ? 'bg-gold-500 hover:bg-gold-600 text-black dark:bg-gold-600 dark:hover:bg-gold-700' 
                      : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'}`}
                  >
                    <Link to="/register">{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gradient-to-t from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Trusted by Gold Vendors</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Here's what our customers say about Gold GST Manager
            </p>
          </div>
          
          <div>
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 dark:bg-gray-900 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Ready to Streamline Your GST Invoicing?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of gold vendors who save time and ensure compliance with Gold GST Manager.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="bg-gold-500 hover:bg-gold-600 text-black dark:bg-gold-600 dark:hover:bg-gold-700 transform transition-transform hover:scale-105 shadow-lg"
              >
                <Link to="/register">Start Free Trial</Link>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="dark:border-gray-700 dark:text-gray-300 transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default LandingPage;
