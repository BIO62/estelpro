'use client';

import { useEffect, useRef, useState } from 'react';

export function useSwiperControls() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const pagRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return { prevRef, nextRef, pagRef, ready };
}
