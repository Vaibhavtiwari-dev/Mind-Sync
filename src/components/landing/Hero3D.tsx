'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, Suspense, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geomRef = useRef<THREE.IcosahedronGeometry>(null);

  // Store the initial vertex positions to compute relative noise offset
  const initialPositions = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(1.5, 64);
    const pos = geom.attributes.position.array.slice() as Float32Array;
    geom.dispose();
    return pos;
  }, []);

  useFrame(({ clock, camera }) => {
    // Override camera aspect ratio to force the exact vertical stretching of the design
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetAspect = window.innerWidth / window.innerHeight;
      if (camera.aspect !== targetAspect) {
        camera.aspect = targetAspect;
        camera.updateProjectionMatrix();
      }
    }

    if (meshRef.current && geomRef.current) {
      const time = clock.getElapsedTime();
      const geom = geomRef.current;
      const positions = geom.attributes.position.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        const x = initialPositions[i];
        const y = initialPositions[i + 1];
        const z = initialPositions[i + 2];

        const noise =
          Math.sin(x * 2 + time) * 0.15 +
          Math.cos(y * 2 + time) * 0.15 +
          Math.sin(z * 2 + time) * 0.15;

        positions[i] = x * (1 + noise);
        positions[i + 1] = y * (1 + noise);
        positions[i + 2] = z * (1 + noise);
      }

      geom.attributes.position.needsUpdate = true;
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x += 0.003;
    }
  });

  return (
    <mesh ref={meshRef} scale={[1, 1, 1]}>
      <icosahedronGeometry ref={geomRef} args={[1.5, 64]} />
      <meshPhongMaterial
        color="#d3bbff"
        wireframe={true}
        transparent={true}
        opacity={0.4}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} color="#adc6ff" />
      <directionalLight position={[2, 2, 5]} intensity={1.5} color="#ffb0ca" />
      <AnimatedSphere />
    </>
  );
}

export function Hero3D() {
  const [size, setSize] = useState(800);

  useEffect(() => {
    const handleResize = () => {
      setSize(Math.min(window.innerWidth, 800));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      id="canvas-container"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"
      style={{ width: size, height: size }}
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 75 }}
          style={{ display: 'block', width: '100%', height: '100%' }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
