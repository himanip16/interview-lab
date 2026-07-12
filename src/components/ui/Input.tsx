
// components/ui/Input.tsx
import React from "react";

export const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`
        flex h-10 w-full rounded-md border border-zinc-300 
        bg-white px-3 py-2 text-sm text-zinc-900 
        placeholder:text-zinc-500 focus:outline-none 
        focus:ring-2 focus:ring-zinc-500 disabled:cursor-not-allowed 
        disabled:opacity-50 ${className}
      `}
      {...props}
    />
  );
};