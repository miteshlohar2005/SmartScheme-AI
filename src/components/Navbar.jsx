import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShieldCheck, MessageSquare, Home, Search, Globe, MapPin, Bookmark, ArrowRightLeft, ClipboardList, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const MotionNavLink = motion(NavLink);

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();

    const navLinks = [
        { path: '/', label: t('home'), icon: Home },
        { path: '/schemes', label: t('schemeDirectory'), icon: Search },
        { path: '/check-eligibility', label: t('checkEligibility'), icon: ShieldCheck },
        { path: '/help-centers', label: t('nearMe'), icon: MapPin },
        { path: '/assistant', label: t('aiAssistant'), icon: MessageSquare },
    ];

    return (
        <header style={{
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid var(--nav-border)',
            position: 'sticky',
            top: '15px',
            zIndex: 50,
            borderRadius: '100px',
            margin: '0 auto',
            maxWidth: '1200px',
            width: 'calc(100% - 2rem)',
            boxShadow: '0 0 20px var(--card-border)',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 1.5rem' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--blue)' }}>
                    <motion.div 
                        whileHover={{ rotate: 10, scale: 1.1 }} 
                        whileTap={{ scale: 0.9 }}
                    >
                        <ShieldCheck size={32} color="var(--saffron)" />
                    </motion.div>
                    <div>
                        <h1 style={{ fontSize: '1.25rem', margin: 0 }}>SmartScheme AI</h1>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t('powered_by_ai')}</p>
                    </div>
                </Link>

                <nav style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <MotionNavLink
                                key={link.path}
                                to={link.path}
                                end={link.path === '/'}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={({ isActive }) => 
                                    isActive ? "nav-link active-link" : "nav-link"
                                }
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    padding: '8px 4px',
                                    transition: 'all 0.3s ease',
                                    position: 'relative'
                                }}
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon size={18} />
                                        <span className="md-inline d-none">{link.label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-underline"
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '-2px',
                                                    left: 0,
                                                    right: 0,
                                                    height: '2px',
                                                    background: 'var(--saffron)',
                                                    borderRadius: '2px',
                                                    boxShadow: '0 0 8px var(--saffron)'
                                                }}
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </>
                                )}
                            </MotionNavLink>
                        );
                    })}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {[
                            { to: "/saved-schemes", icon: Bookmark, title: "Saved Schemes" },
                            { to: "/compare", icon: ArrowRightLeft, title: "Compare" },
                            { to: "/my-applications", icon: ClipboardList, title: "My Applications" }
                        ].map((item, idx) => (
                            <motion.div key={idx} whileHover={{ y: -2, scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                <Link to={item.to} className="quick-action-icon" style={{ color: 'var(--text-primary)', padding: '0.5rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', transition: 'all 0.2s', display: 'flex' }} title={item.title}>
                                    <item.icon size={18} />
                                </Link>
                            </motion.div>
                        ))}
                        
                        <motion.button 
                            onClick={toggleTheme} 
                            whileHover={{ rotate: 15, scale: 1.1 }} 
                            whileTap={{ scale: 0.9 }}
                            className="quick-action-icon" 
                            style={{ 
                                color: theme === 'light' ? '#F59E0B' : '#E2E8F0', 
                                padding: '0.5rem', 
                                borderRadius: '50%', 
                                background: 'var(--icon-hover-bg)', 
                                border: 'none', 
                                cursor: 'pointer',
                                display: 'flex'
                            }} 
                            title={t('toggle_theme')}
                        >
                            {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                        </motion.button>

                        <motion.div 
                            whileHover={{ scale: 1.02 }}
                            className="language-selector-pill" 
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'var(--icon-hover-bg)',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '2rem',
                                border: '1px solid var(--nav-border)',
                                backdropFilter: 'blur(8px)',
                                cursor: 'pointer',
                                marginLeft: '0.5rem'
                            }}
                        >
                            <Globe size={16} color="var(--text-primary)" style={{ flexShrink: 0 }} />
                            <select
                                value={i18n.language}
                                onChange={(e) => i18n.changeLanguage(e.target.value)}
                                style={{
                                    background: 'transparent',
                                    color: 'var(--text-primary)',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    paddingRight: '0.5rem',
                                    fontWeight: '500'
                                }}
                            >
                                <option value="en">EN</option>
                                <option value="hi">HI</option>
                                <option value="mr">MR</option>
                            </select>
                        </motion.div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
