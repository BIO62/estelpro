'use client';

import { type ReactNode, useLayoutEffect, useRef } from 'react';

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

      items.forEach((el) => {
        const wide = cols > 2 && (el.classList.contains('ga-plp-item--l') || el.classList.contains('ga-plp-item--h'));
        const span = wide ? 2 : 1;
        el.style.position = 'absolute';
        el.style.width = `${span * colW + (span - 1) * colGap}px`;
        el.style.margin = '0';

        let bestCol = 0;
        let bestY = Number.POSITIVE_INFINITY;
        for (let col = 0; col <= cols - span; col += 1) {
          const y = Math.max(...heights.slice(col, col + span));
          if (y < bestY) {
            bestY = y;
            bestCol = col;
          }
        }

        el.style.left = `${bestCol * (colW + colGap)}px`;
        el.style.top = `${bestY}px`;
        const next = bestY + el.offsetHeight + rowGap;
        for (let col = bestCol; col < bestCol + span; col += 1) {
          heights[col] = next;
        }
      });

      root.style.height = `${Math.max(0, ...heights) - rowGap}px`;
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        layout();
      });
    };

    const observer = new ResizeObserver(schedule);
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
