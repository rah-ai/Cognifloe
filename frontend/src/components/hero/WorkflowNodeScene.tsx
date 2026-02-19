import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

function Node({ position, color, size = 1, speed = 1 }: { position: [number, number, number], color: string, size?: number, speed?: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime() * speed;
        // Gentle floating + rotation
        meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.5;
        meshRef.current.rotation.y = Math.cos(t * 0.3) * 0.5;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} position={position}>
                <icosahedronGeometry args={[size, 1]} />
                <meshPhysicalMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.5}
                    transmission={0.6} // Glass
                    opacity={0.8}
                    transparent
                    roughness={0.2}
                    metalness={0.8}
                    thickness={2}
                    ior={1.5}
                />
            </mesh>
        </Float>
    );
}

function Connection({ start, end }: { start: [number, number, number], end: [number, number, number] }) {
    const points = useMemo(() => {
        const p1 = new THREE.Vector3(...start);
        const p2 = new THREE.Vector3(...end);
        const dist = p1.distanceTo(p2);
        // create a curve 
        const mid = p1.clone().add(p2).multiplyScalar(0.5);
        mid.y += dist * 0.2; // Arc up

        const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
        return curve.getPoints(20);
    }, [start, end]);

    return (
        <line>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={points.length} args={[new Float32Array(points.flatMap(p => [p.x, p.y, p.z])), 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="#ffffff" opacity={0.1} transparent linewidth={1} />
        </line>
    )
}

function SceneContent() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Theme Colors
    const mainColor = isDark ? "#e6a45c" : "#ff6b58"; // Amber / Coral
    const secondaryColor = isDark ? "#84cc16" : "#3b82f6"; // Sage / Blue

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color={mainColor} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color={secondaryColor} />

            {/* Central Core */}
            <Node position={[0, 0, 0]} color={mainColor} size={2} speed={0.5} />

            {/* Satellites */}
            <Node position={[4, 2, 0]} color={secondaryColor} size={0.8} speed={1} />
            <Node position={[-4, -1, 2]} color={secondaryColor} size={0.6} speed={1.2} />
            <Node position={[2, -3, -1]} color={mainColor} size={0.7} speed={0.8} />

            {/* Connections */}
            <Connection start={[0, 0, 0]} end={[4, 2, 0]} />
            <Connection start={[0, 0, 0]} end={[-4, -1, 2]} />
            <Connection start={[0, 0, 0]} end={[2, -3, -1]} />

            {/* Background Particles */}
            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

            {/* Subtle Environment environment */}
            <Environment preset="city" />
        </>
    );
}

export default function WorkflowNodeScene() {
    return (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background to-background/50">
            <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
                <SceneContent />
            </Canvas>
            {/* Fade overlay for seamless integration */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
        </div>
    );
}
