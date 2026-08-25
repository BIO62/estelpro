import { redirect } from 'next/navigation';

export default function AdUsersRedirect() {
  redirect('/ad/customers?tab=CONSUMER');
}
