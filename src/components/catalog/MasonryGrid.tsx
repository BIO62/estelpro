'use client';

import { type ReactNode, useLayoutEffect, useRef } from 'react';

const DESKTOP_SLOTS = [
  { col: 0, span: 1 },
  { col: 1, span: 1 },
  { col: 2, span: 2 },
  { col: 0, span: 2 },
  { col: 2, span: 1 },
  { col: 3, span: 1 },
];

export default function MasonryGrid({
  children,
  className = '',
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    let frame = 0;

    const layout = () => {
      const styles = getComputedStyle(root);
      const cols = Math.max(1, Number.parseInt(styles.getPropertyValue('--column-count'), 10) || 4);
      const rowGap = Number.parseFloat(styles.getPropertyValue('--row-gap')) || 12;
      const colGap = Number.parseFloat(styles.getPropertyValue('--column-gap')) || 16;
      const items = Array.from(root.children) as HTMLElement[];
      const colW = (root.clientWidth - colGap * (cols - 1)) / cols;
      const heights = Array.from({ length: cols }, () => 0);

      items.forEach((el, index) => {
        const desktop = cols > 2;
        const slot = desktop ? DESKTOP_SLOTS[index % DESKTOP_SLOTS.length] : { col: index % cols, span: 1 };
        const span = Math.min(slot.span, cols);
        const col = Math.min(slot.col, cols - span);
        el.style.position = 'absolute';
        el.style.width = `${span * colW + (span - 1) * colGap}px`;
        el.style.margin = '0';

        const y = Math.max(...heights.slice(col, col + span));
        el.style.left = `${col * (colW + colGap)}px`;
        el.style.top = `${y}px`;
        const next = y + el.offsetHeight + rowGap;
        for (let c = col; c < col + span; c += 1) {
          heights[c] = next;
        }
      });

      const maxH = Math.max(0, ...heights);
      root.style.height = `${maxH > 0 ? maxH - rowGap : 0}px`;
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        layout();
      });
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    Array.from(root.children).forEach((el) => observer.observe(el));
    window.addEventListener('resize', schedule);

    const images = Array.from(root.querySelectorAll('img'));
    images.forEach((img) => {
      if (img.complete) return;
      img.addEventListener('load', schedule);
      img.addEventListener('error', schedule);
    });

    layout();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      images.forEach((img) => {
        img.removeEventListener('load', schedule);
        img.removeEventListener('error', schedule);
      });
    };
  }, [children]);

  return (
    <div ref={ref} id={id} className={className}>
      {children}
    </div>
  );
}
