'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { listStoredOrders, ORDER_STATUS_LABELS, type AdOrder, type OrderStatus } from '@/lib/ad/orders';
import { formatPrice } from '@/lib/cart';
import {
  DEFAULT_EXPORT_FIELDS,
  EXPORT_FIELDS,
  OTHER_EXPORT_FIELDS,
  PRODUCT_EXPORT_FIELDS,
  buildOrdersCsv,
  dateRangeTooLong,
  downloadCsv,
  exportFilename,
  todayIsoDate,
  type ExportFieldKey,
} from '@/lib/ad/order-export';

const ALL_EXPORT_FIELDS = EXPORT_FIELDS.map((f) => f.key);
const PAGE_SIZE = 50;
const STATUSES: Array<[OrderStatus, string]> = [
  ['pending_payment', ORDER_STATUS_LABELS.pending_payment],
  ['success', ORDER_STATUS_LABELS.success],
  ['returned', ORDER_STATUS_LABELS.returned],
];
const miniBtn =
  'inline-flex h-7 items-center rounded border border-[#dee2e6] bg-white px-3 text-xs font-medium text-[#0d6efd] hover:bg-[#f8f9fa]';
const selectClass =
  'h-9 w-full rounded-md border border-input bg-white px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

export default function AdOrderToolsPage() {
  const today = todayIsoDate();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [status, setStatus] = useState('');
  const [paid, setPaid] = useState('');
  const [fields, setFields] = useState<ExportFieldKey[]>(DEFAULT_EXPORT_FIELDS);
  const [expandProducts, setExpandProducts] = useState(false);
  const [exportOpen, setExportOpen] = useState(true);
  const [orders, setOrders] = useState<AdOrder[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setOrders(listStoredOrders().filter((o) => !o.deletedAt));
  }, []);

  const tooLong = dateRangeTooLong(startDate, endDate);
  const startAfterEnd = !!startDate && !!endDate && startDate > endDate;
  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const rows = useMemo(
    () => orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [orders, page],
  );

  function toggleField(key: ExportFieldKey) {
    setFields((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  function download() {
    if (tooLong || startAfterEnd || !fields.length) return;
    const csv = buildOrdersCsv({ startDate, endDate, status, paid, fields, expandProducts, orders });
    downloadCsv(csv, exportFilename());
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 text-foreground">
      <h1 className="text-2xl font-bold tracking-tight">Захиалгын масс экспорт</h1>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
        <p className="text-sm">
          <span className="font-semibold text-primary">Нийт захиалга:</span>{' '}
          {orders.length.toLocaleString('mn-MN')}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex h-auto items-center gap-1.5 rounded border border-[#dee2e6] bg-white px-3 text-xs font-medium text-[#333] hover:bg-[#f8f9fa]"
        >
          <i className="icon-refresh" aria-hidden />
          Шинэчлэх
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <button
          type="button"
          onClick={() => setExportOpen((v) => !v)}
          className="flex w-full items-center justify-between bg-muted/50 px-5 py-4 text-left text-sm font-semibold hover:bg-muted"
        >
          <span>Экспорт хийх</span>
          {exportOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>

        {exportOpen ? (
          <div className="space-y-5 border-t border-border p-5">
            <div className="rounded-md border border-[#b3d9ff] bg-[#e7f3ff] px-4 py-3 text-sm text-[#004085]">
              <strong>Экспорт хийх:</strong>
              <p className="mt-2 mb-0">
                Доорх талбаруудаас хүссэн талбаруудаа сонгоод, хугацааны интервал сонгоод <strong>&quot;CSV файл татах&quot;</strong> товчийг дарна уу.
              </p>
            </div>

            <div className="rounded-md border border-[#dee2e6] bg-[#f8f9fa] p-4">
              <p className="mb-3 text-[15px] font-semibold">Шүүлт</p>
              <div className="mb-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Эхлэх огноо:</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={selectClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Дуусах огноо:</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={selectClass} />
                </div>
              </div>
              {startAfterEnd || tooLong ? (
                <p className="mb-4 rounded-md border border-[#ffc107] bg-[#fff3cd] px-3 py-2 text-xs text-[#856404]">
                  {startAfterEnd
                    ? 'Эхлэх огноо нь дуусах огнооноос өмнө байх ёстой.'
                    : 'Эхлэх болон дуусах огнооны хооронд хамгийн ихдээ 3 сар (90 хоног) байх ёстой.'}
                </p>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Төлөв:</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
                    <option value="">Бүгд</option>
                    {STATUSES.map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold">Төлбөр:</label>
                  <select value={paid} onChange={(e) => setPaid(e.target.value)} className={selectClass}>
                    <option value="">Бүгд</option>
                    <option value="1">Төлсөн</option>
                    <option value="0">Төлөөгүй</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setFields(ALL_EXPORT_FIELDS)} className={miniBtn}>Бүгдийг сонгох</button>
              <button type="button" onClick={() => setFields([])} className={miniBtn}>Бүгдийг цэвэрлэх</button>
              <button type="button" onClick={() => setFields(DEFAULT_EXPORT_FIELDS)} className={miniBtn}>Анхны утга</button>
            </div>

            <div className="rounded-md border border-[#dee2e6] bg-[#f8f9fa] p-4">
              <p className="mb-2.5 text-[15px] font-semibold">Бусад талбарууд</p>
              <div className="grid max-h-[300px] grid-cols-1 gap-1 overflow-y-auto rounded-md border border-[#e0e0e0] bg-white p-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {OTHER_EXPORT_FIELDS.map((field) => (
                  <label key={field.key} className="flex cursor-pointer items-center gap-2 rounded-[3px] px-1.5 py-1 text-[13px] hover:bg-[#f5f5f5]">
                    <input type="checkbox" checked={fields.includes(field.key)} onChange={() => toggleField(field.key)} className="size-3.5 shrink-0 accent-[#007bff]" />
                    <span>{field.label}</span>
                    {field.default ? <small className="text-[#6c757d]">(Анхны)</small> : null}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-[#b3d9ff] bg-[#e7f3ff] p-4">
              <p className="mb-2.5 text-[15px] font-semibold text-[#004085]">Бүтээгдэхүний талбарууд</p>
              <div className="mb-4 rounded-md border border-[#ffc107] bg-[#fff3cd] p-3">
                <label className="flex cursor-pointer items-center gap-2 text-[13px]">
                  <input type="checkbox" checked={expandProducts} onChange={(e) => setExpandProducts(e.target.checked)} className="size-3.5 accent-[#007bff]" />
                  <strong>Бүтээгдэхүний жагсаалтыг мөр мөрөөр салгах</strong>
                </label>
                <small className="mt-1 ml-6 block text-[#6c757d]">
                  Сонговол захиалга бүр дээрх бүтээгдэхүн бүр нь тусдаа мөр болно. Хэрэглэгчийн мэдээлэл зөвхөн эхний мөр дээр байна (Excel дээр илүү тохиромжтой)
                </small>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {PRODUCT_EXPORT_FIELDS.map((key) => {
                  const field = EXPORT_FIELDS.find((f) => f.key === key);
                  return (
                    <label key={key} className="flex min-w-[180px] cursor-pointer items-center gap-2 rounded-md border border-[#b3d9ff] bg-white px-3 py-2 text-[13px]">
                      <input type="checkbox" checked={fields.includes(key)} onChange={() => toggleField(key)} className="size-3.5 accent-[#007bff]" />
                      <span>{field?.label}</span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <button type="button" onClick={() => setFields((prev) => Array.from(new Set([...prev, ...PRODUCT_EXPORT_FIELDS])))} className={miniBtn}>
                  Бүтээгдэхүнийг бүгдийг сонгох
                </button>
                <button type="button" onClick={() => setFields((prev) => prev.filter((k) => !PRODUCT_EXPORT_FIELDS.includes(k)))} className={miniBtn}>
                  Бүтээгдэхүнийг бүгдийг цэвэрлэх
                </button>
              </div>
            </div>

            <button
              type="button"
              disabled={tooLong || startAfterEnd || fields.length === 0}
              onClick={download}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-[15px] font-semibold text-white disabled:opacity-50"
            >
              <i className="icon-cloud-download" aria-hidden />
              CSV файл татах
            </button>

            <div className="rounded-md border border-[#ffc107] bg-[#fff3cd] px-4 py-3 text-sm text-[#856404]">
              <strong>Excel дээр зөв нээх заавар:</strong>
              <ol className="mt-2 mb-0 list-decimal pl-5">
                <li>
                  <strong>Google Drive ашиглах (Хамгийн найдвартай):</strong>
                  <ul className="mt-1 list-disc pl-5">
                    <li>Татаж авсан CSV файлыг <strong>Google Drive</strong> руу хуулах</li>
                    <li>Google Drive дээр файлыг Open with → Google sheets ээр нээнэ</li>
                    <li><strong>File</strong> → <strong>Download</strong> → <strong>Microsoft Excel (.xlsx)</strong> сонгох</li>
                    <li>Энэ арга нь монгол кирилл үсгийг алдаагүй хадгална</li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="border-b border-border bg-muted/50 px-4 py-3 text-sm font-semibold">Захиалгын жагсаалт</div>
        <div className="max-h-[600px] overflow-auto">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr>
                {['ID', 'Огноо', 'Нэр', 'Овог', 'Имэйл', 'Утас', 'Дүн', 'Төлөв', 'Төлбөр'].map((h) => (
                  <th key={h} className="whitespace-nowrap border-b border-border px-3 py-2.5 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 odd:bg-white even:bg-slate-50/80 hover:bg-slate-100">
                  <td className="whitespace-nowrap px-3 py-2 font-mono">{order.id}</td>
                  <td className="whitespace-nowrap px-3 py-2">{order.date.slice(0, 16)}</td>
                  <td className="whitespace-nowrap px-3 py-2">{order.firstName || order.customerName}</td>
                  <td className="whitespace-nowrap px-3 py-2">{order.lastName || ''}</td>
                  <td className="whitespace-nowrap px-3 py-2">{order.email || ''}</td>
                  <td className="whitespace-nowrap px-3 py-2">{order.phone}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-semibold">{formatPrice(order.total)}</td>
                  <td className="whitespace-nowrap px-3 py-2">{ORDER_STATUS_LABELS[order.status]}</td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <span className={`inline-flex rounded px-2 py-0.5 text-[11px] font-semibold ${order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {order.paymentStatus === 'paid' ? 'Төлсөн' : 'Төлөөгүй'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 ? (
          <div className="flex flex-wrap gap-1 border-t border-border p-3">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`h-8 min-w-8 rounded-md px-2 text-xs font-semibold ${n === page ? 'bg-primary text-primary-foreground' : 'border border-border bg-white'}`}
              >
                {n}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
