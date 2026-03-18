import React from 'react';
import { motion } from 'framer-motion';

// This replaces the heavy WebGL implementation with a highly optimized,
// universally supported 2.5D presentation using Framer Motion and standard DOM elements.
// It completely eliminates the "broken white square / WebGL context" errors.

const AbstractCircles = () => {
    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            {/* Top right outer orbital ring */}
            <motion.div
                animate={{
                    y: [-10, 10, -10],
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                }}
                transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 25, repeat: Infinity, ease: "linear" }, scale: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
                style={{
                    position: 'absolute',
                    top: '5%',
                    right: '15%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    border: '1px solid rgba(167, 139, 250, 0.1)',
                    borderTop: '2px solid rgba(167, 139, 250, 0.3)',
                }}
            />

            {/* Bottom left dashed orbital indicator */}
            <motion.div
                animate={{
                    rotate: [360, 0],
                    scale: [1, 1.05, 1],
                }}
                transition={{ rotate: { duration: 40, repeat: Infinity, ease: "linear" }, scale: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '10%',
                    width: '350px',
                    height: '350px',
                    borderRadius: '50%',
                    border: '1px dashed rgba(167, 139, 250, 0.15)',
                }}
            />

            {/* Glowing orb center back for futuristic neon AI look */}
            <div className="farmer-glow" />
        </div>
    );
};

const GlowParticles = () => {
    // Generate static particle positions to render lightweight DOM dots instead of WebGL instances
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        size: Math.random() * 6 + 2,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
    }));

    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
            {particles.map(p => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 0.1, y: 0 }}
                    animate={{
                        opacity: [0.1, 0.8, 0.1],
                        y: [-10, -30]
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'absolute',
                        top: p.top,
                        left: p.left,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        backgroundColor: '#8A5CFF',
                        borderRadius: '50%',
                        boxShadow: '0 0 10px #8A5CFF, 0 0 20px #6C3BFF'
                    }}
                />
            ))}
        </div>
    );
};

const Hero3DObject = () => {
    return (
        <div style={{
            height: '600px',
            width: '100%',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'visible'
        }}>

            {/* Background elements */}
            <AbstractCircles />
            <GlowParticles />

            {/* Float animation applied exactly like the 3D billboard */}
            <motion.div
                animate={{
                    y: [-10, 10, -10],
                    rotateZ: [-1, 1, -1]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    position: 'relative',
                    zIndex: 10,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {/* Fallback styling explicitly handled to avoid any browser Broken Image icons */}
                <img
                    src="/farmer3d_transparent.png"
                    alt="3D Indian Farmer Character"
                    className="farmer-character"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none'; // Hide completely if fails to load to prevent ugly icons
                    }}
                    style={{
                        width: '100%',
                        maxWidth: '450px',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))'
                    }}
                />

                {/* Contact Shadow / Ground blur underneath the floating character */}
                <motion.div
                    animate={{
                        scale: [1, 0.85, 1],
                        opacity: [0.6, 0.3, 0.6]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        width: '200px',
                        height: '20px',
                        background: 'rgba(0,0,0,0.6)',
                        borderRadius: '50%',
                        filter: 'blur(10px)',
                        marginTop: '20px'
                    }}
                />
            </motion.div>
        </div>
    );
};

export default Hero3DObject;
