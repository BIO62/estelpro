'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ParticleProps {
  theme?: 'dark' | 'light';
  ringWidth?: number;
  ringWidth2?: number;
  ringDisplacement?: number;
  density?: number;
  particlesScale?: number;
  interactive?: boolean;
  className?: string;
}

// Simplex Noise 3D GLSL implementation (Google Antigravity standard)
const noiseGLSL = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

  i = mod(i, 289.0);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}
`;

export function ThreeParticlesSection({
  theme = 'light',
  ringWidth = 0.006,
  ringWidth2 = 0.107,
  ringDisplacement = 0.62,
  density = 230,
  particlesScale = 0.59,
  interactive = true,
  className = '',
}: ParticleProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Setup Scene & Canvas
    const scene = new THREE.Scene();
    const width = container.offsetWidth || window.innerWidth;
    const height = container.offsetHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 3.1;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'highp',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Generate Grid of Points with Poisson / Jittered Distribution
    const gridSize = Math.floor(Math.min(300, density * 1.3));
    const step = 2.4 / gridSize;
    const positions: number[] = [];
    const seeds: number[] = [];

    for (let x = -1.2; x <= 1.2; x += step) {
      for (let y = -1.2; y <= 1.2; y += step) {
        const jitterX = (Math.random() - 0.5) * step * 0.9;
        const jitterY = (Math.random() - 0.5) * step * 0.9;
        positions.push(x + jitterX, y + jitterY, 0);
        seeds.push(Math.random(), Math.random(), Math.random(), Math.random());
      }
    }

    const count = positions.length / 3;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('seeds', new THREE.Float32BufferAttribute(seeds, 4));

    // Colors matching Google Antigravity:
    // Light: Google Blue #2c64ed, Google Red #f84242, Google Yellow #ffcf03
    // Dark: Vibrant Blue #7189ff, Cyan #3074f9, Purple/Dark #a855f7
    const color1 = new THREE.Color(theme === 'dark' ? '#7189ff' : '#2c64ed');
    const color2 = new THREE.Color(theme === 'dark' ? '#3074f9' : '#f84242');
    const color3 = new THREE.Color(theme === 'dark' ? '#a855f7' : '#ffcf03');

    // 3. Custom GLSL Shader Material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uRingPos: { value: new THREE.Vector2(0, 0) },
        uRingRadius: { value: 0.2 },
        uRingWidth: { value: ringWidth },
        uRingWidth2: { value: ringWidth2 },
        uRingDisplacement: { value: ringDisplacement },
        uParticleScale: { value: particlesScale },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uColor1: { value: color1 },
        uColor2: { value: color2 },
        uColor3: { value: color3 },
        uAlpha: { value: 1.0 },
        uRez: { value: new THREE.Vector2(width, height) },
        uColorScheme: { value: theme === 'dark' ? 0 : 1 },
      },
      vertexShader: `
        precision highp float;
        attribute vec4 seeds;

        uniform float uTime;
        uniform vec2 uRingPos;
        uniform float uRingRadius;
        uniform float uRingWidth;
        uniform float uRingWidth2;
        uniform float uRingDisplacement;
        uniform float uParticleScale;
        uniform float uPixelRatio;

        varying vec4 vSeeds;
        varying float vScale;
        varying vec2 vLocalPos;
        varying float vVelocity;

        ${noiseGLSL}

        void main() {
          vSeeds = seeds;
          vec2 refPos = position.xy;
          float time = uTime * 0.5;

          float dist = distance(refPos, uRingPos);
          float noise0 = snoise(vec3(refPos * 0.2 + vec2(18.4924, 72.9744), time * 0.5));
          float dist1 = distance(refPos + (noise0 * 0.005), uRingPos);

          float t = smoothstep(uRingRadius - (uRingWidth * 2.0), uRingRadius, dist) - smoothstep(uRingRadius, uRingRadius + uRingWidth, dist1);
          float t2 = smoothstep(uRingRadius - (uRingWidth2 * 2.0), uRingRadius, dist) - smoothstep(uRingRadius, uRingRadius + uRingWidth2, dist1);
          float t3 = smoothstep(uRingRadius + uRingWidth2, uRingRadius, dist);

          t = pow(t, 2.0);
          t2 = pow(t2, 3.0);
          t += t2 * 3.0;
          t += t3 * 0.4;
          t += snoise(vec3(refPos * 30.0 + vec2(11.4924, 12.9744), time * 0.5)) * t3 * 0.5;

          float nS = snoise(vec3(refPos * 2.0 + vec2(18.4924, 72.9744), time * 0.5));
          t += pow((nS + 1.5) * 0.5, 2.0) * 0.6;

          float noise1 = snoise(vec3(refPos * 4.0 + vec2(88.494, 32.4397), time * 0.35));
          float noise2 = snoise(vec3(refPos * 4.0 + vec2(50.904, 120.947), time * 0.35));
          float noise3 = snoise(vec3(refPos * 20.0 + vec2(18.4924, 72.9744), time * 0.5));
          float noise4 = snoise(vec3(refPos * 20.0 + vec2(50.904, 120.947), time * 0.5));

          vec2 disp = vec2(noise1, noise2) * 0.03 + vec2(noise3, noise4) * 0.005;
          disp.x += sin((refPos.x * 20.0) + (time * 4.0)) * 0.02 * clamp(dist, 0.0, 1.0);
          disp.y += cos((refPos.y * 20.0) + (time * 3.0)) * 0.02 * clamp(dist, 0.0, 1.0);

          vec2 pushed = refPos + disp - (uRingPos - (refPos + disp)) * pow(t2, 0.75) * uRingDisplacement;
          vLocalPos = pushed;
          vScale = t;
          vVelocity = t2;

          vec4 viewSpace = modelViewMatrix * vec4(vec3(pushed, 0.0), 1.0);
          gl_Position = projectionMatrix * viewSpace;
          gl_PointSize = max(1.5, (vScale * 7.5) * (uPixelRatio * 0.5) * uParticleScale);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec4 vSeeds;
        varying float vScale;
        varying vec2 vLocalPos;
        varying float vVelocity;

        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec2 uRingPos;
        uniform float uTime;
        uniform float uAlpha;
        uniform int uColorScheme;

        ${noiseGLSL}

        // Rotate point coordinate by angle
        vec2 rotate(vec2 v, float a) {
          float s = sin(a);
          float c = cos(a);
          return mat2(c, s, -s, c) * v;
        }

        // Signed Distance Function for Rounded Box/Capsule (Google Antigravity style)
        float sdRoundBox(in vec2 p, in vec2 b, in float r) {
          vec2 q = abs(p) - b + r;
          return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
        }

        void main() {
          float noiseAngle = snoise(vec3(vLocalPos * 10.0 + vec2(18.4924, 72.9744), uTime * 0.85));
          float noiseColor = snoise(vec3(vLocalPos * 2.0 + vec2(74.664, 91.556), uTime * 0.5));
          noiseColor = (noiseColor + 1.0) * 0.5;

          float angle = atan(vLocalPos.y - uRingPos.y, vLocalPos.x - uRingPos.x);
          vec2 uv = gl_PointCoord.xy - vec2(0.5);
          uv.y *= -1.0;
          uv = rotate(uv, -angle + (noiseAngle * 0.5));

          float h = 0.8;
          float progress = smoothstep(0.0, 0.75, pow(noiseColor, 2.0));
          vec3 color = mix(mix(uColor1, uColor2, progress / h), mix(uColor2, uColor3, (progress - h) / (1.0 - h)), step(h, progress));

          // Capsule particle shape
          float rounded = sdRoundBox(uv, vec2(0.35, 0.12), 0.1);
          rounded = smoothstep(0.1, 0.0, rounded);

          float a = uAlpha * rounded * smoothstep(0.08, 0.22, vScale);
          if (a < 0.01) discard;

          color = clamp(color, 0.0, 1.0);
          gl_FragColor = vec4(color, clamp(a, 0.0, 1.0));
        }
      `,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const mesh = new THREE.Points(geometry, material);
    mesh.scale.set(5, 5, 5);
    scene.add(mesh);

    // 4. Mouse Raycast Plane & Inertia Interaction
    const raycastPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(12.5, 12.5),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    scene.add(raycastPlane);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const ringPos = new THREE.Vector2(0, 0);
    const targetRingPos = new THREE.Vector2(0, 0);
    let isIntersecting = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(raycastPlane);
      if (intersects.length > 0) {
        targetRingPos.set(intersects[0].point.x * 0.175, intersects[0].point.y * 0.175);
        isIntersecting = true;
      }
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const handleResize = () => {
      if (!container) return;
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      material.uniforms.uRez.value.set(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 5. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia ring tracking
      const lerpSpeed = isIntersecting ? 0.04 : 0.015;
      ringPos.x += (targetRingPos.x - ringPos.x) * lerpSpeed;
      ringPos.y += (targetRingPos.y - ringPos.y) * lerpSpeed;

      // Update shader uniforms
      material.uniforms.uTime.value = elapsedTime;
      material.uniforms.uRingPos.value.copy(ringPos);
      material.uniforms.uRingRadius.value = 0.175 + Math.sin(elapsedTime * 1.0) * 0.03 + Math.cos(elapsedTime * 3.0) * 0.02;
      material.uniforms.uRingWidth.value = ringWidth;
      material.uniforms.uRingWidth2.value = ringWidth2;
      material.uniforms.uRingDisplacement.value = ringDisplacement;
      material.uniforms.uParticleScale.value = particlesScale;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [theme, ringWidth, ringWidth2, ringDisplacement, density, particlesScale, interactive]);

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
