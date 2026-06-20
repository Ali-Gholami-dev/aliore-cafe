"use client";
// This file is the ONLY entry point for R3F/Three.js code.
// It is imported ONLY via next/dynamic with ssr:false.
// Never import this file directly - always use HeroCanvasLazy.tsx

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function CoffeeCup({ scrollY }: { scrollY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const steamRef = useRef<THREE.Mesh>(null);
  const coffeeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.08 - scrollY * 0.003;
    groupRef.current.rotation.y = t * 0.08 + scrollY * 0.002;
    groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.03;
    if (coffeeRef.current) {
      (coffeeRef.current.material as THREE.MeshStandardMaterial).roughness =
        0.15 + Math.sin(t * 2) * 0.05;
    }
    if (steamRef.current) {
      steamRef.current.position.y = 1.1 + Math.sin(t * 1.5) * 0.05;
      steamRef.current.rotation.y = t * 0.5;
      steamRef.current.scale.setScalar(0.8 + Math.sin(t) * 0.2);
      (steamRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.12 + Math.sin(t * 1.2) * 0.06;
    }
  });

  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#C9A84C", metalness: 0.95, roughness: 0.1,
  }), []);
  const porcelainMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#F8F4ED", metalness: 0.0, roughness: 0.15,
  }), []);
  const coffeeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#2C1A0E", metalness: 0.05, roughness: 0.2,
  }), []);

  return (
    <group ref={groupRef}>
      {/* Saucer */}
      <mesh material={porcelainMat} rotation-x={-Math.PI / 2} position={[0, -0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.1, 0.06, 48, 1]} />
      </mesh>
      <mesh material={goldMat} position={[0, -0.47, 0]}>
        <torusGeometry args={[1.15, 0.02, 8, 48]} />
      </mesh>
      {/* Cup */}
      <mesh material={porcelainMat} position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.55, 0.42, 0.85, 48, 1, true]} />
      </mesh>
      <mesh material={porcelainMat} position={[0, -0.325, 0]} rotation-x={Math.PI}>
        <circleGeometry args={[0.42, 48]} />
      </mesh>
      <mesh material={goldMat} position={[0, 0.525, 0]}>
        <torusGeometry args={[0.55, 0.018, 8, 48]} />
      </mesh>
      {/* Coffee surface */}
      <mesh ref={coffeeRef} material={coffeeMat} position={[0, 0.47, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.52, 48]} />
      </mesh>
      {/* Handle */}
      <mesh material={porcelainMat} position={[0.68, 0.12, 0]} castShadow>
        <torusGeometry args={[0.22, 0.048, 12, 32, Math.PI]} />
      </mesh>
      {/* Gold stripe */}
      <mesh material={goldMat} position={[0, 0.0, 0]}>
        <torusGeometry args={[0.505, 0.01, 6, 48]} />
      </mesh>
      {/* Steam */}
      <mesh ref={steamRef} position={[0, 1.1, 0]}>
        <torusKnotGeometry args={[0.08, 0.025, 64, 6, 2, 3]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.15} roughness={1} />
      </mesh>
      <Sparkles count={20} scale={[0.6, 1.2, 0.6]} position={[0, 0.8, 0]} size={1.5} speed={0.3} opacity={0.3} color="#E8D48A" />
    </group>
  );
}

function GoldRing({ radius, speed, tilt }: { radius: number; speed: number; tilt: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.getElapsedTime() * speed;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 8, 120]} />
      <meshStandardMaterial color="#C9A84C" metalness={1} roughness={0.1} transparent opacity={0.6} />
    </mesh>
  );
}

function GoldParticles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i++) {
      const r = 1.5 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.04;
    ref.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.03) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#C9A84C" size={0.018} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function AmbientSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.getElapsedTime() * 0.1;
    ref.current.rotation.y = state.clock.getElapsedTime() * 0.15;
  });
  return (
    <mesh ref={ref} position={[2.5, -0.5, -2]} scale={1.2}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <MeshDistortMaterial color="#C9A84C" distort={0.5} speed={2} roughness={0.1} metalness={0.9} transparent opacity={0.3} />
    </mesh>
  );
}

function CameraRig({ scrollY }: { scrollY: number }) {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.08) * 0.3;
    camera.position.y = 0.5 + Math.sin(t * 0.06) * 0.15 - scrollY * 0.002;
    camera.position.z = 4.5;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

interface HeroCanvasProps {
  scrollY: number;
}

export default function HeroCanvas({ scrollY }: HeroCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 4.5], fov: 40 }}
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.5} color="#FFE4A0" />
      <directionalLight position={[5, 8, 5]} intensity={1.8} color="#FFF5D6" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-3, 2, -3]} intensity={0.8} color="#C9A84C" />
      <pointLight position={[3, -1, 3]} intensity={0.4} color="#4040FF" />
      <spotLight position={[0, 6, 0]} angle={0.3} penumbra={1} intensity={1} color="#FFE4A0" />
      <CameraRig scrollY={scrollY} />
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.15}>
        <CoffeeCup scrollY={scrollY} />
      </Float>
      <GoldRing radius={1.8} speed={0.15}  tilt={Math.PI / 6} />
      <GoldRing radius={2.3} speed={-0.1}  tilt={Math.PI / 3} />
      <GoldRing radius={1.4} speed={0.25}  tilt={Math.PI / 2} />
      <GoldParticles />
      <AmbientSphere />
      <Sparkles count={40} scale={6} size={2} speed={0.2} opacity={0.5} color="#C9A84C" />
    </Canvas>
  );
}
