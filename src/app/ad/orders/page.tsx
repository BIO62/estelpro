'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';

import { AdOrderSearch, EMPTY_FILTERS } from '@/components/ad/ad-order-search';
import { AdOrderTable } from '@/components/ad/ad-order-table';
import {
  applyOrderStatus,
  filterOrders,
  listStoredOrders,
  migrateLegacyLocalOrders,
  patchStoredOrder,
  restoreStoredOrder,
  subscribeStoredOrders,
  trashStoredOrder,
  type AdOrder,
  type OrderFilters,
} from '@/lib/ad/orders';

export default function AdOrdersPage() {
  return (
    <Suspense fallback={null}>
      <AdOrdersPageInner />
    </Suspense>
  );
}

function AdOrdersPageInner() {
  const searchParams = useSearchParams();
  const trashed = searchParams.get('trashed') === '1';
  const [orders, setOrders] = useState<AdOrder[]>([]);
  const [draftFilters, setDraftFilters] = useState<OrderFilters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<OrderFilters>(EMPTY_FILTERS);

  useEffect(() => {
    const load = async () => {
      await migrateLegacyLocalOrders();
      setOrders(await listStoredOrders());
    };
    void load();
    return subscribeStoredOrders(() => {
      void listStoredOrders().then(setOrders);
    });
  }, []);

  const visible = useMemo(
    () => orders.filter((order) => (trashed ? !!order.deletedAt : !order.deletedAt)),
    [orders, trashed],
  );

  const filtered = useMemo(
    () => filterOrders(visible, appliedFilters),
    [visible, appliedFilters],
  );

  const handleUpdate = async (id: string, patch: Partial<AdOrder>) => {
    if (patch.status && Object.keys(patch).length === 1) {
      await applyOrderStatus(id, patch.status);
    } else {
      await patchStoredOrder(id, patch);
    }
    setOrders(await listStoredOrders());
  };

  const handleTrash = async (id: string) => {
    await trashStoredOrder(id);
    setOrders(await listStoredOrders());
  };

  const handleRestore = async (id: string) => {
    await restoreStoredOrder(id);
    setOrders(await listStoredOrders());
  };

  return (
    <div className="ad-orders-page">
      <div className="ad-orders-page__header">
        <h1 className="ad-orders-page__title">{trashed ? 'Устгагдсан захиалгууд' : 'Захиалгууд'}</h1>
        {trashed ? null : (
          <Link href="/ad/create-order" className="ad-order-btn ad-order-btn--add">
            <Plus className="size-4" />
            Захиалга нэмэх
          </Link>
        )}
      </div>

      {trashed ? (
        <div className="ad-trash-portlet">
          <div className="ad-trash-portlet__body">
            <table className="ad-trash-table">
              <thead>
                <tr>
                  <th>Зах. #</th>
                  <th>Огноо</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 ? (
                  <tr>
                    <td colSpan={2}>Устгагдсан захиалга алга</td>
                  </tr>
                ) : (
                  [...visible]
                    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
                    .map((order) => (
                      <tr key={order.id}>
                        <td>
                          <a href={`/ad/orders/${order.id}`} target="_blank" rel="noopener noreferrer">
                            #{order.id}
                          </a>
                        </td>
                        <td>{order.date}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
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

          <AdOrderTable
            orders={filtered}
            onUpdate={handleUpdate}
            onTrash={handleTrash}
            onRestore={handleRestore}
          />
        </div>
      )}
    </div>
  );
}
