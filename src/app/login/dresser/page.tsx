import { redirect } from 'next/navigation';

export default function LoginDresserPage() {
  redirect('/login?kind=salon');
}
