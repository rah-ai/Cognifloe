import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Stars, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Agent Node Component
function AgentNode({ position, label, color, onClick }: any) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
            // Pulse effect
            const scale = hovered ? 1.2 : 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            meshRef.current.scale.setScalar(scale);
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={position}>
                {/* Glowing Core */}
                <mesh
                    ref={meshRef}
                    onClick={onClick}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    <icosahedronGeometry args={[0.8, 1]} />
                    <meshStandardMaterial
                        color={color}
                        emissive={color}
                        emissiveIntensity={hovered ? 2 : 0.5}
                        wireframe
                    />
                </mesh>

                {/* Inner Sphere for solidity */}
                <mesh scale={0.5}>
                    <sphereGeometry args={[0.8, 16, 16]} />
                    <meshBasicMaterial color={color} transparent opacity={0.8} />
                </mesh>

                {/* Label */}
                <Text
                    position={[0, -1.5, 0]}
                    fontSize={0.4}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.02}
                    outlineColor="#000000"
                >
                    {label}
                </Text>
            </group>
        </Float>
    );
}

// Connection Line Component
function Connection({ start, end, color }: any) {
    const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);

    return (
        <line>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={points.length}
                    array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color={color} opacity={0.3} transparent linewidth={1} />
        </line>
    );
}

// Data Packet Animation
function DataPacket({ route }: { route: [number, number, number][] }) {
    const ref = useRef<THREE.Mesh>(null);
    const [progress, setProgress] = useState(0);

    useFrame((_, delta) => {
        if (progress < 1) {
            setProgress(prev => (prev + delta * 0.5) % 1);
        }

        if (ref.current && route.length === 2) {
            const start = new THREE.Vector3(...route[0]);
            const end = new THREE.Vector3(...route[1]);
            ref.current.position.lerpVectors(start, end, progress);
        }
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.1]} />
            <meshBasicMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
            <Trail width={0.2} length={4} color={new THREE.Color(2, 2, 10)} attenuation={(t) => t * t}>
                <mesh />
            </Trail>
        </mesh>
    );
}

// Main Scene
export default function AgentMesh3D() {
    // Generate realistic agent positions in a sphere
    const agents = [
        { id: 1, label: "Input Handler", pos: [0, 2, 0], color: "#F97316" },
        { id: 2, label: "NLP Engine", pos: [-2, 0, 2], color: "#8B5CF6" },
        { id: 3, label: "Decision Core", pos: [0, 0, 0], color: "#10B981" },
        { id: 4, label: "Action Exec", pos: [2, 0, 2], color: "#F43F5E" },
        { id: 5, label: "Database", pos: [0, -2, 0], color: "#3B82F6" },
        { id: 6, label: "Monitor", pos: [-2, 0, -2], color: "#EAB308" },
        { id: 7, label: "Security", pos: [2, 0, -2], color: "#EC4899" },
    ];

    const connections = [
        [0, 2], // Input -> Decision
        [2, 1], // Decision -> NLP
        [1, 2], // NLP -> Decision
        [2, 3], // Decision -> Action
        [3, 4], // Action -> DB
        [2, 5], // Decision -> Monitor
        [2, 6], // Decision -> Security
    ];

    return (
        <div className="w-full h-[500px] bg-black/20 rounded-xl overflow-hidden relative border border-white/10 glass-card">
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Neural Mesh Visualization
                </h3>
                <p className="text-xs text-white/50">Using React Three Fiber • Live Agent Topology</p>
            </div>

            <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#F97316" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {/* Agents */}
                {agents.map((agent: any) => (
                    <AgentNode
                        key={agent.id}
                        position={agent.pos}
                        label={agent.label}
                        color={agent.color}
                        onClick={() => console.log(`Clicked ${agent.label}`)}
                    />
                ))}

                {/* Connections */}
                {connections.map(([startIdx, endIdx], i) => (
                    <group key={i}>
                        <Connection
                            start={agents[startIdx].pos}
                            end={agents[endIdx].pos}
                            color={agents[startIdx].color}
                        />
                        {/* Animated Data Packet */}
                        <DataPacket route={[agents[startIdx].pos as any, agents[endIdx].pos as any]} />
                    </group>
                ))}

                <OrbitControls
                    enableZoom={true}
                    autoRotate
                    autoRotateSpeed={0.5}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 3}
                />
            </Canvas>
        </div>
    );
}
