'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function GlobeCore() {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.08;
      meshRef.current.rotation.x = Math.sin(t * 0.05) * 0.05;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = t * 0.06;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Inner globe */}
      <Sphere ref={meshRef} args={[1.8, 64, 64]}>
        <meshStandardMaterial
          color="#1a1a3e"
          emissive="#2d1b69"
          emissiveIntensity={0.4}
          roughness={0.7}
          metalness={0.3}
          transparent
          opacity={0.92}
        />
      </Sphere>

      {/* Grid lines on globe */}
      <Sphere args={[1.82, 32, 32]}>
        <meshBasicMaterial
          color="#a88cff"
          wireframe
          transparent
          opacity={0.06}
        />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere ref={glowRef} args={[2.0, 48, 48]}>
        <meshBasicMaterial
          color="#7b5cff"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Outer glow ring */}
      <Sphere args={[2.2, 32, 32]}>
        <meshBasicMaterial
          color="#a88cff"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* City light dots */}
      <CityLights />

      {/* Connection arcs */}
      <ConnectionArcs />
    </group>
  );
}

function CityLights() {
  const pointsRef = useRef();

  const positions = useMemo(() => {
    const pos = [];
    // Simulate city light clusters
    const cities = [
      [0.5, 0.3, 1.7],    // Europe
      [-0.3, 0.4, 1.75],   // UK
      [0.8, -0.2, 1.6],    // Middle East
      [1.2, 0.5, 1.2],     // India
      [1.5, 0.3, 0.9],     // SE Asia
      [-1.0, 0.6, 1.3],    // East US
      [-1.5, 0.4, 0.8],    // West US
      [0.2, -1.0, 1.4],    // Africa
      [1.4, -0.5, 1.0],    // Australia
      [-0.8, -0.8, 1.3],   // South America
    ];

    cities.forEach(([x, y, z]) => {
      for (let i = 0; i < 8; i++) {
        pos.push(
          x + (Math.random() - 0.5) * 0.3,
          y + (Math.random() - 0.5) * 0.2,
          z + (Math.random() - 0.5) * 0.3
        );
      }
    });

    return new Float32Array(pos);
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f2d38d"
        size={0.03}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function ConnectionArcs() {
  const arcsRef = useRef();

  const curves = useMemo(() => {
    const arcData = [
      { from: [0.5, 0.3, 1.7], to: [1.2, 0.5, 1.2] },     // Europe to India
      { from: [1.2, 0.5, 1.2], to: [1.5, 0.3, 0.9] },      // India to SE Asia
      { from: [-1.0, 0.6, 1.3], to: [0.5, 0.3, 1.7] },     // US to Europe
      { from: [0.5, 0.3, 1.7], to: [0.2, -1.0, 1.4] },     // Europe to Africa
    ];

    return arcData.map(({ from, to }) => {
      const mid = [
        (from[0] + to[0]) / 2,
        (from[1] + to[1]) / 2 + 0.8,
        (from[2] + to[2]) / 2 + 0.4,
      ];
      return new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(...from),
        new THREE.Vector3(...mid),
        new THREE.Vector3(...to)
      );
    });
  }, []);

  useFrame(({ clock }) => {
    if (arcsRef.current) {
      arcsRef.current.rotation.y = clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <group ref={arcsRef}>
      {curves.map((curve, i) => {
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial
              color="#a88cff"
              transparent
              opacity={0.3}
              linewidth={1}
            />
          </line>
        );
      })}
    </group>
  );
}

function FloatingParticles() {
  const particlesRef = useRef();

  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < 120; i++) {
      pos.push(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
    }
    return new Float32Array(pos);
  }, []);

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.02;
      particlesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f2d38d"
        size={0.015}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

export default function HeroGlobe() {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      right: '5%',
      transform: 'translateY(-55%)',
      width: '55%',
      height: '90%',
      zIndex: 2,
    }}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={0.6} color="#e8dcf0" />
        <pointLight position={[-3, 2, 4]} intensity={0.8} color="#a88cff" distance={12} />
        <pointLight position={[3, -1, 3]} intensity={0.4} color="#f2d38d" distance={10} />

        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
          <GlobeCore />
        </Float>

        <FloatingParticles />
        <Stars radius={50} depth={40} count={800} factor={2} saturation={0.2} fade speed={0.5} />
      </Canvas>
    </div>
  );
}
