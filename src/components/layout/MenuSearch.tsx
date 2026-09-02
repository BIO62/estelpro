'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { assetUrl } from '@/lib/constants';

type SearchHit = {
  id: string;
  name: string;
  image: string;
  price: string;
  brand?: string | null;
};

type SearchCtx = {
  q: string;
  setQ: (value: string) => void;
  hits: SearchHit[];
  total: number;
  loading: boolean;
  active: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  go: (href: string) => void;
  onSubmit: (event: FormEvent) => void;
};

const MenuSearchContext = createContext<SearchCtx | null>(null);

function closeMainMenu() {
  const el = document.getElementById('mainMenuCanvas');
  if (!el) return;
  document.querySelectorAll('.navigationLevelOne.active, .navigationLevelTwo.active').forEach((node) => {
    node.classList.remove('active');
  });
  const Offcanvas = (
    window as Window & {
      bootstrap?: { Offcanvas?: { getOrCreateInstance: (node: Element) => { hide: () => void } } };
    }
  ).bootstrap?.Offcanvas;
  if (Offcanvas) {
    Offcanvas.getOrCreateInstance(el).hide();
    return;
  }
  el.classList.remove('show');
  document.querySelector('.offcanvas-backdrop')?.remove();
  document.body.classList.remove('offcanvas-open');
  document.body.style.removeProperty('overflow');
}

function useMenuSearch() {
  const ctx = useContext(MenuSearchContext);
  if (!ctx) throw new Error('MenuSearch used outside provider');
  return ctx;
}

export function MenuSearchRoot({ children }: { children: ReactNode }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const trimmed = q.trim();
  const active = trimmed.length >= 2;

  useEffect(() => {
    const canvas = document.getElementById('mainMenuCanvas');
    if (!canvas) return;
    const onShown = (event: Event) => {
      const related = (event as Event & { relatedTarget?: HTMLElement | null }).relatedTarget;
      if (related?.closest?.('[data-search-open]')) {
        inputRef.current?.focus();
      }
    };
    const onHidden = () => {
      setQ('');
      setHits([]);
      setTotal(0);
      setLoading(false);
    };
    canvas.addEventListener('shown.bs.offcanvas', onShown);
    canvas.addEventListener('hidden.bs.offcanvas', onHidden);
    return () => {
      canvas.removeEventListener('shown.bs.offcanvas', onShown);
      canvas.removeEventListener('hidden.bs.offcanvas', onHidden);
    };
  }, []);

  useEffect(() => {
    if (!active) {
      setHits([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    const ctrl = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: ctrl.signal });
        const data = (await res.json()) as { items?: SearchHit[]; total?: number };
        if (ctrl.signal.aborted) return;
        setHits(Array.isArray(data.items) ? data.items : []);
        setTotal(typeof data.total === 'number' ? data.total : 0);
      } catch {
        if (!ctrl.signal.aborted) {
          setHits([]);
          setTotal(0);
        }
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 180);
    return () => {
      ctrl.abort();
      window.clearTimeout(timer);
    };
  }, [active, trimmed]);

  const value = useMemo<SearchCtx>(() => {
    function go(href: string) {
      closeMainMenu();
      setQ('');
      setHits([]);
      router.push(href);
    }
    function onSubmit(event: FormEvent) {
      event.preventDefault();
      if (!trimmed) return;
      if (hits.length === 1) {
        go(`/products/${encodeURIComponent(hits[0].id)}`);
        return;
      }
      go(`/list?q=${encodeURIComponent(trimmed)}`);
    }
    return { q, setQ, hits, total, loading, active, inputRef, go, onSubmit };
  }, [q, hits, total, loading, active, router, trimmed]);

  return <MenuSearchContext.Provider value={value}>{children}</MenuSearchContext.Provider>;
}

export function MenuSearchField() {
  const { q, setQ, inputRef, onSubmit, active } = useMenuSearch();
  return (
    <form className="d-flex border align-items-center rounded-3 flex-grow-1" onSubmit={onSubmit}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={assetUrl('images/icons/search.svg')} alt="" className="w-20 h-20 ms-3" />
      <input
        ref={inputRef}
        id="menuSearchInput"
        type="search"
        value={q}
        onChange={(event) => setQ(event.target.value)}
        className="form-control border-0 flex-grow-1 shadow-none fs-14 p-3"
        placeholder="Хайх..."
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return;
          event.preventDefault();
          onSubmit(event);
        }}
      />
    </form>
  );
}

export function MenuSearchPanel({ children }: { children: ReactNode }) {
  const { q, active, loading, hits, total, go } = useMenuSearch();
  if (!active) return children;
  return (
    <div className="menu-search-results d-flex flex-column flex-grow-1 overflow-auto">
      {loading && hits.length === 0 ? (
        <div className="px-3 py-3 fs-13 fc-secondary">Хайж байна...</div>
      ) : null}
      {!loading && hits.length === 0 ? (
        <div className="px-3 py-3 fs-13 fc-secondary">Илэрц олдсонгүй</div>
      ) : null}
      {hits.map((hit) => (
        <button
          key={hit.id}
          type="button"
          className="menu-search-hit btn w-100 text-start d-flex align-items-center gap-3 px-0 py-2 border-0 rounded-0"
          onClick={() => go(`/products/${encodeURIComponent(hit.id)}`)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetUrl(hit.image)} alt="" className="menu-search-hit__img" />
          <span className="flex-grow-1 overflow-hidden">
            <span className="d-block fs-13 fw-semibold text-truncate fc-dark">{hit.name}</span>
            {hit.brand ? <span className="d-block fs-11 fc-secondary text-truncate">{hit.brand}</span> : null}
          </span>
          <span className="fs-13 fw-semibold flex-shrink-0">{hit.price}</span>
        </button>
      ))}
      {hits.length > 0 ? (
        <button
          type="button"
          className="btn w-100 text-start px-0 py-3 fs-13 fc-main border-0 rounded-0"
          onClick={() => go(`/list?q=${encodeURIComponent(q.trim())}`)}
        >
          Бүгдийг харах{total > hits.length ? ` (${total})` : ''}
        </button>
      ) : null}
    </div>
  );
}
