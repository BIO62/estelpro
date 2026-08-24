import AuthSplit from '@/components/auth/AuthSplit';
import { SignupForm } from '@/components/signup-form';

export default function RegisterPage() {
  return (
    <AuthSplit>
      <SignupForm />
    </AuthSplit>
  );
}
