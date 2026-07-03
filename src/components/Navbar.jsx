import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShieldCheck, MessageSquare, Home, Search, Globe, MapPin, Bookmark, ArrowRightLeft, ClipboardList, Sun, Moon, Menu, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const MotionNavLink = motion(NavLink);

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const { theme, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Language dropdown state
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const langDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
                setIsLangDropdownOpen(false);
            }
        };

        if (isLangDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isLangDropdownOpen]);

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
        setIsLangDropdownOpen(false);
    };

    const toggleLangDropdown = () => {
        setIsLangDropdownOpen(prev => !prev);
    };

    const languages = [
        { code: 'en', label: 'EN' },
        { code: 'hi', label: 'HI' },
        { code: 'mr', label: 'MR' }
    ];

    const navLinks = [
        { path: '/', label: t('home'), icon: Home },
        { path: '/schemes', label: t('schemeDirectory'), icon: Search },
        { path: '/check-eligibility', label: t('checkEligibility'), icon: ShieldCheck },
        { path: '/help-centers', label: t('nearMe'), icon: MapPin },
    ];

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <header style={{
            background: 'var(--nav-bg)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--nav-border)',
            borderRadius: '100px',
            margin: '15px auto',
            maxWidth: '1200px',
            width: 'calc(100% - 2rem)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 1.5rem' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--blue)' }}>
                    <motion.div whileHover={{ rotate: 10, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <ShieldCheck size={32} color="var(--saffron)" />
                    </motion.div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: '800', background: 'linear-gradient(135deg, var(--saffron), var(--blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SmartScheme</h1>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase', margin: 0, fontWeight: '600' }}>{t('powered_by_ai')}</p>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="desktop-nav" style={{ display: 'none', gap: '1rem', alignItems: 'center' }}>
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <MotionNavLink
                                key={link.path}
                                to={link.path}
                                end={link.path === '/'}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    fontSize: '0.9rem', fontWeight: '500', padding: '8px 12px',
                                    borderRadius: '20px', transition: 'all 0.3s ease', position: 'relative'
                                }}
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon size={18} />
                                        <span>{link.label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-underline"
                                                style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: '3px', background: 'var(--blue)', borderRadius: '3px', boxShadow: '0 0 8px rgba(108, 59, 255, 0.5)' }}
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </>
                                )}
                            </MotionNavLink>
                        );
                    })}

                    {/* AI Assistant Special Badge */}
                    <MotionNavLink
                        to="/assistant"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="animate-pulse-glow"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            fontSize: '0.9rem', fontWeight: '700', padding: '8px 16px',
                            borderRadius: '100px', background: 'linear-gradient(135deg, rgba(138, 92, 255, 0.15), rgba(108, 59, 255, 0.25))',
                            color: 'var(--saffron)', border: '1px solid rgba(138, 92, 255, 0.3)',
                            textDecoration: 'none'
                        }}
                    >
                        <Sparkles size={16} />
                        {t('aiAssistant')}
                    </MotionNavLink>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid var(--nav-border)' }}>
                        {[
                            { to: "/saved-schemes", icon: Bookmark, title: "Saved Schemes" },
                            { to: "/compare", icon: ArrowRightLeft, title: "Compare" },
                            { to: "/my-applications", icon: ClipboardList, title: "My Applications" }
                        ].map((item, idx) => (
                            <motion.div key={idx} whileHover={{ y: -3, scale: 1.15 }} whileTap={{ scale: 0.95 }}>
                                <Link to={item.to} className="quick-action-icon" style={{ color: 'var(--text-primary)', padding: '0.5rem', borderRadius: '50%', background: 'var(--icon-hover-bg)', transition: 'all 0.3s', display: 'flex' }} title={item.title}>
                                    <item.icon size={18} />
                                </Link>
                            </motion.div>
                        ))}
                        
                        <motion.button 
                            onClick={(e) => toggleTheme(e)} 
                            whileHover={{ rotate: 45, scale: 1.1 }} 
                            whileTap={{ scale: 0.9 }}
                            className="quick-action-icon" 
                            style={{ 
                                color: theme === 'light' ? '#F59E0B' : '#E2E8F0', padding: '0.5rem', borderRadius: '50%', 
                                background: 'var(--icon-hover-bg)', border: 'none', cursor: 'pointer', display: 'flex'
                            }} 
                            title={t('toggle_theme')}
                        >
                            {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                        </motion.button>

                        <div ref={langDropdownRef} style={{ position: 'relative' }}>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                className="language-selector-pill" 
                                onClick={toggleLangDropdown}
                                aria-expanded={isLangDropdownOpen}
                                aria-haspopup="true"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--icon-hover-bg)',
                                    padding: '0 0.8rem', minHeight: '44px', minWidth: '44px', justifyContent: 'center',
                                    borderRadius: '2rem', border: '1px solid var(--nav-border)', cursor: 'pointer',
                                    color: 'var(--text-primary)', outline: 'none'
                                }}
                            >
                                <Globe size={18} />
                                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                                    {i18n.language.toUpperCase()}
                                </span>
                            </motion.button>
                            
                            <AnimatePresence>
                                {isLangDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        style={{
                                            position: 'absolute',
                                            top: 'calc(100% + 8px)',
                                            right: 0,
                                            background: 'var(--card-bg)',
                                            border: '1px solid var(--card-border)',
                                            borderRadius: '12px',
                                            boxShadow: 'var(--card-shadow)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            minWidth: '90px',
                                            zIndex: 1000,
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => handleLanguageChange(lang.code)}
                                                style={{
                                                    background: i18n.language === lang.code ? 'var(--icon-hover-bg)' : 'transparent',
                                                    color: 'var(--text-primary)',
                                                    border: 'none',
                                                    padding: '0.75rem 1rem',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    fontWeight: i18n.language === lang.code ? '700' : '500',
                                                    fontSize: '0.85rem',
                                                    transition: 'background 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = 'var(--icon-hover-bg)'}
                                                onMouseLeave={(e) => {
                                                    if (i18n.language !== lang.code) {
                                                        e.target.style.background = 'transparent';
                                                    }
                                                }}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu Toggle */}
                <button 
                    className="mobile-menu-toggle" 
                    onClick={toggleMobileMenu}
                    style={{ color: 'var(--text-primary)', padding: '0.5rem', background: 'var(--icon-hover-bg)', borderRadius: '50%', display: 'flex', border: 'none', cursor: 'pointer' }}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden', padding: '0 1.5rem' }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem 0', borderTop: '1px solid var(--nav-border)' }}>
                            {navLinks.map((link) => (
                                <Link key={link.path} to={link.path} onClick={toggleMobileMenu} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '500' }}>
                                    <link.icon size={20} color="var(--saffron)" /> {link.label}
                                </Link>
                            ))}
                            <Link to="/assistant" onClick={toggleMobileMenu} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--saffron)', fontSize: '1.1rem', fontWeight: '700' }}>
                                <Sparkles size={20} /> {t('aiAssistant')}
                            </Link>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--nav-border)', justifyContent: 'center' }}>
                                <button onClick={(e) => toggleTheme(e)} style={{ padding: '0.75rem', background: 'var(--icon-hover-bg)', borderRadius: '50%', color: 'var(--text-primary)', border: 'none' }}>
                                    {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @media (min-width: 1024px) {
                    .desktop-nav { display: flex !important; }
                    .mobile-menu-toggle { display: none !important; }
                }
            `}</style>
        </header>
    );
};

export default Navbar;
