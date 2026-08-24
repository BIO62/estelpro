'use client';

import { useEffect, useRef } from 'react';

type Validatable = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function messageFor(el: Validatable): string {
  const v = el.validity;
  if (v.valueMissing) return 'Энэ талбарыг бөглөнө үү.';
  const custom = el.getAttribute('data-validation-message');
  if (custom) return custom;
  if (v.typeMismatch) {
    if (el instanceof HTMLInputElement && el.type === 'email') return 'Имэйл хаягаа зөв оруулна уу.';
    return 'Оруулсан утга буруу байна.';
  }
  if (v.tooShort && el instanceof HTMLInputElement) return `Хамгийн багадаа ${el.minLength} тэмдэгт байх ёстой.`;
  if (v.tooLong && el instanceof HTMLInputElement) return `Хамгийн ихдээ ${el.maxLength} тэмдэгт байна.`;
  if (v.patternMismatch) return 'Оруулсан утга шаардлага хангахгүй байна.';
  if (v.rangeOverflow || v.rangeUnderflow || v.stepMismatch || v.badInput) return 'Оруулсан утга буруу байна.';
  return '';
}

// The browser's native bubbles are English only, so each field gets a Mongolian
// message right before the tooltip renders. `invalid` never bubbles, so the
// listeners run in the capture phase.
export function useLocalizedValidation<T extends HTMLElement = HTMLFormElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const onInvalid = (event: Event) => {
      const el = event.target as Validatable;
      if (typeof el.setCustomValidity !== 'function') return;
      el.setCustomValidity(messageFor(el));
    };
    const onInput = (event: Event) => {
      const el = event.target as Validatable;
      if (typeof el.setCustomValidity !== 'function') return;
      el.setCustomValidity('');
    };

    root.addEventListener('invalid', onInvalid, true);
    root.addEventListener('input', onInput, true);
    return () => {
      root.removeEventListener('invalid', onInvalid, true);
      root.removeEventListener('input', onInput, true);
    };
  }, []);

  return ref;
}
