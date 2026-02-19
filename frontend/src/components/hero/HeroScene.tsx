import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

// Central glowing orb
function CentralOrb() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = clock.getElapsedTime() * 0.1;
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.15;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[0, 0, 0]}>
                <MeshDistortMaterial
                    color="#ff6b58"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
}

// Orbiting particles
function OrbitingParticles() {
    const groupRef = useRef<THREE.Group>(null);
    const particleCount = 50;

    const particles = Array.from({ length: particleCount }, (_, i) => {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 3 + Math.random() * 2;
        return {
            position: [
                Math.cos(angle) * radius,
                (Math.random() - 0.5) * 2,
                Math.sin(angle) * radius,
            ] as [number, number, number],
            scale: 0.05 + Math.random() * 0.08,
        };
    });

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {particles.map((particle, i) => (
                <mesh key={i} position={particle.position}>
                    <sphereGeometry args={[particle.scale, 16, 16]} />
                    <meshStandardMaterial
                        color={i % 2 === 0 ? "#ff6b58" : "#e6a45c"}
                        emissive={i % 2 === 0 ? "#ff6b58" : "#e6a45c"}
                        emissiveIntensity={0.5}
                    />
                </mesh>
            ))}
        </group>
    );
}

// Connection lines
function ConnectionLines() {
    const linesRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
        if (linesRef.current) {
            linesRef.current.rotation.y = clock.getElapsedTime() * 0.05;
            linesRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
        }
    });

    const lines = Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return {
            start: [0, 0, 0] as [number, number, number],
            end: [
                Math.cos(angle) * 4,
                Math.sin(angle * 2) * 0.5,
                Math.sin(angle) * 4,
            ] as [number, number, number],
        };
    });

    return (
        <group ref={linesRef}>
            {lines.map((line, i) => (
                <line key={i}>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            args={[new Float32Array([...line.start, ...line.end]), 3]}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial color="#ff6b58" opacity={0.3} transparent />
                </line>
            ))}
        </group>
    );
}

export default function HeroScene() {
    return (
        <div className="absolute inset-0 -z-10">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#ff6b58" />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#e6a45c" />

                    <CentralOrb />
                    <OrbitingParticles />
                    <ConnectionLines />
                </Suspense>
            </Canvas>
        </div>
    );
}
