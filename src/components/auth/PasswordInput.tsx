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
        className={cn('auth-password-input', className)}
      />
      <button
        type="button"
        tabIndex={-1}
        className="auth-password-toggle"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? 'Нууц үг нуух' : 'Нууц үг харах'}
      >
        {visible ? <EyeOff strokeWidth={1.75} /> : <Eye strokeWidth={1.75} />}
      </button>
    </div>
  );
}
