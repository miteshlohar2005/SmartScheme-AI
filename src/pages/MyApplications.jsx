import React from 'react';
import { useUser } from '../context/UserContext';
import { ClipboardList, Clock, CheckCircle, AlertCircle, Search } from 'lucide-react';

const MyApplications = () => {
    const { myApplications } = useUser();

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return { bg: 'rgba(34,197,94,0.1)', text: '#4ade80', icon: <CheckCircle size={16} /> };
            case 'Rejected': return { bg: 'rgba(239,68,68,0.1)', text: '#fca5a5', icon: <AlertCircle size={16} /> };
            case 'Under Review': return { bg: 'rgba(245,158,11,0.1)', text: '#fcd34d', icon: <Search size={16} /> };
            default: return { bg: 'rgba(59,130,246,0.1)', text: '#93c5fd', icon: <Clock size={16} /> }; // Applied
        }
    };

    return (
        <div style={{ padding: '3rem 1.5rem', minHeight: '80vh', background: 'transparent' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'inline-flex', background: 'rgba(168, 85, 247, 0.2)', padding: '16px', borderRadius: '50%', color: '#A855F7', marginBottom: '1rem' }}>
                        <ClipboardList size={40} />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--slate-50)', fontWeight: '800', marginBottom: '1rem' }}>
                        My Applications
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: '0 auto' }}>
                        Track the status of your submitted scheme applications.
                    </p>
                </div>

                {myApplications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 0', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <ClipboardList size={50} color="var(--slate-600)" style={{ margin: '0 auto 1rem auto' }} />
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--slate-300)', marginBottom: '0.5rem' }}>No Applications Found</h3>
                        <p style={{ color: 'var(--slate-500)' }}>You haven't applied for any schemes yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {myApplications.map((app) => {
                            const statusStyle = getStatusColor(app.status);
                            return (
                                <div key={app.id} style={{
                                    background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div>
                                            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white', margin: '0 0 0.5rem 0' }}>
                                                {app.scheme.name}
                                            </h2>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>App ID: AP-{app.id.slice(-6).toUpperCase()}</span>
                                                <span style={{ color: 'var(--text-primary)', padding: '4px 8px', borderRadius: '4px' }}>Applied on: {app.date}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: statusStyle.bg, color: statusStyle.text, padding: '8px 16px', borderRadius: '24px', fontWeight: '600', fontSize: '0.95rem' }}>
                                            {statusStyle.icon} {app.status}
                                        </div>
                                    </div>

                                    {/* Timeline UI */}
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '2rem', padding: '1rem 0', position: 'relative' }}>
                                        {/* Background Track */}
                                        <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0, transform: 'translateY(-50%)' }}></div>

                                        {/* Steps */}
                                        {['Applied', 'Under Review', 'Verified', 'Approved'].map((step, idx) => {
                                            const isActive = idx === 0 ||
                                                (idx <= 1 && (app.status === 'Under Review' || app.status === 'Approved')) ||
                                                (idx <= 3 && app.status === 'Approved');

                                            // Handling Rejected state specifically
                                            const isRejected = app.status === 'Rejected' && idx === 1; // Assuming rejection happens at Review stage

                                            return (
                                                <div key={idx} style={{ flex: 1, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <div style={{
                                                        width: '24px', height: '24px', borderRadius: '50%',
                                                        background: isRejected ? '#ef4444' : isActive ? 'var(--blue)' : '#334155',
                                                        border: `4px solid ${isRejected ? 'rgba(239,68,68,0.2)' : isActive ? 'rgba(59,130,246,0.3)' : 'transparent'}`,
                                                        display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', marginBottom: '0.5rem', transition: 'all 0.3s'
                                                    }}>
                                                        {isActive && !isRejected && <CheckCircle size={12} />}
                                                        {isRejected && <AlertCircle size={12} />}
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: isRejected ? '#ef4444' : isActive ? '#E2E8F0' : '#64748b', fontWeight: isActive ? '600' : 'normal', textAlign: 'center' }}>
                                                        {step}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Footer Info */}
                                    <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                            Estimated approval tracking: <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{app.estimatedApproval}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
