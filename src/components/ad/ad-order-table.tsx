'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronUp,
  EllipsisVertical,
  ExternalLink,
  FileText,
  Printer,
  Trash2,
} from 'lucide-react';

import { AdOrderStatusModal } from '@/components/ad/ad-order-status-modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ORDER_SOURCE_LABELS,
  ORDER_STATUS_LABELS,
  type AdOrder,
  type OrderStatus,
} from '@/lib/ad/orders';
import { cn, formatPrice } from '@/lib/utils';

function paymentClass(status: AdOrder['paymentStatus']) {
  return status === 'paid' ? 'ad-order-status--success' : 'ad-order-status--muted';
}

function orderStatusClass(status: OrderStatus) {
  switch (status) {
    case 'success':
      return 'ad-order-status--success';
    case 'pending_payment':
      return 'ad-order-status--warning';
    case 'preparing':
    case 'ready_for_delivery':
    case 'driver_accepted':
    case 'delivering':
      return 'ad-order-status--info';
    case 'cancelled':
    case 'fake':
    case 'delivery_failed':
      return 'ad-order-status--danger';
    default:
      return 'ad-order-status--muted';
  }
}

type QuickEditDraft = {
  email: string;
  phone: string;
  lastName: string;
  firstName: string;
  date: string;
  deliveryFee: string;
  address: string;
};

function OrderQuickEdit({
  order,
  onSave,
  onCancel,
}: {
  order: AdOrder;
  onSave: (patch: Partial<AdOrder>) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<QuickEditDraft>({
    email: order.email || '',
    phone: order.phone,
    lastName: order.lastName || '',
    firstName: order.firstName || '',
    date: order.date,
    deliveryFee: String(order.deliveryFee ?? 0),
    address: order.address || '',
  });
  const [saved, setSaved] = useState(false);

  const set =
    (key: keyof QuickEditDraft) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDraft((prev) => ({ ...prev, [key]: e.target.value }));
      setSaved(false);
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fee = Number(draft.deliveryFee);
    onSave({
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      lastName: draft.lastName.trim(),
      firstName: draft.firstName.trim(),
      date: draft.date.trim(),
      deliveryFee: Number.isFinite(fee) ? fee : 0,
      address: draft.address.trim(),
    });
    setSaved(true);
  };

  return (
    <tr className="ad-order-quick-edit">
      <td colSpan={8}>
        <div className="ad-order-quick-edit__inner">
          <div className="ad-order-quick-edit__spacer" />
          <form className="ad-order-quick-edit__form" onSubmit={handleSubmit}>
            <div className="ad-order-quick-edit__grid">
              <div className="ad-order-quick-edit__field">
                <label>И-Мэйл</label>
                <input type="text" value={draft.email} onChange={set('email')} className="ad-order-input" />
              </div>
              <div className="ad-order-quick-edit__field">
                <label>Утас</label>
                <input type="text" value={draft.phone} onChange={set('phone')} className="ad-order-input" />
              </div>
              <div className="ad-order-quick-edit__field">
                <label>Овог</label>
                <input type="text" value={draft.lastName} onChange={set('lastName')} className="ad-order-input" />
              </div>
              <div className="ad-order-quick-edit__field">
                <label>Нэр</label>
                <input type="text" value={draft.firstName} onChange={set('firstName')} className="ad-order-input" />
              </div>
              <div className="ad-order-quick-edit__field">
                <label>Захиалгын огноо</label>
                <input type="text" value={draft.date} onChange={set('date')} className="ad-order-input" />
              </div>
              <div className="ad-order-quick-edit__field">
                <label>Хүргэлтийн үнэ</label>
                <input
                  type="number"
                  value={draft.deliveryFee}
                  onChange={set('deliveryFee')}
                  className="ad-order-input"
                />
              </div>
              <div className="ad-order-quick-edit__field ad-order-quick-edit__field--wide">
                <label>Хаяг</label>
                <textarea
                  value={draft.address}
                  onChange={set('address')}
                  rows={3}
                  className="ad-order-input ad-order-textarea"
                />
              </div>
              <div className="ad-order-quick-edit__actions">
                {saved ? <span className="ad-order-quick-edit__saved">Хадгалагдлаа</span> : null}
                <button type="button" className="ad-order-btn ad-order-btn--default" onClick={onCancel}>
                  Хаах
                </button>
                <button type="submit" className="ad-order-btn ad-order-btn--success">
                  Хадгалах
                </button>
              </div>
            </div>
          </form>
        </div>
      </td>
    </tr>
  );
}

function OrderRow({
  order,
  striped,
  onUpdate,
}: {
  order: AdOrder;
  striped?: boolean;
  onUpdate: (id: string, patch: Partial<AdOrder>) => void;
}) {
  const [quickEditOpen, setQuickEditOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  return (
    <>
      <tr className={cn('ad-order-row', striped && 'ad-order-row--striped')}>
        <td className="ad-order-cell ad-order-cell--id">
          <Link href={`/ad/orders/${order.id}`} className="ad-order-id">
            #{order.id}
          </Link>
        </td>

        <td className="ad-order-cell ad-order-cell--customer">
          <ul className="ad-order-customer-list">
            <li>
              <Link href={`/ad/orders/${order.id}`} className="ad-order-customer-name">
                {order.customerName}
              </Link>
            </li>
            <li>
              <span className="ad-order-meta-label">E-Мэйл:</span> {order.email || ''}
            </li>
            <li>
              <span className="ad-order-meta-label">Утас:</span> {order.phone}
            </li>
            <li>
              <span className="ad-order-meta-label">Хаанаас:</span>{' '}
              <span className="ad-order-source-badge">{ORDER_SOURCE_LABELS[order.source]}</span>
            </li>
          </ul>
          <div className="ad-order-customer-extra">
            <span className="ad-order-meta-label">Төлбөрийн нөхцөл:</span> <span>{order.paymentMethod}</span>
          </div>
          <div className="ad-order-customer-extra">
            <span className="ad-order-meta-label">Хариуцсан менежер:</span>{' '}
            <span>{order.manager || ' / '}</span>
          </div>
        </td>

        <td className="ad-order-cell ad-order-cell--amount">₮ {formatPrice(order.total).replace('₮', '').trim()}</td>

        <td className="ad-order-cell">
          <div className={cn('ad-order-status', paymentClass(order.paymentStatus))}>
            {order.paymentStatus === 'paid' ? 'Төлсөн' : 'Төлөөгүй'}
          </div>
        </td>

        <td className="ad-order-cell">
          <button
            type="button"
            className={cn('ad-order-status ad-order-status--click', orderStatusClass(order.status))}
            onClick={() => setStatusOpen(true)}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </button>
        </td>

        <td className="ad-order-cell ad-order-cell--date">{order.date}</td>

        <td className="ad-order-cell ad-order-cell--actions">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="ad-order-btn ad-order-btn--default ad-order-btn--sm ad-order-btn--block">
                Захиалгыг удирдах
                <ChevronDown className="size-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="ad-order-dropdown">
              <DropdownMenuItem asChild>
                <Link href={`/ad/orders/${order.id}`}>
                  <ExternalLink className="size-3.5" />
                  Дэлгэрэнгүй үзэх
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.print()}>
                <Printer className="size-3.5" />
                Хэвлэх
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/ad/invoices/${order.invoiceId || order.id}`}>
                  <FileText className="size-3.5" />
                  Нэхэмжлэл үзэх
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusOpen(true)}>Статус өөрчлөх</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            onClick={() => setQuickEditOpen((v) => !v)}
            className="ad-order-btn ad-order-btn--default ad-order-btn--sm ad-order-btn--block ad-order-quick-edit-toggle"
          >
            Түргэн засах
            {quickEditOpen ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
          </button>
        </td>

        <td className="ad-order-cell ad-order-cell--menu">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="ad-order-icon-btn" aria-label="Бусад">
                <EllipsisVertical className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="ad-order-dropdown">
              <DropdownMenuItem variant="destructive">
                <Trash2 className="size-3.5" />
                Устгах
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      {quickEditOpen && (
        <OrderQuickEdit
          order={order}
          onSave={(patch) => {
            onUpdate(order.id, patch);
          }}
          onCancel={() => setQuickEditOpen(false)}
        />
      )}
      <AdOrderStatusModal
        open={statusOpen}
        order={order}
        onClose={() => setStatusOpen(false)}
        onSave={(status) => onUpdate(order.id, { status })}
      />
    </>
  );
}

export function AdOrderTable({
  orders,
  onUpdate,
}: {
  orders: AdOrder[];
  onUpdate: (id: string, patch: Partial<AdOrder>) => void;
}) {
  if (orders.length === 0) {
    return (
      <div className="ad-order-empty">
        <p>Захиалга олдсонгүй</p>
      </div>
    );
  }

  return (
    <div className="ad-order-table-wrap">
      <table className="ad-order-table">
        <thead>
          <tr>
            <th>Зах. #</th>
            <th>Хэрэглэгч</th>
            <th>Нийт дүн</th>
            <th>Төлбөр</th>
            <th>Статус</th>
            <th>Огноо</th>
            <th colSpan={2} />
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <OrderRow key={order.id} order={order} striped={index % 2 === 1} onUpdate={onUpdate} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
