import { Suspense } from 'react';
import AuthSplit from '@/components/auth/AuthSplit';
import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <AuthSplit>
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthSplit>
  );
}
