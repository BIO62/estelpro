'use client';

import { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

function AdPageTransitionInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const pageKey = query ? `${pathname}?${query}` : pathname;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pageKey}
        initial={{ opacity: 1, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-0 flex-1 bg-background"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function AdPageTransition({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-0 flex-1">{children}</div>}>
      <AdPageTransitionInner>{children}</AdPageTransitionInner>
    </Suspense>
  );
}
