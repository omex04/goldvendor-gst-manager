import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      <LandingHeader />
      
      <main className="flex-grow py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-gold-600 to-gold-400 bg-clip-text text-transparent text-center">
            Privacy Policy
          </h1>
          
          <div className="prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2>1. Introduction</h2>
            <p>
              Gold GST Manager ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information when you use our service.
            </p>
            
            <h2>2. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you:
            </p>
            <ul>
              <li>Create an account and use our services</li>
              <li>Fill out forms or submit information on our website</li>
              <li>Generate invoices using our platform</li>
              <li>Contact customer support</li>
              <li>Subscribe to our newsletter or marketing communications</li>
            </ul>
            
            <p>This information may include:</p>
            <ul>
              <li>Contact information (name, email address, phone number)</li>
              <li>Business information (company name, GST number, address)</li>
              <li>Financial information (bank details for invoicing)</li>
              <li>Invoice data and transaction records</li>
              <li>Account credentials</li>
              <li>Customer feedback and support communications</li>
            </ul>
            
            <h2>3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Send technical notices, updates, security alerts, and support messages</li>
              <li>Communicate with you about products, services, offers, and events</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Personalize and improve your experience</li>
            </ul>
            
            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2>5. Data Retention</h2>
            <p>
              We retain your information for as long as your account is active or as needed to provide you with our services. We also retain and use your information as necessary to comply with legal obligations, resolve disputes, and enforce our agreements.
            </p>
            
            <h2>6. Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or incomplete information</li>
              <li>Deletion of your personal information</li>
              <li>Restriction or objection to our use of your information</li>
              <li>Data portability</li>
              <li>Withdrawal of consent</li>
            </ul>
            
            <h2>7. Changes to This Privacy Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
            
            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our data practices, please contact us at:
            </p>
            <p>
              Email: privacy@goldgstmanager.com<br />
              Address: 123 Gold Lane, Jewelers Street, Mumbai, Maharashtra 400001, India
            </p>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};

export default PrivacyPolicy;
