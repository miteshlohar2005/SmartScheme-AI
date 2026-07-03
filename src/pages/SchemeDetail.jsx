import React, { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, FileText, UploadCloud, CheckCircle, Clock, Check, ChevronLeft, Loader, ExternalLink, Bookmark, BookmarkCheck, Share2, Info, Building2, Tag, Calendar, Activity, Database, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';
import { useDropzone } from 'react-dropzone';
import { fetchSchemeById } from '../services/schemeApi';

const SchemeDetail = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const language = i18n.language;
    const { applyForScheme, toggleSaveScheme, isSchemeSaved } = useUser();

    const [scheme, setScheme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {
        const loadScheme = async () => {
            setLoading(true);
            const data = await fetchSchemeById(id, language);
            setScheme(data);
            setLoading(false);
        };
        loadScheme();
    }, [id, language]);

    const onDrop = useCallback(acceptedFiles => {
        setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleApply = () => {
        if (uploadedFiles.length === 0) {
            alert("Please upload at least one required document to proceed.");
            return;
        }
        applyForScheme(scheme);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: scheme?.name,
                    text: scheme?.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.error("Error sharing", err);
            }
        } else {
            alert("Share feature is not supported in your browser.");
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-secondary)' }}>
            <Loader className="animate-spin" size={48} style={{ marginBottom: '1rem', color: 'var(--blue)' }} />
            <p>Loading scheme details...</p>
        </div>
    );

    if (!scheme) return <div className="container" style={{ padding: '5rem', color: 'white', textAlign: 'center' }}>Scheme not found</div>;

    const saved = isSchemeSaved(scheme.id);

    return (
        <div style={{ background: 'transparent', minHeight: 'calc(100vh - 140px)', paddingBottom: '4rem', color: 'var(--text-primary)' }}>
            <style>{`
                .scheme-detail-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2rem;
                    align-items: start;
                }
                @media (min-width: 1024px) {
                    .scheme-detail-grid {
                        grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
                    }
                }
                .detail-section {
                    background: rgba(15, 23, 42, 0.65);
                    border-radius: 18px;
                    padding: 2rem;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    margin-bottom: 2rem;
                }
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    margin-bottom: 0.75rem;
                }
                .meta-icon {
                    color: var(--blue);
                    background: rgba(59, 130, 246, 0.1);
                    padding: 8px;
                    border-radius: 8px;
                }
                .meta-content div:first-child {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    margin-bottom: 2px;
                }
                .meta-content div:last-child {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .action-btn {
                    width: 100%;
                    padding: 1rem;
                    font-size: 1.05rem;
                    font-weight: 600;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.75rem;
                    border-radius: 12px;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .action-btn-primary {
                    background: var(--blue);
                    color: white;
                    border: none;
                }
                .action-btn-primary:hover {
                    background: var(--blue-light);
                }
                .action-btn-secondary {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .action-btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
            
            <div className="container" style={{ position: 'relative', zIndex: 10, padding: '2rem 1.5rem' }}>
                <Link to="/schemes" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--blue)', marginBottom: '2rem', textDecoration: 'none', fontWeight: '500', width: 'fit-content' }}>
                    <ChevronLeft size={20} /> {t('back_to_directory')}
                </Link>

                <div className="scheme-detail-grid">
                    {/* Left Column (68-72%) */}
                    <div>
                        {/* Scheme Header & Description */}
                        <div className="detail-section">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'var(--chat-bg-user)', padding: '16px', borderRadius: '16px', color: 'var(--blue)' }}>
                                    <ShieldCheck size={36} />
                                </div>
                                <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'white', lineHeight: '1.2' }}>{scheme.name}</h1>
                            </div>

                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '0' }}>
                                {scheme.description || scheme.shortDesc || scheme.desc}
                            </p>
                        </div>

                        {/* Benefits & Eligibility */}
                        <div className="detail-section">
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                                <CheckCircle color="var(--green)" size={24} /> Eligibility & Benefits
                            </h2>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <h3 style={{ color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: '0.5rem', fontWeight: '600' }}>Benefits Provided</h3>
                                    <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '1rem', borderRadius: '12px', color: 'var(--slate-200)', lineHeight: '1.6' }}>
                                        {scheme.benefits || 'Check official guidelines for complete benefit details.'}
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 style={{ color: 'var(--text-primary)', fontSize: '1.05rem', marginBottom: '0.5rem', fontWeight: '600' }}>Eligibility Criteria</h3>
                                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1rem', borderRadius: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                        {scheme.eligibility || 'Check official guidelines for complete eligibility criteria.'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Required Documents */}
                        <div className="detail-section">
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white' }}>
                                <FileText color="var(--blue)" size={24} /> Required Documents
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', background: 'rgba(255, 255, 255, 0.02)', padding: '1.5rem', borderRadius: '12px', height: '100%' }}>
                                        {Array.isArray(scheme.documents) && scheme.documents.length > 0 ? (
                                            <ul style={{ paddingLeft: '1.2rem', listStyleType: 'disc', margin: 0 }}>
                                                {scheme.documents.map((doc, i) => <li key={i} style={{ marginBottom: '0.5rem' }}>{doc}</li>)}
                                            </ul>
                                        ) : (
                                            <p style={{ margin: 0 }}>{scheme.documents || 'Refer to official guidelines.'}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div {...getRootProps()} style={{
                                        border: `2px dashed ${isDragActive ? '#3b82f6' : 'rgba(255,255,255,0.2)'}`,
                                        borderRadius: '12px', padding: '2rem 1rem', textAlign: 'center',
                                        background: isDragActive ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.2)',
                                        cursor: 'pointer', transition: 'all 0.2s', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        <input {...getInputProps()} />
                                        <UploadCloud size={36} color="var(--blue)" style={{ marginBottom: '1rem' }} />
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
                                            {isDragActive ? t('drop_instruction') : t('upload_instruction')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {uploadedFiles.length > 0 && (
                                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                                    <h4 style={{ color: '#4ade80', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> {uploadedFiles.length} files attached</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {uploadedFiles.map((f, i) => (
                                            <span key={i} style={{ fontSize: '0.8rem', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>{f.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Source */}
                        <div className="detail-section" style={{ padding: '1.5rem 2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Database size={20} color="var(--slate-400)" />
                                <div>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: '0.5rem' }}>Data Source:</span>
                                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{scheme.source || 'National Scheme Directory'}</strong>
                                </div>
                            </div>
                        </div>

                        {/* AI Summary (Mock Section) */}
                        <div className="detail-section" style={{ border: '1px solid rgba(168, 85, 247, 0.3)', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(88, 28, 135, 0.15))' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc' }}>
                                <Sparkles size={20} /> AI Summary
                            </h2>
                            <p style={{ color: 'var(--slate-300)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
                                Based on our AI analysis, this scheme is highly relevant for individuals meeting the primary criteria set by the <strong>{scheme.ministry || 'government'}</strong>. It provides substantial benefits (<strong>{scheme.benefits ? 'Available' : 'Variable'}</strong>) and requires standard documentation. Ensure your profile is up to date before applying.
                            </p>
                        </div>

                        {/* Related Schemes (Mock Section) */}
                        <div className="detail-section">
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: 'white' }}>Related Schemes</h2>
                            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                {[1, 2].map(i => (
                                    <div key={i} style={{ minWidth: '250px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '1rem' }}>
                                        <div style={{ width: '40px', height: '4px', background: 'var(--blue)', borderRadius: '2px', marginBottom: '0.75rem' }}></div>
                                        <h4 style={{ color: 'white', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Similar {scheme.category || 'Government'} Scheme</h4>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>Explore more benefits in this category...</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column (28-32%) */}
                    <div style={{ position: 'sticky', top: '100px' }}>
                        
                        {/* Action Box */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.4), rgba(15, 23, 42, 0.8))',
                            borderRadius: '18px', padding: '2rem',
                            backdropFilter: 'blur(10px)', border: '1px solid var(--blue)',
                            marginBottom: '1.5rem'
                        }}>
                            
                            {scheme.applyLink && (
                                <a href={scheme.applyLink} target="_blank" rel="noopener noreferrer" className="action-btn action-btn-primary">
                                    Apply Official <ExternalLink size={18} />
                                </a>
                            )}
                            
                            {scheme.officialWebsite && (
                                <a href={scheme.officialWebsite} target="_blank" rel="noopener noreferrer" className="action-btn action-btn-secondary">
                                    Official Website <ExternalLink size={18} />
                                </a>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                                <button onClick={() => toggleSaveScheme(scheme)} className="action-btn action-btn-secondary" style={{ margin: 0, fontSize: '0.9rem', color: saved ? '#4ade80' : 'white', borderColor: saved ? '#4ade80' : 'rgba(255,255,255,0.1)' }}>
                                    {saved ? <><BookmarkCheck size={16} /> Saved</> : <><Bookmark size={16} /> Bookmark</>}
                                </button>
                                
                                <button onClick={handleShare} className="action-btn action-btn-secondary" style={{ margin: 0, fontSize: '0.9rem' }}>
                                    <Share2 size={16} /> Share
                                </button>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1.5rem 0' }} />

                            <div style={{ textAlign: 'center' }}>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--slate-300)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SmartScheme Assistant</h4>
                                <button onClick={handleApply} className="action-btn" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe', border: '1px solid rgba(168, 85, 247, 0.4)' }}>
                                    <Sparkles size={18} /> Check Eligibility
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem', justifyContent: 'center' }}>
                                    <Clock size={12} /> AI processing takes ~2 seconds
                                </div>
                            </div>
                        </div>

                        {/* Meta Data Box */}
                        <div style={{
                            background: 'rgba(15, 23, 42, 0.65)',
                            borderRadius: '18px', padding: '1.5rem',
                            backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)'
                        }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Info size={18} color="var(--blue-light)" /> Key Information
                            </h3>

                            <div className="meta-item">
                                <Building2 size={18} className="meta-icon" />
                                <div className="meta-content">
                                    <div>Ministry / Department</div>
                                    <div>{scheme.ministry || 'Government of India'}</div>
                                </div>
                            </div>

                            <div className="meta-item">
                                <Tag size={18} className="meta-icon" style={{ color: 'var(--saffron)', background: 'rgba(245, 158, 11, 0.1)' }} />
                                <div className="meta-content">
                                    <div>Category</div>
                                    <div>{scheme.category || 'General'}</div>
                                </div>
                            </div>

                            <div className="meta-item">
                                <Activity size={18} className="meta-icon" style={{ color: scheme.status === 'Closed' ? 'var(--red)' : 'var(--green)', background: scheme.status === 'Closed' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)' }} />
                                <div className="meta-content">
                                    <div>Status</div>
                                    <div>{scheme.status || 'Active'}</div>
                                </div>
                            </div>

                            <div className="meta-item">
                                <ShieldCheck size={18} className="meta-icon" style={{ color: '#c084fc', background: 'rgba(168, 85, 247, 0.1)' }} />
                                <div className="meta-content">
                                    <div>Government Level</div>
                                    <div>{scheme.governmentLevel || 'Central Sector'}</div>
                                </div>
                            </div>

                            <div className="meta-item">
                                <Calendar size={18} className="meta-icon" style={{ color: 'var(--slate-300)', background: 'rgba(255, 255, 255, 0.05)' }} />
                                <div className="meta-content">
                                    <div>Launch Year</div>
                                    <div>{scheme.launchYear || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchemeDetail;
