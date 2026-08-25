'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ThreeParticlesSection } from '@/components/ui/ThreeParticlesSection';

export default function AuthSplit({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-scope relative flex min-h-svh items-center justify-center overflow-hidden px-4 py-10">
      {/* 1. LAYER 1: Background Image (-z-20) */}
      <Image
        src="/brand/auth-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />

      {/* 2. LAYER 2: 3D Mouse-Tracking Particles Effect (Between Background and Glass Card) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <ThreeParticlesSection
          theme="light"
          ringWidth={0.006}
          ringWidth2={0.107}
          ringDisplacement={0.62}
          density={240}
          particlesScale={0.62}
          interactive={true}
          className="w-full h-full"
        />
      </div>

      {/* feTurbulence + feDisplacementMap bend the backdrop along the card edge */}
      <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
        <filter id="liquid-glass-distortion" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="softNoise" />
          <feDisplacementMap in="SourceGraphic" in2="softNoise" scale="28" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* 3. LAYER 3: Glass Card (relative z-10) */}
      <div className="liquid-glass relative z-10 w-full max-w-md rounded-[40px] px-6 py-8 sm:px-9">
        <span aria-hidden className="liquid-glass__refraction" />
        <div className="relative z-10 flex flex-col gap-7">
          <div className="flex justify-center">
            <Link href="/" className="inline-flex items-center no-underline">
              <Image
                src="/brand/logo.png"
                alt="ESTEL"
                width={140}
                height={40}
                priority
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
