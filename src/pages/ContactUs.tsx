
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import { toast } from 'sonner';

const ContactUs = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // In a real app, you would send this data to your backend
    // For now, we'll just show a success toast
    toast.success("Your message has been sent! We'll get back to you soon.");
    
    // Reset the form
    e.currentTarget.reset();
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <LandingHeader />
      
      <main className="flex-grow">
        {/* Contact Hero */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 dark:text-white">Contact Us</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Have questions about Gold GST Manager? Our team is here to help.
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Get in Touch</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  We're here to help with any questions you have about our services, pricing, or how Gold GST Manager can benefit your jewelry business.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="mt-1 bg-gold-100 dark:bg-gray-700 p-2 rounded">
                      <Mail className="h-5 w-5 text-gold-600 dark:text-gold-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold dark:text-white">Email</h3>
                      <p className="text-gray-600 dark:text-gray-300">support@goldgstmanager.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mt-1 bg-gold-100 dark:bg-gray-700 p-2 rounded">
                      <Phone className="h-5 w-5 text-gold-600 dark:text-gold-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold dark:text-white">Phone</h3>
                      <p className="text-gray-600 dark:text-gray-300">+91 99999 88888</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mt-1 bg-gold-100 dark:bg-gray-700 p-2 rounded">
                      <MapPin className="h-5 w-5 text-gold-600 dark:text-gold-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold dark:text-white">Address</h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        123 Gold Lane, Jewelers Street<br />
                        Mumbai, Maharashtra 400001<br />
                        India
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12">
                  <h3 className="text-lg font-semibold mb-4 dark:text-white">Business Hours</h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-300">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <h2 className="text-2xl font-bold mb-6 dark:text-white">Send a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Full Name
                        </label>
                        <Input 
                          id="name" 
                          placeholder="Your name" 
                          required 
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email Address
                        </label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your.email@example.com" 
                          required 
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Subject
                      </label>
                      <Input 
                        id="subject" 
                        placeholder="How can we help you?" 
                        required 
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Message
                      </label>
                      <Textarea 
                        id="message" 
                        placeholder="Your message..." 
                        required 
                        rows={6}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gold-500 hover:bg-gold-600 text-black dark:bg-gold-600 dark:hover:bg-gold-700"
                    >
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default ContactUs;
