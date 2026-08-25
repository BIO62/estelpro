'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

import {
  ORDER_STATUS_CHANGE_OPTIONS,
  STATUS_TO_VALUE,
  VALUE_TO_STATUS,
  type AdOrder,
  type OrderStatus,
} from '@/lib/ad/orders';
import { cn } from '@/lib/utils';

type AdOrderStatusModalProps = {
  open: boolean;
  order: AdOrder;
  onClose: () => void;
  onSave?: (status: OrderStatus) => void;
};

export function AdOrderStatusModal({ open, order, onClose, onSave }: AdOrderStatusModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState(STATUS_TO_VALUE[order.status]);
  const [emailNotify, setEmailNotify] = useState(false);
  const [smsNotify, setSmsNotify] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setSelected(STATUS_TO_VALUE[order.status]);
      setEmailNotify(false);
      setSmsNotify(false);
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, [open, order.status]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  const handleSave = () => {
    const next = VALUE_TO_STATUS[selected];
    if (next) onSave?.(next);
    onClose();
  };

  const dialog = (
    <div
      className={cn('admin-scope ad-modal-overlay', isDark && 'dark')}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="ad-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ad-status-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ad-modal__header">
          <h4 id="ad-status-modal-title">Статус өөрчлөх</h4>
          <button type="button" className="ad-modal__close" onClick={onClose} aria-label="Хаах">
            <X className="size-4" />
          </button>
        </div>
        <div className="ad-modal__body">
          <div className="ad-modal-radios">
            {ORDER_STATUS_CHANGE_OPTIONS.map((opt) => (
              <label key={opt.value} className="ad-modal-radio">
                <input
                  type="radio"
                  name={`order-status-${order.id}`}
                  value={opt.value}
                  checked={selected === opt.value}
                  onChange={() => setSelected(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>

          <label className="ad-modal-check">
            <input type="checkbox" checked={emailNotify} onChange={(e) => setEmailNotify(e.target.checked)} />
            И-Мэйл сонордуулга илгээх
          </label>
          {emailNotify && (
            <textarea
              className="ad-order-textarea"
              rows={3}
              defaultValue={`Сайн байна уу, Таны #${order.id} дугаартай захиалга %order_status% төлөвт орлоо. Биднийг сонгож үйлчлүүлсэнд танд баярлалаа.`}
            />
          )}

          <label className="ad-modal-check">
            <input type="checkbox" checked={smsNotify} onChange={(e) => setSmsNotify(e.target.checked)} />
            SMS сонордуулга илгээх
          </label>
          <p className="ad-modal-hint">8:00 - 20:00 цагийн хооронд явах боломжтой.</p>
          {smsNotify && (
            <textarea
              className="ad-order-textarea"
              rows={3}
              defaultValue={`Sain bnu, Tanii #${order.id} dugaartai zahialgiin tuluv uurchlugdluu. Ta zahialgiin yavtsaiig %tracking_link% hayagaar orj uzne uu.`}
            />
          )}
        </div>
        <div className="ad-modal__footer">
          <button type="button" className="ad-order-btn ad-order-btn--default" onClick={onClose}>
            Хаах
          </button>
          <button type="button" className="ad-order-btn ad-order-btn--success" onClick={handleSave}>
            Хадгалах
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
