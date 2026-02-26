"use client";

import { Float, Line, OrbitControls, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import type { GraphMetric } from "@/lib/portfolio-data";
import type { Group } from "three";

const BAR_GAP = 1.08;

type SectionGraphSceneProps = {
  data: GraphMetric[];
  className?: string;
  highlightedLabel?: string | null;
  onHoverChange?: (label: string | null) => void;
};

type MetricBarsProps = {
  data: GraphMetric[];
  maxValue: number;
  highlightedLabel?: string | null;
  onHoverChange?: (label: string | null) => void;
};

function MetricBars({
  data,
  maxValue,
  highlightedLabel,
  onHoverChange
}: MetricBarsProps) {
  const group = useRef<Group>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  const heights = useMemo(
    () => data.map((item) => 0.72 + (item.value / maxValue) * 2.05),
    [data, maxValue]
  );

  const linePoints = useMemo(
    () =>
      heights.map((height, index) => {
        const x = (index - (data.length - 1) / 2) * BAR_GAP;
        return [x, height + 0.22, 0] as [number, number, number];
      }),
    [data.length, heights]
  );

  const activeLabel = hoveredLabel ?? highlightedLabel;

  useFrame((state) => {
    if (!group.current) return;
    const pointerTiltY = state.pointer.x * 0.24;
    const pointerTiltX = -0.08 + state.pointer.y * 0.08;
    const activeBoost = activeLabel ? 0.12 : 0;
    const targetY = pointerTiltY + activeBoost;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.06;
    group.current.rotation.x += (pointerTiltX - group.current.rotation.x) * 0.08;
  });

  return (
    <group ref={group}>
      {heights.map((height, index) => {
        const metric = data[index];
        const x = (index - (data.length - 1) / 2) * BAR_GAP;
        const isActive = activeLabel === metric.label;

        return (
          <group key={metric.label} position={[x, 0, 0]}>
            <mesh
              position={[0, height / 2, 0]}
              scale={isActive ? [1.08, 1.08, 1.08] : [1, 1, 1]}
              onPointerOver={(event) => {
                event.stopPropagation();
                setHoveredLabel(metric.label);
                onHoverChange?.(metric.label);
              }}
              onPointerOut={(event) => {
                event.stopPropagation();
                setHoveredLabel(null);
                onHoverChange?.(null);
              }}
            >
              <boxGeometry args={[0.6, height, 0.6]} />
              <meshStandardMaterial
                color={metric.color}
                emissive={metric.color}
                emissiveIntensity={isActive ? 0.58 : 0.28}
                metalness={0.42}
                roughness={0.2}
              />
            </mesh>

            <Float
              speed={1 + index * 0.08}
              rotationIntensity={0.36}
              floatIntensity={0.48}
            >
              <mesh position={[0, height + 0.2, 0]} scale={isActive ? 1.2 : 1}>
                <sphereGeometry args={[0.12, 24, 24]} />
                <meshStandardMaterial
                  color={metric.color}
                  emissive={metric.color}
                  emissiveIntensity={isActive ? 0.88 : 0.52}
                  roughness={0.16}
                  metalness={0.28}
                />
              </mesh>
            </Float>
          </group>
        );
      })}

      {linePoints.length > 1 ? (
        <Line
          points={linePoints}
          color="#0f172a"
          transparent
          opacity={0.22}
          lineWidth={1}
        />
      ) : null}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[Math.max(2.75, data.length * 0.78), 72]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry
          args={[Math.max(2.1, data.length * 0.55), Math.max(2.14, data.length * 0.56), 72]}
        />
        <meshBasicMaterial color="#0f766e" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function SectionGraphScene({
  data,
  className,
  highlightedLabel,
  onHoverChange
}: SectionGraphSceneProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div
      className={`relative h-[320px] w-full cursor-grab overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_20%_15%,rgba(15,118,110,0.18),transparent_48%),radial-gradient(circle_at_85%_25%,rgba(249,115,22,0.18),transparent_52%),linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.1))] active:cursor-grabbing ${className ?? ""}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[1.75rem] border border-white/65"
      />
      <Canvas
        dpr={[1, 1.2]}
        camera={{ position: [0, 1.4, 5.8], fov: 45 }}
        gl={{ antialias: false, alpha: true }}
        style={{ pointerEvents: "auto" }}
      >
        <ambientLight intensity={0.72} />
        <directionalLight position={[5, 7, 5]} intensity={0.95} />
        <pointLight position={[-4, 3, 2]} intensity={0.65} color="#0ea5e9" />
        <pointLight position={[4, -2, 2]} intensity={0.72} color="#f97316" />

        <Sparkles
          size={1.5}
          count={30}
          speed={0.18}
          scale={[5.2, 3.2, 3]}
          color="#14b8a6"
        />

        <MetricBars
          data={data}
          maxValue={maxValue}
          highlightedLabel={highlightedLabel}
          onHoverChange={onHoverChange}
        />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.7}
          rotateSpeed={0.42}
        />
      </Canvas>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[1.75rem] shadow-[inset_0_0_0_1px_rgba(15,23,42,0.06)]"
      />
    </div>
  );
}
