'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function PasswordInput({ className, ...props }: Omit<React.ComponentProps<'input'>, 'type'>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative w-full flex items-center">
      <Input
        {...props}
        type={visible ? 'text' : 'password'}
        className={cn('auth-password-input pr-12 text-sm', className)}
      />
      <button
        type="button"
        tabIndex={-1}
        className="absolute right-0 top-0 bottom-0 z-20 flex w-12 items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors duration-150 cursor-pointer focus:outline-none select-none"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? 'Нууц үг нуух' : 'Нууц үг харах'}
      >
        {visible ? (
          <EyeOff className="h-[22px] w-[22px] stroke-[2] text-neutral-700 hover:text-black transition-transform active:scale-90" />
        ) : (
          <Eye className="h-[22px] w-[22px] stroke-[2] text-neutral-600 hover:text-black transition-transform active:scale-90" />
        )}
      </button>
    </div>
  );
}
