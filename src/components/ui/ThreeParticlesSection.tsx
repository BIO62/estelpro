'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ParticleProps {
  theme?: 'dark' | 'light';
  ringWidth?: number;
  ringWidth2?: number;
  ringDisplacement?: number;
  density?: number;
  particlesScale?: number;
  className?: string;
}

export function ThreeParticlesSection({
  theme = 'dark',
  ringWidth = 0.15,
  ringWidth2 = 0.05,
  ringDisplacement = 0.23,
  density = 220,
  particlesScale = 0.65,
  className = '',
}: ParticleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 850;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Generate Particle Geometry (Double Ring / Torus with Displacement)
    const particleCount = Math.floor(density * 180); // e.g. ~39,600 particles
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const originalPositions = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);

    const baseRadius1 = 4.8;
    const baseRadius2 = 3.2;

    const color1 = new THREE.Color(theme === 'dark' ? '#38bdf8' : '#0284c7'); // Cyan/Blue
    const color2 = new THREE.Color(theme === 'dark' ? '#a855f7' : '#7c3aed'); // Purple
    const color3 = new THREE.Color(theme === 'dark' ? '#f8fafc' : '#0f172a'); // Core Glow/White

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const isOuter = Math.random() > 0.35;
      const baseRadius = isOuter ? baseRadius1 : baseRadius2;
      const currentWidth = isOuter ? ringWidth : ringWidth2;

      // Angular position
      const angle = Math.random() * Math.PI * 2;
      const rOffset = (Math.random() - 0.5) * currentWidth * 8;
      const r = baseRadius + rOffset;

      // Cross-sectional angle for 3D thickness
      const crossAngle = Math.random() * Math.PI * 2;
      const thickness = (Math.random() - 0.5) * ringDisplacement * 6;

      const x = Math.cos(angle) * r + Math.cos(crossAngle) * (currentWidth * 2);
      const y = Math.sin(angle) * r + Math.sin(crossAngle) * (currentWidth * 2);
      const z = thickness + (Math.random() - 0.5) * 1.8;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      phases[i] = Math.random() * Math.PI * 2;
      scales[i] = (Math.random() * 0.7 + 0.3) * particlesScale;

      // Gradient color interpolation across angle & radius
      const mixRatio = Math.sin(angle * 2) * 0.5 + 0.5;
      const vertexColor = new THREE.Color();
      if (Math.random() > 0.88) {
        vertexColor.copy(color3); // Sparkle star particle
      } else {
        vertexColor.lerpColors(color1, color2, mixRatio);
      }

      colors[i3] = vertexColor.r;
      colors[i3 + 1] = vertexColor.g;
      colors[i3 + 2] = vertexColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

    // Custom Particle Texture (Circular smooth glow sprite)
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createParticleTexture();

    const material = new THREE.PointsMaterial({
      size: 0.12 * particlesScale,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: theme === 'dark' ? 0.85 : 0.7,
      blending: theme === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Initial slight rotation tilt
    particles.rotation.x = 0.55;
    particles.rotation.y = 0.2;

    // 3. Mouse Interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.4;
      mouseRef.current.targetY = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 4. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 5. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Group rotation
      particles.rotation.z = elapsedTime * 0.08;
      particles.rotation.x = 0.55 + mouseRef.current.y * 0.35;
      particles.rotation.y = 0.2 + mouseRef.current.x * 0.35;

      // Dynamic harmonic wave displacement along z & radius
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const ox = originalPositions[i3];
        const oy = originalPositions[i3 + 1];
        const oz = originalPositions[i3 + 2];
        const phase = phases[i];

        const wave = Math.sin(elapsedTime * 1.5 + phase) * ringDisplacement * 0.6;
        const wave2 = Math.cos(elapsedTime * 2.0 + ox * 0.5) * 0.15;

        posArray[i3] = ox + wave2 * (ox / 5);
        posArray[i3 + 1] = oy + wave2 * (oy / 5);
        posArray[i3 + 2] = oz + wave;
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, [theme, ringWidth, ringWidth2, ringDisplacement, density, particlesScale]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      data-main-particles-component=""
      data-theme={theme}
      data-ring-width={ringWidth}
      data-ring-width2={ringWidth2}
      data-ring-displacement={ringDisplacement}
      data-density={density}
      data-particles-scale={particlesScale}
    />
  );
}
