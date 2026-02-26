"use client";

import { Float, Line, OrbitControls, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

const nodePositions: [number, number, number][] = [
  [0, 0.95, 0],
  [1.3, 0.45, 0.35],
  [1.12, -0.8, -0.2],
  [0, -1.18, 0.55],
  [-1.2, -0.66, -0.1],
  [-1.32, 0.52, 0.42],
  [0, 0, -1.15]
];

const links: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 0],
  [0, 6],
  [2, 6],
  [4, 6]
];

function DataGraph() {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.24;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.32) * 0.12;
  });

  return (
    <group ref={group}>
      {links.map(([from, to], index) => (
        <Line
          key={`${from}-${to}-${index}`}
          points={[nodePositions[from], nodePositions[to]]}
          color="#0f766e"
          transparent
          opacity={0.42}
          lineWidth={1}
        />
      ))}

      {nodePositions.map((position, index) => (
        <Float
          key={position.join("-")}
          speed={1.2 + index * 0.08}
          rotationIntensity={0.45}
          floatIntensity={0.75}
        >
          <mesh position={position}>
            <sphereGeometry args={[index === 6 ? 0.2 : 0.14, 30, 30]} />
            <meshStandardMaterial
              color={index % 2 === 0 ? "#0f766e" : "#f97316"}
              emissive={index % 2 === 0 ? "#0f766e" : "#f97316"}
              emissiveIntensity={0.35}
              metalness={0.38}
              roughness={0.2}
            />
          </mesh>
        </Float>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.45, 0]}>
        <circleGeometry args={[2.05, 64]} />
        <meshBasicMaterial color="#0f766e" transparent opacity={0.08} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.42, 0]}>
        <ringGeometry args={[1.58, 1.62, 64]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

type HeroThreeSceneProps = {
  mode?: "panel" | "background";
  className?: string;
};

export default function HeroThreeScene({
  mode = "panel",
  className
}: HeroThreeSceneProps) {
  const isBackground = mode === "background";

  return (
    <div
      className={
        isBackground
          ? `h-full w-full ${className ?? ""}`
          : `h-[300px] w-full rounded-[2rem] border border-white/70 bg-gradient-to-b from-white/75 via-white/35 to-transparent shadow-soft sm:h-[380px] ${className ?? ""}`
      }
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.1, 5.25], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ pointerEvents: isBackground ? "none" : "auto" }}
      >
        <ambientLight intensity={0.75} />
        <directionalLight position={[5, 8, 3]} intensity={1.1} />
        <pointLight position={[-4, -2, 3]} intensity={0.95} color="#f97316" />
        <pointLight position={[3.5, -2, 2]} intensity={0.9} color="#0f766e" />

        <Sparkles
          size={1.65}
          count={isBackground ? 70 : 95}
          speed={0.26}
          scale={[4.5, 3.2, 2.6]}
          color="#14b8a6"
        />

        <DataGraph />

        {!isBackground ? (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 2.4}
          />
        ) : null}
      </Canvas>
    </div>
  );
}
