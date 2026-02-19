import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useTheme } from "../../context/ThemeContext";

export default function ThreeBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const sphereRef = useRef<THREE.Mesh | null>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (!containerRef.current) return;

        // Init Scene
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Initial Colors based on current theme (or default to dark if generic)
        const isLight = theme === "light";
        const fogColor = isLight ? 0xf4f4f5 : 0x0e1012;
        scene.fog = new THREE.FogExp2(fogColor, 0.002);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // Objects
        const geometry = new THREE.IcosahedronGeometry(10, 1);

        // Wireframe Material
        const wireframeColor = isLight ? 0xcccccc : 0x444444;
        const material = new THREE.MeshBasicMaterial({
            color: wireframeColor,
            wireframe: true,
            transparent: true,
            opacity: isLight ? 0.3 : 0.1
        });

        // Glowing Nodes
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 200;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 40;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.08,
            color: 0xff6b58,
            transparent: true,
            opacity: 0.8
        });

        const sphere = new THREE.Mesh(geometry, material);
        sphereRef.current = sphere;
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);

        const group = new THREE.Group();
        group.add(sphere);
        group.add(particles);
        scene.add(group);

        // Curves
        const curveMaterial = new THREE.LineBasicMaterial({ color: 0xe6a45c, transparent: true, opacity: 0.2 });
        const curves = new THREE.Group();
        for (let i = 0; i < 5; i++) {
            const curve = new THREE.CubicBezierCurve3(
                new THREE.Vector3(-10, 0, 0),
                new THREE.Vector3(-5, 15 * Math.random(), 0),
                new THREE.Vector3(20, 15 * Math.random(), 0),
                new THREE.Vector3(10, 0, 0)
            );
            const points = curve.getPoints(50);
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(lineGeometry, curveMaterial);
            line.rotation.y = Math.random() * Math.PI * 2;
            line.rotation.z = Math.random() * Math.PI * 2;
            curves.add(line);
        }
        scene.add(curves);

        camera.position.z = 25;

        // Mouse Interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        const handleMouseMove = (event: MouseEvent) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        };

        document.addEventListener('mousemove', handleMouseMove);

        // Animation Loop
        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;

            group.rotation.y += 0.002;
            group.rotation.x += 0.001;

            group.rotation.y += 0.05 * (targetX - group.rotation.y);
            group.rotation.x += 0.05 * (targetY - group.rotation.x);

            curves.rotation.y -= 0.001;
            group.position.y = Math.sin(Date.now() * 0.001) * 1;

            renderer.render(scene, camera);
        };

        animate();

        // Resize Handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            // Dispose
            geometry.dispose();
            material.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            curveMaterial.dispose();
        };
    }, []); // Run once on mount

    // Update Theme Colors effect
    useEffect(() => {
        if (!sceneRef.current) return;

        const isLight = theme === "light";
        const fogColor = isLight ? 0xf4f4f5 : 0x0e1012;
        const wireframeColor = isLight ? 0xcccccc : 0x444444; // Light Gray vs Dark Gray

        gsap.to(sceneRef.current.fog!.color, {
            r: new THREE.Color(fogColor).r,
            g: new THREE.Color(fogColor).g,
            b: new THREE.Color(fogColor).b,
            duration: 0.5
        });

        if (sphereRef.current) {
            const mat = sphereRef.current.material as THREE.MeshBasicMaterial;
            gsap.to(mat.color, {
                r: new THREE.Color(wireframeColor).r,
                g: new THREE.Color(wireframeColor).g,
                b: new THREE.Color(wireframeColor).b,
                duration: 0.5
            });
            gsap.to(mat, {
                opacity: isLight ? 0.3 : 0.1,
                duration: 0.5
            });
        }

    }, [theme]);

    return (
        <div
            ref={containerRef}
            id="canvas-container"
            className="fixed inset-0 z-0 opacity-80 transition-opacity duration-1000 pointer-events-none"
        />
    );
}
