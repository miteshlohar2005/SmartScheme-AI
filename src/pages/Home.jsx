import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Users, Award, Briefcase, FileText, ChevronRight, Search, MapPin, Home as HomeIcon } from 'lucide-react';
import Hero3DObject from '../components/Hero3DObject';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    const featuredCategories = [
        { title: 'Agriculture', icon: Award, schemes: 120 },
        { title: 'Education', icon: FileText, schemes: 85 },
        { title: 'Health', icon: Shield, schemes: 110 },
        { title: 'Employment', icon: Briefcase, schemes: 95 },
    ];

    return (
        <div>
            {/* Hero Section */}
            <section style={{
                position: 'relative',
                background: 'transparent',
                color: 'var(--text-primary)',
                overflow: 'hidden',
                marginTop: '0'
            }}>
                {/* Decorative elements */}
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--saffron)', opacity: '0.1', filter: 'blur(80px)' }}></div>
                <div className="hero-background-glow"></div>

                <div className="hero-container" style={{ position: 'relative', zIndex: 10 }}>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{
                                background: 'var(--card-bg)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                border: '1px solid var(--card-border)',
                                borderRadius: '24px',
                                padding: '3rem 2.5rem',
                                boxShadow: 'var(--card-shadow)',
                                position: 'relative'
                            }}
                        >
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="hero-title" 
                                style={{ fontSize: '3.75rem', fontWeight: '900', lineHeight: '1.2', marginBottom: '1.5rem', filter: 'var(--hero-glow)' }}
                            >
                                <span style={{
                                    background: 'linear-gradient(135deg, #a78bfa, #ffffff)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontWeight: '800',
                                    letterSpacing: '-0.02em'
                                }}>{t('hero_title1')}</span><br />
                                <span style={{
                                    background: 'linear-gradient(135deg, #a78bfa, #ffffff)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontWeight: '800',
                                    letterSpacing: '-0.02em',
                                    filter: 'drop-shadow(0 0 25px rgba(167, 139, 250, 0.4))'
                                }}>{t('hero_title2')}</span>
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '2.5rem', maxWidth: '500px', lineHeight: '1.6', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                            >
                                {t('hero_desc')}
                            </motion.p>

                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                                    <Link to="/check-eligibility" className="btn primary-btn" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
                                        {t('btn_check')} <ChevronRight size={20} />
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                                    <Link to="/assistant" className="btn secondary-btn" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
                                        {t('btn_ask')}
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Hero Graphic / 3D Object */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                        >
                            <Hero3DObject />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Feature Cards */}
            <section style={{ padding: '0 1.5rem', background: 'transparent', marginTop: '-40px', position: 'relative', zIndex: 20 }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--heading-color)', marginBottom: '0.5rem' }}>{t('why_smartscheme')}</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>{t('why_desc')}</p>
                    </div>
                </div>
                <div className="container grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'AI Scheme Finder', desc: 'Discover the best government schemes using AI-powered recommendations tailored to you.', icon: Search },
                        { title: 'Eligibility Checker', desc: 'Instantly check which schemes you qualify for based on your personal profile.', icon: Shield },
                        { title: 'Nearby Centers', desc: 'Locate authorized government service centers near your location rapidly.', icon: MapPin },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            className="feature-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.5 }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'inline-flex', background: 'var(--btn-primary-bg)', color: 'white', padding: '1rem', borderRadius: '16px', alignSelf: 'flex-start', boxShadow: '0 10px 20px rgba(108, 59, 255, 0.3)' }}>
                                    <item.icon size={28} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{item.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Popular Categories */}
            <section style={{ padding: '5rem 1.5rem', background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
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

                    <div className="grid md:grid-cols-4 gap-6">
                        {featuredCategories.map((cat, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
                                className="card"
                                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 1.5rem' }}
                            >
                                <cat.icon size={40} color="var(--blue)" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{cat.title}</h3>
                                <span className="badge badge-saffron">{cat.schemes} Active Schemes</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Analytics Section */}
            <section style={{ padding: '5rem 1.5rem', background: 'transparent', borderTop: '1px solid var(--overlay-tint)' }}>
                <div className="container">
                    <div className="page-header" style={{ background: 'transparent', borderBottom: 'none', paddingBottom: '3rem' }}>
                        <h2 className="page-title" style={{ fontSize: '2.5rem', color: 'var(--blue)' }}>{t('platform_impact')}</h2>
                        <p className="page-subtitle" style={{ color: 'var(--text-secondary)' }}>{t('impact_desc')}</p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-6 text-center">
                        {[
                            { label: 'Users Helped', count: '2.5M+', icon: Users, color: '#3b82f6' },
                            { label: 'Schemes Discovered', count: '10K+', icon: Search, color: '#8b5cf6' },
                            { label: 'Applications Submitted', count: '1.2M+', icon: FileText, color: '#10b981' },
                            { label: 'Cities Served', count: '500+', icon: MapPin, color: '#f59e0b' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                style={{
                                    background: 'var(--card-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--card-border)',
                                    borderRadius: '16px', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    boxShadow: 'var(--card-shadow)'
                                }}
                            >
                                <stat.icon size={36} color={stat.color} style={{ marginBottom: '1rem' }} />
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{stat.count}</div>
                                <div style={{ color: 'var(--text-secondary)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending Schemes */}
            <section style={{ padding: '5rem 1.5rem', background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                        <div>
                            <h2 style={{ fontSize: '2.5rem', color: 'var(--blue)', marginBottom: '0.5rem', fontWeight: '800' }}>Trending Government Schemes</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>Most popular programs right now</p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: 'PM Kisan Samman Nidhi', applicants: '110M+', icon: Award },
                            { name: 'Ayushman Bharat Yojana', applicants: '50M+', icon: Shield },
                            { name: 'Pradhan Mantri Awas Yojana', applicants: '30M+', icon: HomeIcon },
                        ].map((scheme, i) => (
                            <motion.div
                                key={i} whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                style={{ background: 'var(--card-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '1.5rem', position: 'relative' }}
                            >
                                <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', color: '#fca5a5', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    🔥 Trending
                                </div>
                                <scheme.icon size={32} color="var(--blue)" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{scheme.name}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Providing direct financial support and benefits to eligible citizens across India.</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
                                    <span style={{ color: 'var(--saffron)', fontWeight: '600', fontSize: '14px' }}>{scheme.applicants} Applicants</span>
                                    <Link to="/schemes" style={{ color: 'var(--blue)', fontSize: '14px', fontWeight: '500' }}>Explore →</Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Stories */}
            <section style={{ padding: '5rem 1.5rem', background: 'transparent', borderTop: '1px solid var(--overlay-tint)' }}>
                <div className="container">
                    <div className="page-header" style={{ background: 'transparent', borderBottom: 'none', paddingBottom: '3rem' }}>
                        <h2 className="page-title" style={{ fontSize: '2.5rem', color: 'var(--blue)' }}>{t('success_stories')}</h2>
                        <p className="page-subtitle" style={{ color: 'var(--text-secondary)' }}>{t('success_desc')}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: 'Ramesh Patil', location: 'Farmer from Maharashtra', scheme: 'PM Kisan', benefit: 'Received ₹6000 directly to bank account to support agricultural needs.' },
                            { name: 'Sunita Devi', location: 'Homemaker from Bihar', scheme: 'Ujjwala Yojana', benefit: 'Received free LPG cylinder connection, ensuring clean cooking fuel.' },
                            { name: 'Arjun Kumar', location: 'Student from Karnataka', scheme: 'National Scholarship', benefit: 'Secured full tuition funding for engineering degree.' },
                        ].map((story, i) => (
                            <motion.div
                                key={i} whileHover={{ y: -5 }}
                                style={{ background: 'var(--card-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
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
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section style={{ padding: '6rem 1.5rem', background: 'var(--skeleton-bg)', backdropFilter: 'blur(10px)', color: 'var(--text-primary)', textAlign: 'center', borderTop: '1px solid var(--overlay-tint)' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1.5rem' }}>Ready to claim your benefits?</h2>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>Join the millions of citizens who have successfully discovered their eligible government schemes through our AI platform.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                            <Link to="/check-eligibility" className="btn primary-btn" style={{ fontSize: '1.25rem', padding: '1rem 2.5rem' }}>
                                {t('start_assessment')}
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
