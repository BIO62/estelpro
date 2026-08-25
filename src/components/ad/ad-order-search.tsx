'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Download, Filter, Search, X } from 'lucide-react';

import {
  DATE_RANGE_OPTIONS,
  EMPTY_FILTERS,
  MANAGERS,
  PAYMENT_METHODS,
  SOURCE_OPTIONS,
  STATUS_FILTER_OPTIONS,
  type OrderFilters,
} from '@/lib/ad/orders';
import { cn } from '@/lib/utils';

const FILTER_STORAGE_KEY = 'ad_order_filter_expanded';

type AdOrderSearchProps = {
  filters: OrderFilters;
  onChange: (filters: OrderFilters) => void;
  onSearch: () => void;
  onClear: () => void;
};

function FilterField({
  label,
  children,
  className,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('ad-order-filter-field', className)}>
      <label className="ad-order-filter-label">{label}</label>
      {children}
    </div>
  );
}

export function AdOrderSearch({ filters, onChange, onSearch, onClear }: AdOrderSearchProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(localStorage.getItem(FILTER_STORAGE_KEY) === 'true');
  }, []);

  const toggleExpanded = () => {
    const next = !expanded;
    setExpanded(next);
    localStorage.setItem(FILTER_STORAGE_KEY, String(next));
  };

  const set = <K extends keyof OrderFilters>(key: K, value: OrderFilters[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="ad-order-search">
      <form onSubmit={handleSubmit} className="ad-order-search__form">
        <div className="ad-order-search__main">
          <FilterField label="Захиалга хайх [ID]">
            <input
              type="text"
              value={filters.orderId}
              onChange={(e) => set('orderId', e.target.value)}
              placeholder="Зах. дугаараар..."
              className="ad-order-input"
            />
          </FilterField>

          <FilterField label="Захиалга хайх [утас]">
            <input
              type="text"
              value={filters.orderPhone}
              onChange={(e) => set('orderPhone', e.target.value)}
              placeholder="Утас..."
              className="ad-order-input"
            />
          </FilterField>

          <FilterField label="&nbsp;">
            <button type="button" onClick={toggleExpanded} className="ad-order-btn ad-order-btn--default ad-order-btn--block">
              <Filter className="size-3.5" />
              <span>{expanded ? 'Шүүлт нуух' : 'Нэмэлт шүүлт'}</span>
              {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            </button>
          </FilterField>

          <FilterField label="&nbsp;">
            <button type="submit" className="ad-order-btn ad-order-btn--primary ad-order-btn--block">
              <Search className="size-3.5" />
              <span>Хайх</span>
            </button>
          </FilterField>
        </div>

        <div className={cn('ad-order-search__advanced', expanded && 'ad-order-search__advanced--open')}>
          <FilterField label="Төлбөр төлсөн эсэх">
            <select
              value={filters.isPaid}
              onChange={(e) => set('isPaid', e.target.value)}
              className="ad-order-select"
            >
              <option value="">Бүгд</option>
              <option value="-1">Төлөөгүй</option>
              <option value="1">Төлсөн</option>
            </select>
          </FilterField>

          <FilterField label="Төлбөрийн хэлбэр">
            <select
              value={filters.paymentId}
              onChange={(e) => set('paymentId', e.target.value)}
              className="ad-order-select"
            >
              {PAYMENT_METHODS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="Хугацаагаар">
            <select
              value={filters.orderDate}
              onChange={(e) => set('orderDate', e.target.value)}
              className="ad-order-select"
            >
              {DATE_RANGE_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="Огноо">
            <input
              type="date"
              value={filters.tripStart}
              onChange={(e) => set('tripStart', e.target.value)}
              className="ad-order-input"
            />
          </FilterField>

          <FilterField label="Захиалгыг экспорт хийх">
            <button type="button" className="ad-order-btn ad-order-btn--success">
              <Download className="size-3.5" />
              Download CSV
            </button>
          </FilterField>

          <FilterField label="Овог нэрээр">
            <input
              type="text"
              value={filters.nameQuery}
              onChange={(e) => set('nameQuery', e.target.value)}
              placeholder="Овог нэр гэх мэт..."
              className="ad-order-input"
            />
          </FilterField>

          <FilterField label="Нэмэлт утсаар">
            <input
              type="text"
              value={filters.extraPhone}
              onChange={(e) => set('extraPhone', e.target.value)}
              placeholder="Нэмэлт утас..."
              className="ad-order-input"
            />
          </FilterField>

          <FilterField label="Хариуцсан менежер">
            <select
              value={filters.managerId}
              onChange={(e) => set('managerId', e.target.value)}
              className="ad-order-select"
            >
              {MANAGERS.map((opt) => (
                <option key={opt.value || 'none'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="ad-order-filter-spacer" />
            <label className="ad-order-filter-label">Хэзээ</label>
            <select
              value={filters.backup}
              onChange={(e) => set('backup', e.target.value)}
              className="ad-order-select"
            >
              <option value="">Энэ он</option>
              <option value="1">Архив</option>
            </select>
          </FilterField>

          <FilterField label="Хүргэлтийн ажилтан">
            <select
              value={filters.deliveryId}
              onChange={(e) => set('deliveryId', e.target.value)}
              className="ad-order-select"
            >
              <option value="">Сонгох</option>
              <option value="-1">Хүргэлтийн ажилтанд оноож өгөөгүй</option>
            </select>
          </FilterField>

          <FilterField label="Хаанаас">
            <select
              value={filters.source}
              onChange={(e) => set('source', e.target.value)}
              className="ad-order-select"
            >
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="Төлөв">
            <select
              value={filters.orderStatus}
              onChange={(e) => set('orderStatus', e.target.value)}
              className="ad-order-select"
            >
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </FilterField>

          <FilterField label="&nbsp;">
            <button type="button" onClick={onClear} className="ad-order-clear">
              <X className="size-3.5" />
              Цэвэрлэх
            </button>
          </FilterField>
        </div>
      </form>
    </div>
  );
}

export { EMPTY_FILTERS };
