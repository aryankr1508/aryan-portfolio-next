"use client";

import { Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { Mesh, MeshStandardMaterial } from "three";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";

const MAX_CUBES = 48;
const SPAWN_INTERVAL_MS = 65;
const MIN_POINTER_TRAVEL = 0.012;
const TRAIL_CAMERA_FOV_DEG = 46;
const TRAIL_CAMERA_Z = 5.6;
const TRAIL_EDGE_PADDING = 0.92;

type ThemeMode = "dark" | "light";

type CursorCube = {
  id: number;
  x: number;
  y: number;
  z: number;
  size: number;
  bornAt: number;
  ttl: number;
  driftX: number;
  driftY: number;
  driftZ: number;
  spinX: number;
  spinY: number;
  color: string;
};

type CubeTrailProps = {
  cubes: CursorCube[];
};

function CubeTrail({ cubes }: CubeTrailProps) {
  const meshRefs = useRef<Record<number, Mesh | null>>({});

  useFrame(() => {
    const now = performance.now();

    for (const cube of cubes) {
      const mesh = meshRefs.current[cube.id];
      if (!mesh) continue;

      const age = (now - cube.bornAt) / 1000;
      const life = Math.min(1, age / cube.ttl);

      if (life >= 1) {
        mesh.visible = false;
        continue;
      }

      mesh.visible = true;
      mesh.position.set(
        cube.x + cube.driftX * age,
        cube.y + cube.driftY * age,
        cube.z + cube.driftZ * age
      );

      const scale = cube.size * (1 - life * 0.72);
      mesh.scale.setScalar(scale);
      mesh.rotation.x += cube.spinX;
      mesh.rotation.y += cube.spinY;

      const material = mesh.material as MeshStandardMaterial;
      material.opacity = 0.82 * (1 - life);
      material.emissiveIntensity = 0.32 + (1 - life) * 0.42;
    }
  });

  return (
    <group>
      {cubes.map((cube) => (
        <mesh
          key={cube.id}
          ref={(node) => {
            meshRefs.current[cube.id] = node;
          }}
          position={[cube.x, cube.y, cube.z]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={cube.color}
            emissive={cube.color}
            emissiveIntensity={0.58}
            roughness={0.24}
            metalness={0.42}
            transparent
            opacity={0.78}
          />
        </mesh>
      ))}
    </group>
  );
}

type HeroCursorCubesSceneProps = {
  theme: ThemeMode;
  className?: string;
  useLiteVisuals?: boolean;
};

function HeroCursorCubesScene({
  theme,
  className,
  useLiteVisuals = false
}: HeroCursorCubesSceneProps) {
  const [cubes, setCubes] = useState<CursorCube[]>([]);
  const [isSceneVisible, setIsSceneVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const cubeIdRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);

  const palette = useMemo(
    () =>
      theme === "dark"
        ? ["#22d3ee", "#38bdf8", "#14b8a6", "#fb923c"]
        : ["#0f766e", "#0ea5e9", "#14b8a6", "#f97316"],
    [theme]
  );

  useEffect(() => {
    if (useLiteVisuals || cubes.length === 0) return undefined;

    const now = performance.now();
    const nextExpiry = Math.min(
      ...cubes.map((cube) => cube.bornAt + cube.ttl * 1000)
    );
    const pruneTimer = window.setTimeout(() => {
      const now = performance.now();
      setCubes((previous) => {
        const active = previous.filter(
          (cube) => now - cube.bornAt < cube.ttl * 1000
        );
        return active.length === previous.length ? previous : active;
      });
    }, Math.max(16, nextExpiry - now + 16));

    return () => window.clearTimeout(pruneTimer);
  }, [cubes, useLiteVisuals]);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSceneVisible(entry.isIntersecting),
      { rootMargin: "120px 0px", threshold: 0.01 }
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const spawnCube = (ndcX: number, ndcY: number, aspectRatio: number) => {
    const now = performance.now();

    if (now - lastSpawnRef.current < SPAWN_INTERVAL_MS) {
      return;
    }

    lastSpawnRef.current = now;
    const z = -1.2 - Math.random() * 2.2;
    const depth = TRAIL_CAMERA_Z - z;
    const halfHeight = Math.tan((TRAIL_CAMERA_FOV_DEG * Math.PI) / 360) * depth;
    const halfWidth = halfHeight * aspectRatio;
    const x = ndcX * halfWidth * TRAIL_EDGE_PADDING;
    const y = ndcY * halfHeight * TRAIL_EDGE_PADDING;

    setCubes((previous) => {
      const nextCube: CursorCube = {
        id: cubeIdRef.current++,
        x,
        y,
        z,
        size: 0.14 + Math.random() * 0.22,
        bornAt: now,
        ttl: 0.85 + Math.random() * 0.75,
        driftX: (Math.random() - 0.5) * 0.24,
        driftY: 0.1 + Math.random() * 0.3,
        driftZ: (Math.random() - 0.5) * 0.35,
        spinX: 0.012 + Math.random() * 0.018,
        spinY: 0.015 + Math.random() * 0.02,
        color: palette[Math.floor(Math.random() * palette.length)]
      };

      const trimmed = previous.length >= MAX_CUBES ? previous.slice(previous.length - MAX_CUBES + 1) : previous;
      return [...trimmed, nextCube];
    });
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (useLiteVisuals) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const y = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
    const aspectRatio = bounds.width / bounds.height;

    const previous = lastPointerRef.current;
    if (previous) {
      const dx = x - previous.x;
      const dy = y - previous.y;
      if (Math.hypot(dx, dy) < MIN_POINTER_TRAVEL) return;
    }

    lastPointerRef.current = { x, y };
    spawnCube(x, y, aspectRatio);
  };

  const isDark = theme === "dark";

  return (
    <div
      ref={rootRef}
      className={`absolute inset-0 h-full w-full overflow-hidden ${className ?? ""}`}
      onPointerLeave={() => {
        lastPointerRef.current = null;
      }}
      onPointerMove={handlePointerMove}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(circle_at_14%_18%,rgba(34,211,238,0.24),transparent_44%),radial-gradient(circle_at_86%_24%,rgba(59,130,246,0.2),transparent_48%),linear-gradient(140deg,rgba(2,6,23,0.74)_0%,rgba(2,6,23,0.48)_45%,rgba(14,116,144,0.22)_100%)]"
            : "bg-[radial-gradient(circle_at_14%_18%,rgba(15,118,110,0.2),transparent_44%),radial-gradient(circle_at_86%_24%,rgba(14,165,233,0.14),transparent_50%),linear-gradient(145deg,rgba(255,255,255,0.84)_0%,rgba(241,245,249,0.7)_45%,rgba(20,184,166,0.12)_100%)]"
        }`}
      />

      <div
        aria-hidden
        className={`hero-interactive-grid pointer-events-none absolute inset-0 ${
          isDark ? "opacity-45" : "opacity-35"
        }`}
      />

      {!useLiteVisuals ? (
        <Canvas
          className="absolute inset-0 h-full w-full"
          dpr={[1, 1.25]}
          frameloop={isSceneVisible ? "always" : "demand"}
          camera={{ position: [0, 0.2, 5.6], fov: 46 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.toneMapping = ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.08;
            gl.outputColorSpace = SRGBColorSpace;
          }}
          style={{ pointerEvents: "none" }}
        >
          <ambientLight intensity={0.74} />
          <directionalLight position={[4, 6, 3]} intensity={0.88} />
          <pointLight position={[-4, 1, 2.2]} intensity={0.78} color={isDark ? "#22d3ee" : "#0f766e"} />
          <pointLight position={[3.5, -1.6, 2]} intensity={0.72} color={isDark ? "#fb923c" : "#f97316"} />

          <Sparkles
            size={1.2}
            count={isDark ? 24 : 18}
            speed={0.18}
            scale={[5.6, 3.6, 3.4]}
            color={isDark ? "#67e8f9" : "#0f766e"}
          />

          <CubeTrail cubes={cubes} />
        </Canvas>
      ) : null}

    </div>
  );
}

export default memo(HeroCursorCubesScene);
