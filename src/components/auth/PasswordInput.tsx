'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function PasswordInput({ className, ...props }: Omit<React.ComponentProps<'input'>, 'type'>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full">
      <Input
        {...props}
        type={visible ? 'text' : 'password'}
        className={cn('auth-password-input pr-12', className)}
      />
      <button
        type="button"
        tabIndex={-1}
        className="absolute inset-y-0 right-0 z-10 flex w-12 items-center justify-center text-neutral-400 hover:text-neutral-800 transition-colors duration-200 cursor-pointer focus:outline-none"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? 'Нууц үг нуух' : 'Нууц үг харах'}
      >
        {visible ? (
          <EyeOff className="h-5 w-5 text-neutral-600 transition-transform active:scale-90" strokeWidth={2} />
        ) : (
          <Eye className="h-5 w-5 text-neutral-500 transition-transform active:scale-90" strokeWidth={2} />
        )}
      </button>
    </div>
  );
}
