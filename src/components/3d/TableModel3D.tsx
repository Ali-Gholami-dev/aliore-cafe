"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface TableModelProps {
  shape: "round" | "rect";
  capacity: number;
  color?: string;
}

function RoundTable({ capacity, color = "#C9A84C" }: { capacity: number; color?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#C9A84C", metalness: 0.9, roughness: 0.15,
  }), []);
  const woodMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#5C3D2E", metalness: 0.0, roughness: 0.8,
  }), []);
  const chairMat = useMemo(() => new THREE.MeshStandardMaterial({
    color, metalness: 0.05, roughness: 0.6,
  }), [color]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  const tableR = 0.6;
  const seats  = Math.min(capacity, 8);

  return (
    <group ref={groupRef}>
      {/* Tabletop */}
      <mesh material={woodMat} position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[tableR, tableR, 0.08, 48]} />
      </mesh>
      {/* Gold rim */}
      <mesh material={goldMat} position={[0, 0.04, 0]}>
        <torusGeometry args={[tableR, 0.025, 8, 48]} />
      </mesh>
      {/* Pedestal */}
      <mesh material={goldMat} position={[0, -0.45, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.82, 12]} />
      </mesh>
      {/* Base */}
      <mesh material={goldMat} position={[0, -0.88, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.06, 12]} />
      </mesh>
      {/* Chairs */}
      {[...Array(seats)].map((_, i) => {
        const angle = (i / seats) * Math.PI * 2;
        const r  = tableR + 0.52;
        const cx = Math.cos(angle) * r;
        const cz = Math.sin(angle) * r;
        return (
          <group key={i} position={[cx, 0, cz]} rotation={[0, -angle + Math.PI, 0]}>
            <mesh material={chairMat} position={[0, -0.2, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.18, 0.06, 16]} />
            </mesh>
            <mesh material={chairMat} position={[0, 0.08, -0.18]} castShadow>
              <boxGeometry args={[0.34, 0.44, 0.04]} />
            </mesh>
            {([-0.14, 0.14] as number[]).flatMap(lx =>
              ([-0.14, 0.14] as number[]).map(lz => (
                <mesh key={`${lx}-${lz}`} material={goldMat} position={[lx, -0.56, lz]} castShadow>
                  <cylinderGeometry args={[0.018, 0.018, 0.72, 8]} />
                </mesh>
              ))
            )}
          </group>
        );
      })}
    </group>
  );
}

function RectTable({ capacity, color = "#C9A84C" }: { capacity: number; color?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#C9A84C", metalness: 0.9, roughness: 0.15,
  }), []);
  const woodMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#5C3D2E", metalness: 0.0, roughness: 0.8,
  }), []);
  const chairMat = useMemo(() => new THREE.MeshStandardMaterial({
    color, metalness: 0.05, roughness: 0.6,
  }), [color]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
  });

  const tableW      = capacity <= 4 ? 1.2 : 1.8;
  const tableD      = 0.7;
  const seatsPerSide = Math.ceil(capacity / 2);
  const legOffsets: [number, number][] = [
    [-tableW / 2 + 0.1,  tableD / 2 - 0.1],
    [ tableW / 2 - 0.1,  tableD / 2 - 0.1],
    [-tableW / 2 + 0.1, -tableD / 2 + 0.1],
    [ tableW / 2 - 0.1, -tableD / 2 + 0.1],
  ];

  return (
    <group ref={groupRef}>
      {/* Tabletop */}
      <mesh material={woodMat} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[tableW, 0.07, tableD]} />
      </mesh>
      {/* Gold edge strip */}
      <mesh material={goldMat} position={[0, 0.04, 0]}>
        <boxGeometry args={[tableW + 0.02, 0.01, tableD + 0.02]} />
      </mesh>
      {/* Legs */}
      {legOffsets.map(([lx, lz], i) => (
        <mesh key={i} material={goldMat} position={[lx, -0.45, lz]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.86, 8]} />
        </mesh>
      ))}
      {/* Chairs on both long sides */}
      {([0, 1] as number[]).flatMap(side =>
        ([...Array(seatsPerSide)] as undefined[]).map((_, si) => {
          const x  = -tableW / 2 + tableW / seatsPerSide * (si + 0.5);
          const z  = side === 0 ? tableD / 2 + 0.52 : -(tableD / 2 + 0.52);
          const ry = side === 0 ? 0 : Math.PI;
          return (
            <group key={`${side}-${si}`} position={[x, 0, z]} rotation={[0, ry, 0]}>
              <mesh material={chairMat} position={[0, -0.2, 0]} castShadow>
                <boxGeometry args={[0.38, 0.06, 0.36]} />
              </mesh>
              <mesh material={chairMat} position={[0, 0.1, -0.16]} castShadow>
                <boxGeometry args={[0.36, 0.44, 0.04]} />
              </mesh>
              {([-0.15, 0.15] as number[]).flatMap(lx2 =>
                ([-0.14, 0.14] as number[]).map(lz2 => (
                  <mesh key={`${lx2}-${lz2}`} material={goldMat} position={[lx2, -0.56, lz2]} castShadow>
                    <cylinderGeometry args={[0.018, 0.018, 0.72, 8]} />
                  </mesh>
                ))
              )}
            </group>
          );
        })
      )}
    </group>
  );
}

export default function TableModel3D({ shape, capacity, color = "#C9A84C" }: TableModelProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.4, 2.8], fov: 38 }}
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} color="#FFF5D6" />
      <directionalLight position={[4, 6, 4]} intensity={1.8} castShadow color="#FFF5D6" />
      <pointLight position={[-3, 2, -3]} intensity={0.6} color="#C9A84C" />
      <pointLight position={[0, 4, 0]} intensity={0.4} color="#ffffff" />
      <Float speed={1.5} floatIntensity={0.2} rotationIntensity={0}>
        {shape === "round"
          ? <RoundTable capacity={capacity} color={color} />
          : <RectTable  capacity={capacity} color={color} />
        }
      </Float>
    </Canvas>
  );
}
