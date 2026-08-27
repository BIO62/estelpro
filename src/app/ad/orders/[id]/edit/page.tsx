'use client';

import { useParams } from 'next/navigation';

import { AdOrderCompose } from '@/app/ad/create-order/page';

export default function AdOrderEditPage() {
  const { id } = useParams<{ id: string }>();
  return <AdOrderCompose editId={id} />;
}
