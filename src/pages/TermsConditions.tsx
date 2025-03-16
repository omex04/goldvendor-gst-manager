
import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';

const TermsConditions = () => {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <LandingHeader />
      
      <main className="flex-grow py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 dark:text-white">Terms and Conditions</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Introduction</h2>
            <p>
              Welcome to Gold GST Manager. These Terms and Conditions govern your use of our website and services. By accessing or using Gold GST Manager, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access our service.
            </p>
            
            <h2>2. Definitions</h2>
            <p>
              "Service" refers to the Gold GST Manager website and invoice generation platform.<br />
              "User," "You," and "Your" refers to the individual or organization accessing or using the Service.<br />
              "Company," "We," "Our," and "Us" refers to Gold GST Manager.
            </p>
            
            <h2>3. Account Registration</h2>
            <p>
              To use certain features of the Service, you must register for an account. You must provide accurate, current, and complete information during the registration process. You are responsible for safeguarding your account credentials and for all activities that occur under your account.
            </p>
            
            <h2>4. Free Trial and Subscription</h2>
            <p>
              We offer a free trial that allows users to generate up to 3 invoices at no cost. After exhausting the free trial, you must subscribe to one of our paid plans to continue using the Service.
            </p>
            <p>
              Subscription fees are charged in advance on a monthly or annual basis, depending on your chosen billing cycle. Subscription renewals are automatic unless cancelled before the renewal date.
            </p>
            
            <h2>5. Payment Terms</h2>
            <p>
              All payment information must be accurate and complete. You authorize us to charge your designated payment method for all subscription fees incurred. If a payment fails, we may suspend or terminate your access to the Service.
            </p>
            
            <h2>6. User Conduct</h2>
            <p>
              When using our Service, you agree not to:
            </p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
              <li>Upload or transmit viruses, malware, or other malicious code</li>
            </ul>
            
            <h2>7. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by Gold GST Manager and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or use the Service or any content therein without our prior written consent.
            </p>
            
            <h2>8. Limitation of Liability</h2>
            <p>
              In no event shall Gold GST Manager, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses, resulting from your access to or use of (or inability to access or use) the Service.
            </p>
            
            <h2>9. Disclaimer</h2>
            <p>
              The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.
            </p>
            
            <h2>10. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any breach of these Terms. Upon termination, your right to use the Service will cease immediately.
            </p>
            
            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes. Your continued use of the Service following the posting of any changes constitutes acceptance of those changes.
            </p>
            
            <h2>12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
            
            <h2>13. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              Email: legal@goldgstmanager.com<br />
              Address: 123 Gold Lane, Jewelers Street, Mumbai, Maharashtra 400001, India
            </p>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default TermsConditions;
