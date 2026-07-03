import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Users, Award, Briefcase, FileText, ChevronRight, Search, MapPin, Home as HomeIcon, CheckCircle2, Globe, Sparkles } from 'lucide-react';
import Hero3DObject from '../components/Hero3DObject';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    const shouldReduceMotion = useReducedMotion();

    const fadeInUp = {
        hidden: { 
            opacity: 0, 
            y: shouldReduceMotion ? 0 : 40, 
            scale: shouldReduceMotion ? 1 : 0.95 
        },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const featuredCategories = [
        { title: 'Agriculture', icon: Award, schemes: 120 },
        { title: 'Education', icon: FileText, schemes: 85 },
        { title: 'Health', icon: Shield, schemes: 110 },
        { title: 'Employment', icon: Briefcase, schemes: 95 },
    ];

    const trustCards = [
        { title: '500+ Government Schemes', icon: Award, color: '#3b82f6' },
        { title: 'AI-Powered Eligibility', icon: Sparkles, color: '#8b5cf6' },
        { title: 'Multilingual Support', icon: Globe, color: '#10b981' },
        { title: 'Secure & Free', icon: Shield, color: '#f59e0b' },
    ];

    return (
        <div>
            {/* Hero Section */}
            <section style={{
                position: 'relative',
                background: 'transparent',
                color: 'var(--text-primary)',
                overflow: 'hidden',
                padding: '6rem 1.5rem 4rem',
                minHeight: 'auto',
                display: 'flex',
                alignItems: 'center'
            }}>
                {/* Layered Gradients & Particles */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '60%', borderRadius: '50%', background: 'var(--saffron)', opacity: '0.15', filter: 'blur(100px)', zIndex: 0 }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '30%', height: '50%', borderRadius: '50%', background: 'var(--blue)', opacity: '0.15', filter: 'blur(100px)', zIndex: 0 }}></div>
                <div className="hero-background-glow"></div>

                <div className="hero-container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2rem',
                                zIndex: 10
                            }}
                        >
                            <motion.div 
                                variants={fadeInUp}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(138, 92, 255, 0.1)', border: '1px solid rgba(138, 92, 255, 0.3)', padding: '6px 12px', borderRadius: '100px', color: 'var(--saffron)', fontWeight: '600', fontSize: '0.85rem', width: 'fit-content', boxShadow: '0 4px 15px rgba(138, 92, 255, 0.15)' }}
                            >
                                <Sparkles size={14} /> AI-Powered Platform for Digital India
                            </motion.div>

                            <motion.h1 
                                variants={fadeInUp}
                                className="hero-title" 
                                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '900', lineHeight: '1.15', filter: 'var(--hero-glow)', letterSpacing: '-0.03em' }}
                            >
                                <span style={{
                                    background: 'var(--hero-gradient)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>{t('hero_title1')}</span><br />
                                <span style={{
                                    background: 'linear-gradient(135deg, var(--blue), var(--saffron))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    filter: 'var(--hero-glow)'
                                }}>{t('hero_title2')}</span>
                            </motion.h1>
                            
                            <motion.p 
                                variants={fadeInUp}
                                style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '540px', lineHeight: '1.7', fontWeight: '500' }}
                            >
                                {t('hero_desc')}
                            </motion.p>

                            <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                <Link to="/check-eligibility" className="btn primary-btn" style={{ fontSize: '1.1rem', padding: '1rem 2.25rem' }}>
                                    {t('btn_check')} <ChevronRight size={20} />
                                </Link>
                                <Link to="/assistant" className="btn secondary-btn" style={{ fontSize: '1.1rem', padding: '1rem 2.25rem' }}>
                                    {t('btn_ask')}
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Hero Graphic / 3D Object */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', position: 'relative' }}
                        >
                            {/* Inner ambient glow for the object */}
                            <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(167, 139, 250, 0.4), transparent 70%)', zIndex: -1, animation: 'pulse-glow-soft 4s infinite' }}></div>
                            <Hero3DObject />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trust Cards Section */}
            <section style={{ padding: '0 1.5rem 3rem', background: 'transparent', position: 'relative', zIndex: 20, marginTop: '-2rem' }}>
                <motion.div 
                    className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {trustCards.map((item, i) => (
                        <motion.div
                            key={i}
                            className="trust-card"
                            variants={fadeInUp}
                            style={{
                                background: 'var(--card-bg)',
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '16px',
                                padding: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: `rgba(${item.color === '#3b82f6' ? '59,130,246' : item.color === '#8b5cf6' ? '139,92,246' : item.color === '#10b981' ? '16,185,129' : '245,158,11'}, 0.15)`, color: item.color, flexShrink: 0 }}>
                                <item.icon size={24} />
                            </div>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', margin: 0, lineHeight: '1.3' }}>{item.title}</h3>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Popular Categories */}
            <section style={{ padding: '3rem 1.5rem', background: 'transparent', borderTop: '1px solid var(--overlay-tint)' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', color: 'var(--blue)', marginBottom: '0.5rem', fontWeight: '800' }}>Explore by Sector</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>{t('exploring_sector')}</p>
                        </div>
                        <Link to="/check-eligibility" style={{ color: 'var(--saffron)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {t('view_all')} <ChevronRight size={18} />
                        </Link>
                    </div>

                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {featuredCategories.map((cat, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
                                className="card"
                                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '1.5rem 1rem' }}
                            >
                                <cat.icon size={32} color="var(--blue)" style={{ marginBottom: '0.75rem' }} />
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{cat.title}</h3>
                                <span className="badge badge-saffron">{cat.schemes} Active Schemes</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Impact Analytics Section */}
            <section style={{ padding: '3rem 1.5rem', background: 'transparent', borderTop: '1px solid var(--overlay-tint)' }}>
                <div className="container">
                    <div className="page-header" style={{ background: 'transparent', borderBottom: 'none', paddingBottom: '2rem', marginBottom: 0 }}>
                        <h2 className="page-title" style={{ fontSize: '2.5rem', color: 'var(--blue)' }}>{t('platform_impact')}</h2>
                        <p className="page-subtitle" style={{ color: 'var(--text-secondary)' }}>{t('impact_desc')}</p>
                    </div>
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {[
                            { label: 'Users Helped', count: '2.5M+', icon: Users, color: '#3b82f6' },
                            { label: 'Schemes Discovered', count: '10K+', icon: Search, color: '#8b5cf6' },
                            { label: 'Applications Submitted', count: '1.2M+', icon: FileText, color: '#10b981' },
                            { label: 'Cities Served', count: '500+', icon: MapPin, color: '#f59e0b' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                style={{
                                    background: 'var(--card-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--card-border)',
                                    borderRadius: '16px', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    boxShadow: 'var(--card-shadow)'
                                }}
                            >
                                <stat.icon size={32} color={stat.color} style={{ marginBottom: '0.75rem' }} />
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{stat.count}</div>
                                <div style={{ color: 'var(--text-secondary)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Trending Schemes */}
            <section style={{ padding: '3rem 1.5rem', background: 'transparent', borderTop: '1px solid var(--overlay-tint)' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', color: 'var(--blue)', marginBottom: '0.5rem', fontWeight: '800' }}>Trending Government Schemes</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>Most popular programs right now</p>
                        </div>
                    </div>
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {[
                            { name: 'PM Kisan Samman Nidhi', applicants: '110M+', icon: Award },
                            { name: 'Ayushman Bharat Yojana', applicants: '50M+', icon: Shield },
                            { name: 'Pradhan Mantri Awas Yojana', applicants: '30M+', icon: HomeIcon },
                        ].map((scheme, i) => (
                            <motion.div
                                key={i} variants={fadeInUp} whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                style={{ background: 'var(--card-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '1.25rem', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}
                            >
                                <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', color: '#fca5a5', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    🔥 Trending
                                </div>
                                <scheme.icon size={28} color="var(--blue)" style={{ marginBottom: '0.75rem' }} />
                                <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{scheme.name}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', flexGrow: 1 }}>Providing direct financial support and benefits to eligible citizens across India.</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--card-border)', paddingTop: '0.75rem' }}>
                                    <span style={{ color: 'var(--saffron)', fontWeight: '600', fontSize: '14px' }}>{scheme.applicants} Applicants</span>
                                    <Link to="/schemes" style={{ color: 'var(--blue)', fontSize: '14px', fontWeight: '500' }}>Explore →</Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Success Stories */}
            <section style={{ padding: '3rem 1.5rem', background: 'transparent', borderTop: '1px solid var(--overlay-tint)' }}>
                <div className="container">
                    <div className="page-header" style={{ background: 'transparent', borderBottom: 'none', paddingBottom: '2rem', marginBottom: 0 }}>
                        <h2 className="page-title" style={{ fontSize: '2.5rem', color: 'var(--blue)' }}>{t('success_stories')}</h2>
                        <p className="page-subtitle" style={{ color: 'var(--text-secondary)' }}>{t('success_desc')}</p>
                    </div>
                    <motion.div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {[
                            { name: 'Ramesh Patil', location: 'Farmer from Maharashtra', scheme: 'PM Kisan', benefit: 'Received ₹6000 directly to bank account to support agricultural needs.' },
                            { name: 'Sunita Devi', location: 'Homemaker from Bihar', scheme: 'Ujjwala Yojana', benefit: 'Received free LPG cylinder connection, ensuring clean cooking fuel.' },
                            { name: 'Arjun Kumar', location: 'Student from Karnataka', scheme: 'National Scholarship', benefit: 'Secured full tuition funding for engineering degree.' },
                        ].map((story, i) => (
                            <motion.div
                                key={i} variants={fadeInUp} whileHover={{ y: -5 }}
                                style={{ background: 'var(--card-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%', justifyContent: 'space-between' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), var(--saffron))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>
                                        {story.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 style={{ color: 'var(--text-primary)', fontWeight: '600', margin: 0 }}>{story.name}</h4>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{story.location}</p>
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                                    <span style={{ display: 'inline-block', background: 'rgba(34,197,94,0.1)', color: '#4ade80', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
                                        Benefit: {story.scheme}
                                    </span>
                                    <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>"{story.benefit}"</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Call to Action */}
            <section style={{ padding: '4rem 1.5rem', background: 'var(--skeleton-bg)', backdropFilter: 'blur(10px)', color: 'var(--text-primary)', textAlign: 'center', borderTop: '1px solid var(--overlay-tint)' }}>
                <motion.div 
                    className="container" 
                    style={{ maxWidth: '800px' }}
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.h2 variants={fadeInUp} style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem' }}>Ready to claim your benefits?</motion.h2>
                    <motion.p variants={fadeInUp} style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>Join the millions of citizens who have successfully discovered their eligible government schemes through our AI platform.</motion.p>
                    <motion.div variants={fadeInUp} style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                            <Link to="/check-eligibility" className="btn primary-btn" style={{ fontSize: '1.25rem', padding: '1rem 2.5rem' }}>
                                {t('start_assessment')}
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
