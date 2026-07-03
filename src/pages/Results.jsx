import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, FileText, ExternalLink, MapPin, Activity, Info, Sparkles, Award } from 'lucide-react';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const eligibilityData = location.state?.eligibilityData;
    const formData = location.state?.profile;

    useEffect(() => {
        if (!eligibilityData) {
            navigate('/check-eligibility');
        }
    }, [eligibilityData, navigate]);

    if (!eligibilityData || !formData) return null;

    const { matchedSchemes = [], recommendations = [], summary = "", score = 0 } = eligibilityData;

    return (
        <div style={{ background: 'transparent', minHeight: 'calc(100vh - 140px)', paddingBottom: '4rem' }}>
            <div className="container" style={{ paddingTop: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--blue)', fontWeight: '800', marginBottom: '1rem' }}>Your Personalized Scheme Results</h1>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <button onClick={() => navigate('/check-eligibility')} className="btn" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', padding: '0.5rem 1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <ChevronLeft size={16} /> Edit Profile
                    </button>
                    <span style={{ color: 'var(--text-secondary)' }}>Profile: {formData.fullName} ({formData.age} yrs)</span>
                </div>

                {/* Summary Card */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.4), rgba(15, 23, 42, 0.8))',
                    backdropFilter: 'blur(10px)', border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '16px', padding: '2rem', marginBottom: '3rem', textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ display: 'inline-flex', background: 'rgba(59, 130, 246, 0.2)', padding: '16px', borderRadius: '50%', color: '#60A5FA', marginBottom: '1rem' }}>
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '1rem' }}>
                        You are eligible for {matchedSchemes.length} government schemes
                    </h2>

                    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', marginBottom: '1.5rem' }}>
                        <p style={{ color: 'var(--slate-200)', fontSize: '1.1rem', lineHeight: '1.6' }}>
                            {summary}
                        </p>
                    </div>

                    <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            <span>Overall Match Score</span>
                            <span style={{ color: '#4ADE80', fontWeight: 'bold' }}>{score}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${score}%`, height: '100%', background: 'var(--saffron)', borderRadius: '4px' }}></div>
                        </div>
                    </div>
                </div>

                {matchedSchemes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(15,23,42,0.6)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Info size={48} color="var(--slate-400)" style={{ margin: '0 auto 1.5rem auto' }} />
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--slate-200)', marginBottom: '1rem' }}>No perfect matches found</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your profile details to broaden the search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <h3 style={{ fontSize: '1.5rem', color: 'white', fontWeight: '700', marginTop: '1rem' }}>Matched Schemes</h3>
                        {matchedSchemes.map((scheme, index) => (
                            <motion.div
                                key={scheme.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{
                                    background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px',
                                    borderLeft: `6px solid var(--saffron)`
                                }}
                            >
                                <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                                        <div>
                                            <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.5rem', fontWeight: '700' }}>{scheme.name}</h2>
                                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}><MapPin size={14} style={{ marginRight: '0.25rem' }} /> {scheme.ministry || "Indian Government"}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', padding: '0.5rem 1rem', borderRadius: '50px', fontWeight: 'bold' }}>
                                            <Activity size={18} style={{ marginRight: '0.5rem' }} /> Eligible
                                        </div>
                                    </div>

                                    <p style={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                        {scheme.description}
                                    </p>

                                    {scheme.eligibilityReason && (
                                        <div style={{ marginBottom: '2rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
                                                <Sparkles size={18} color="var(--blue)" /> Why you qualify
                                            </h4>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                                                {scheme.eligibilityReason}
                                            </p>
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                                        <Link to={`/scheme/${scheme.id}`} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', textDecoration: 'none', fontWeight: '500' }}>
                                            Save Scheme
                                        </Link>
                                        {scheme.applyLink && scheme.applyLink.startsWith('http') ? (
                                            <a href={scheme.applyLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                                                Apply Now <ExternalLink size={16} />
                                            </a>
                                        ) : (
                                            <Link to={`/scheme/${scheme.id}`} className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                                                More Details <ExternalLink size={16} />
                                            </Link>
                                        )}
                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
                
                {recommendations.length > 0 && (
                    <div className="grid grid-cols-1 gap-6" style={{ marginTop: '3rem' }}>
                        <h3 style={{ fontSize: '1.5rem', color: 'white', fontWeight: '700', marginTop: '1rem' }}>Additional Recommendations</h3>
                        {recommendations.map((scheme, index) => (
                            <motion.div
                                key={scheme.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{
                                    background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px',
                                    borderLeft: `4px solid var(--blue)`
                                }}
                            >
                                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <h2 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '0.5rem', fontWeight: '600' }}>{scheme.name}</h2>
                                    </div>
                                    <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                                        {scheme.description}
                                    </p>
                                    {scheme.reason && (
                                        <div style={{ marginTop: 'auto', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                                                <Award size={16} color="var(--blue)" /> Recommendation Reason
                                            </h4>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                                                {scheme.reason}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Results;
