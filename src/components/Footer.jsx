import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer style={{
            position: 'relative',
            marginTop: 'auto',
        }}>
            {/* Top gradient transition */}
            <div style={{
                height: '100px',
                background: 'linear-gradient(to bottom, transparent, rgba(15, 23, 42, 0.8))',
                width: '100%'
            }}></div>

            <div style={{
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderTop: '1px solid rgba(56, 189, 248, 0.2)',
                boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                borderTopLeftRadius: '2rem',
                borderTopRightRadius: '2rem',
                padding: '4rem 1.5rem 2rem',
                color: '#f8fafc',
            }}>
                <div className="container grid md:grid-cols-3 gap-12">
                    <div>
                        <h2 style={{ color: '#f8fafc', fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
                            <span style={{ color: '#F59E0B', textShadow: '0 0 10px rgba(245, 158, 11, 0.3)' }}>Smart</span>Scheme AI
                        </h2>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                            Empowering citizens by providing AI-driven scheme discovery. Find the right government benefits tailored for your profile seamlessly and securely.
                        </p>
                    </div>

                    <div>
                        <h3 style={{ color: '#F59E0B', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '600', letterSpacing: '0.05em' }}>QUICK LINKS</h3>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', padding: 0 }}>
                            <li><a href="/" className="footer-link">{t('home')}</a></li>
                            <li><a href="/check-eligibility" className="footer-link">{t('checkEligibility')}</a></li>
                            <li><a href="/assistant" className="footer-link">{t('aiAssistant')}</a></li>
                            <li><a href="/admin" className="footer-link">Admin Dashboard</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 style={{ color: '#F59E0B', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: '600', letterSpacing: '0.05em' }}>IMPORTANT LINKS</h3>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', padding: 0 }}>
                            <li><a href="#" className="footer-link">National Portal of India</a></li>
                            <li><a href="#" className="footer-link">Digital India</a></li>
                            <li><a href="#" className="footer-link">Terms & Conditions</a></li>
                            <li><a href="#" className="footer-link">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="container" style={{
                    marginTop: '4rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: '#64748b',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <div style={{ width: '40px', height: '4px', background: '#F59E0B', borderRadius: '2px', opacity: '0.5', marginBottom: '1rem' }}></div>
                    <p>© 2026 SmartScheme AI Platform. All rights reserved. Built for citizens.</p>
                </div>
            </div>

            <style>{`
                .footer-link {
                    color: #94a3b8;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    position: relative;
                    display: inline-block;
                }
                .footer-link:hover {
                    color: #f8fafc;
                    transform: translateX(5px);
                    text-shadow: 0 0 8px rgba(248, 250, 252, 0.3);
                }
                .footer-link::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 1px;
                    bottom: -2px;
                    left: 0;
                    background-color: #38bdf8;
                    transition: width 0.3s ease;
                    box-shadow: 0 0 5px #38bdf8;
                }
                .footer-link:hover::after {
                    width: 100%;
                }
            `}</style>
        </footer>
    );
};

export default Footer;
