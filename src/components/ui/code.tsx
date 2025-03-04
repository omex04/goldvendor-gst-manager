
import React from "react";
import { cn } from "@/lib/utils";

interface CodeProps extends React.HTMLAttributes<HTMLPreElement> {
  children: React.ReactNode;
}

export function Code({ children, className, ...props }: CodeProps) {
  return (
    <pre
      className={cn(
        "p-4 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-auto text-sm font-mono",
        className
      )}
      {...props}
    >
      {children}
    </pre>
  );
}
