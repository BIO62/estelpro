'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { AdOrderSearch, EMPTY_FILTERS } from '@/components/ad/ad-order-search';
import { AdOrderTable } from '@/components/ad/ad-order-table';
import {
  DEMO_ORDERS,
  filterOrders,
  type AdOrder,
  type OrderFilters,
} from '@/lib/ad/orders';

export default function AdOrdersPage() {
  const [orders, setOrders] = useState<AdOrder[]>(DEMO_ORDERS);
  const [draftFilters, setDraftFilters] = useState<OrderFilters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<OrderFilters>(EMPTY_FILTERS);

  const filtered = useMemo(
    () => filterOrders(orders, appliedFilters),
    [orders, appliedFilters]
  );

  const handleUpdate = (id: string, patch: Partial<AdOrder>) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, ...patch } : order)));
  };

  return (
    <div className="ad-orders-page">
      <div className="ad-orders-page__header">
        <h1 className="ad-orders-page__title">Захиалгууд</h1>
        <Link href="/ad/create-order" className="ad-order-btn ad-order-btn--add">
          <Plus className="size-4" />
          Захиалга нэмэх
        </Link>
      </div>

      <div className="ad-orders-panel">
        <AdOrderSearch
          filters={draftFilters}
          onChange={setDraftFilters}
          onSearch={() => setAppliedFilters({ ...draftFilters })}
          onClear={() => {
            setDraftFilters(EMPTY_FILTERS);
            setAppliedFilters(EMPTY_FILTERS);
          }}
        />

        <AdOrderTable orders={filtered} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}
