import React from 'react';
import { useUser } from '../context/UserContext';
import { ArrowRightLeft, Search, Trash2, CheckCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompareSchemes = () => {
    const { compareSchemes, toggleCompareScheme } = useUser();

    return (
        <div style={{ padding: '3rem 1.5rem', minHeight: '80vh', background: 'transparent' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'inline-flex', background: 'rgba(168, 85, 247, 0.2)', padding: '16px', borderRadius: '50%', color: '#A855F7', marginBottom: '1rem' }}>
                        <ArrowRightLeft size={40} />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--slate-50)', fontWeight: '800', marginBottom: '1rem' }}>
                        Scheme Comparison Tool
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        Compare up to 3 schemes side-by-side to find the best fit for your needs.
                    </p>
                </div>

                {compareSchemes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 0', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Search size={50} color="var(--slate-600)" style={{ margin: '0 auto 1rem auto' }} />
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--slate-300)', marginBottom: '0.5rem' }}>Nothing to Compare</h3>
                        <p style={{ color: 'var(--slate-500)' }}>Select schemes from the directory by clicking the Compare icon.</p>
                        <Link to="/schemes" className="btn btn-primary mt-4" style={{ display: 'inline-block', marginTop: '1rem' }}>Browse Schemes</Link>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' }}>
                        <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', color: 'var(--text-primary)' }}>
                            <thead>
                                <tr>
                                    <th style={{ width: '200px', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', color: 'var(--text-secondary)' }}>Features</th>
                                    {compareSchemes.map(scheme => (
                                        <th key={scheme.id} style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left', minWidth: '250px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: 'var(--saffron)' }}>{scheme.name}</h3>
                                                <button onClick={() => toggleCompareScheme(scheme)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }} title="Remove">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>{scheme.category}</div>
                                        </th>
                                    ))}
                                    {/* Empty columns to keep Layout up to 3 */}
                                    {Array.from({ length: 3 - compareSchemes.length }).map((_, i) => (
                                        <th key={`empty-${i}`} style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <Link to="/schemes" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '12px', color: 'var(--text-secondary)', textDecoration: 'none', padding: '2rem' }}>
                                                + Add Scheme
                                            </Link>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Benefits Row */}
                                <tr>
                                    <td style={{ padding: '1.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: '600', color: 'var(--text-primary)' }}>Benefits</td>
                                    {compareSchemes.map(s => (
                                        <td key={s.id} style={{ padding: '1.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'top', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                                            {s.shortDesc}
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - compareSchemes.length }).map((_, i) => <td key={`eb-${i}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}></td>)}
                                </tr>
                                {/* Eligibility Row */}
                                <tr>
                                    <td style={{ padding: '1.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: '600', color: 'var(--text-primary)' }}>Eligibility Match</td>
                                    {compareSchemes.map(s => (
                                        <td key={s.id} style={{ padding: '1.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'top' }}>
                                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(34,197,94,0.1)', color: '#4ade80', padding: '4px 8px', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold' }}>
                                                High Match
                                            </div>
                                            <p style={{ marginTop: '0.8rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Based on recent checks</p>
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - compareSchemes.length }).map((_, i) => <td key={`ee-${i}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}></td>)}
                                </tr>
                                {/* Documents Row */}
                                <tr>
                                    <td style={{ padding: '1.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: '600', color: 'var(--text-primary)' }}>Required Documents</td>
                                    {compareSchemes.map(s => (
                                        <td key={s.id} style={{ padding: '1.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'top' }}>
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '0.85rem' }}><CheckCircle size={14} color="var(--saffron)" /> Aadhaar Card</li>
                                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontSize: '0.85rem' }}><CheckCircle size={14} color="var(--saffron)" /> Bank Proof</li>
                                            </ul>
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - compareSchemes.length }).map((_, i) => <td key={`ed-${i}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}></td>)}
                                </tr>
                                {/* Apply Options */}
                                <tr>
                                    <td style={{ padding: '1.5rem 1rem' }}></td>
                                    {compareSchemes.map(s => (
                                        <td key={s.id} style={{ padding: '1.5rem 1rem', verticalAlign: 'top' }}>
                                            <Link to={`/scheme/${s.id}`} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content', padding: '0.5rem 1rem' }}>
                                                Process <ExternalLink size={16} />
                                            </Link>
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - compareSchemes.length }).map((_, i) => <td key={`ea-${i}`}></td>)}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompareSchemes;
