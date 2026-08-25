import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';

export default async function DresserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // Strictly block regular consumers and unauthenticated visitors
  if (!user || user.role !== 'salon') {
    redirect('/login?kind=salon');
  }

  return <>{children}</>;
}
