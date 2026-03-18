import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { useTheme } from '../context/ThemeContext';

function MovingStars() {
    const starsRef = useRef();
    useFrame(({ clock }) => {
        if (starsRef.current) {
            starsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
            starsRef.current.rotation.x = clock.getElapsedTime() * 0.02;
        }
    });

    return (
        <Stars ref={starsRef} radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    );
}

const GalaxyBackground = () => {
    const { theme } = useTheme();

    return (
        <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            zIndex: -10, 
            background: 'var(--bg-color)', 
            overflow: 'hidden',
            opacity: theme === 'light' ? 0 : 1,
            transition: 'opacity 0.3s ease',
            pointerEvents: theme === 'light' ? 'none' : 'auto'
        }}>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <MovingStars />

                {/* Simulated Digital India 3D Nodes - Updated for Space Tech Theme */}
                <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                    <Sphere args={[1.5, 64, 64]} position={[3, 1, -2]}>
                        <MeshDistortMaterial color="#00e0ff" attach="material" distort={0.5} speed={2} roughness={0} metalness={0.8} opacity={0.3} transparent />
                    </Sphere>
                </Float>

                <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2.5}>
                    <Sphere args={[2, 64, 64]} position={[-4, -2, -5]}>
                        <MeshDistortMaterial color="#4f8cff" attach="material" distort={0.4} speed={1.5} roughness={0.2} metalness={0.9} opacity={0.4} transparent />
                    </Sphere>
                </Float>
            </Canvas>
        </div>
    );
};

export default GalaxyBackground;
