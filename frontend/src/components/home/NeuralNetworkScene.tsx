import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import { useTheme } from '../../context/ThemeContext';
import * as THREE from 'three';

// Generate random points in a sphere
function generateSpherePoints(count: number, radius: number): Float32Array {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const r = radius * Math.cbrt(Math.random());
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
}

// Main warm particles - golden/amber for professional look
function WarmParticles() {
    const ref = useRef<THREE.Points>(null);
    const { theme } = useTheme();

    const sphere = useMemo(() => generateSpherePoints(1200, 1.5), []);

    useFrame((_state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 15;
            ref.current.rotation.y -= delta / 20;
        }
    });

    // Golden/amber - professional warm tone
    const color = theme === 'dark' ? '#D4A574' : '#C4956A';

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={color}
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                />
            </Points>
        </group>
    );
}

// Secondary particles - subtle accent
function AccentParticles() {
    const ref = useRef<THREE.Points>(null);
    const { theme } = useTheme();

    const sphere = useMemo(() => generateSpherePoints(600, 1.2), []);

    useFrame((_state, delta) => {
        if (ref.current) {
            ref.current.rotation.x += delta / 18;
            ref.current.rotation.y += delta / 25;
        }
    });

    // Muted bronze
    const color = theme === 'dark' ? '#B8956A' : '#A07850';

    return (
        <group rotation={[0.5, 0, 0]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={color}
                    size={0.004}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </Points>
        </group>
    );
}

// Floating nodes - handcrafted look with warm tones
function FloatingNodes() {
    const { theme } = useTheme();
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (group.current) {
            group.current.children.forEach((child, i) => {
                child.position.y = Math.sin(t / 2 + i) * 0.1;
            });
        }
    });

    // Warm professional colors
    const primaryColor = theme === 'dark' ? "#D4A574" : "#C4956A";
    const secondaryColor = theme === 'dark' ? "#B8956A" : "#A07850";

    return (
        <group ref={group}>
            {/* Main node */}
            <mesh position={[-0.8, 0.2, 0]}>
                <sphereGeometry args={[0.08, 32, 32]} />
                <meshStandardMaterial
                    color={primaryColor}
                    emissive={primaryColor}
                    emissiveIntensity={0.8}
                />
            </mesh>

            {/* Secondary node */}
            <mesh position={[0.6, 0.4, 0.3]}>
                <sphereGeometry args={[0.05, 32, 32]} />
                <meshStandardMaterial
                    color={secondaryColor}
                    emissive={secondaryColor}
                    emissiveIntensity={0.6}
                />
            </mesh>

            {/* Third node */}
            <mesh position={[0.2, -0.3, 0.4]}>
                <sphereGeometry args={[0.04, 32, 32]} />
                <meshStandardMaterial
                    color={primaryColor}
                    emissive={primaryColor}
                    emissiveIntensity={0.5}
                />
            </mesh>
        </group>
    );
}

// Organic flowing curves - hand-drawn style
function FlowingCurves() {
    const { theme } = useTheme();
    const curve1 = useRef<THREE.Mesh>(null);
    const curve2 = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (curve1.current) {
            curve1.current.rotation.z = Math.sin(t / 5) * 0.08;
        }
        if (curve2.current) {
            curve2.current.rotation.z = Math.cos(t / 6) * 0.06;
        }
    });

    const lineColor = theme === 'dark' ? '#C4956A' : '#B8956A';

    return (
        <group>
            {/* Organic flowing line 1 */}
            <mesh ref={curve1} position={[0, 0, -0.5]}>
                <torusGeometry args={[0.7, 0.006, 16, 100, Math.PI * 1.3]} />
                <meshStandardMaterial
                    color={lineColor}
                    transparent
                    opacity={0.4}
                />
            </mesh>

            {/* Organic flowing line 2 */}
            <mesh ref={curve2} position={[0.1, 0.1, -0.3]} rotation={[0.4, 0.2, 0]}>
                <torusGeometry args={[0.5, 0.005, 16, 100, Math.PI * 0.9]} />
                <meshStandardMaterial
                    color={lineColor}
                    transparent
                    opacity={0.3}
                />
            </mesh>
        </group>
    );
}


export default function NeuralNetworkScene() {
    return (
        <div className="absolute inset-0 z-0 opacity-80">
            <Canvas camera={{ position: [0, 0, 1.2] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={0.4} color="#D4A574" />
                <pointLight position={[-10, -10, -10]} intensity={0.3} color="#B8956A" />
                <WarmParticles />
                <AccentParticles />
                <FloatingNodes />
                <FlowingCurves />
            </Canvas>
        </div>
    );
}
