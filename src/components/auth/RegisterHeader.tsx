
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';

const RegisterHeader = () => {
  return (
    <div className="pb-4 px-0">
      <div className="flex items-center gap-2">
        <UserPlus className="h-5 w-5 text-gold-500" />
        <CardTitle className="dark:text-white text-2xl">Create your account</CardTitle>
      </div>
      <CardDescription className="dark:text-gray-400">
        Enter your details to get started with Gold GST Manager
      </CardDescription>
    </div>
  );
};

export default RegisterHeader;
