'use client';

import { useEffect, useRef, useState } from 'react';

export function useSwiperControls() {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const pagRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return { prevRef, nextRef, pagRef, ready };
}
