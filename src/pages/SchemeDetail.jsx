import React, { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, FileText, UploadCloud, CheckCircle, Clock, Check, ChevronLeft, Loader } from 'lucide-react';
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
            <div className="container" style={{ position: 'relative', zIndex: 10, padding: '2rem 1.5rem' }}>
                <Link to="/schemes" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--blue)', marginBottom: '2rem', textDecoration: 'none', fontWeight: '500' }}>
                    <ChevronLeft size={20} /> {t('back_to_directory')}
                </Link>

                <div className="grid lg:grid-cols-3" style={{ gap: '2rem' }}>

                    {/* Main Detail Section */}
                    <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{
                            background: 'rgba(15, 23, 42, 0.65)', borderRadius: '18px', padding: '2rem',
                            backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'var(--chat-bg-user)', padding: '16px', borderRadius: '16px', color: 'var(--blue)' }}>
                                    <ShieldCheck size={40} />
                                </div>
                                <button onClick={() => toggleSaveScheme(scheme)} className="btn" style={{ background: saved ? 'rgba(34, 197, 94, 0.1)' : 'var(--overlay-tint)', color: saved ? '#4ade80' : 'var(--text-primary)', border: saved ? '1px solid #4ade80' : '1px solid var(--card-border)' }}>
                                    {saved ? t('saved') : t('save_scheme')}
                                </button>
                            </div>

                            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', color: 'white' }}>{scheme.name}</h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                                {scheme.desc || scheme.shortDesc}
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem' }}>
                                <div style={{ background: 'var(--overlay-tint)', padding: '1rem', borderRadius: '12px', flex: 1, minWidth: '150px' }}>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{t('benefit_amount')}</div>
                                    <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.25rem' }}>{scheme.benefits || 'Variable'}</div>
                                </div>
                                <div style={{ background: 'var(--overlay-tint)', padding: '1rem', borderRadius: '12px', flex: 1, minWidth: '150px' }}>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{t('eligibility')}</div>
                                    <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.25rem' }}>{t('view_criteria')}</div>
                                </div>
                                <div style={{ background: 'var(--overlay-tint)', padding: '1rem', borderRadius: '12px', flex: 1, minWidth: '150px' }}>
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{t('time_to_process')}</div>
                                    <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.25rem' }}>14-21 Days</div>
                                </div>
                            </div>
                        </div>

                        {/* Document Checklist & Upload */}
                        <div style={{
                            background: 'rgba(15, 23, 42, 0.65)', borderRadius: '18px', padding: '2rem',
                            backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)'
                        }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FileText color="var(--blue)" /> {t('smart_doc_setup')}
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '600' }}>{t('required_docs')}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                        {scheme.documents}
                                    </p>
                                </div>

                                <div>
                                    <div {...getRootProps()} style={{
                                        border: `2px dashed ${isDragActive ? '#3b82f6' : 'rgba(255,255,255,0.2)'}`,
                                        borderRadius: '16px', padding: '2rem 1rem', textAlign: 'center',
                                        background: isDragActive ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0,0,0,0.2)',
                                        cursor: 'pointer', transition: 'all 0.2s', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        <input {...getInputProps()} />
                                        <UploadCloud size={40} color="var(--blue)" style={{ marginBottom: '1rem' }} />
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
                                            {isDragActive ? t('drop_instruction') : t('upload_instruction')}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {uploadedFiles.length > 0 && (
                                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                                    <h4 style={{ color: '#4ade80', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check size={16} /> {uploadedFiles.length} files attached</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {uploadedFiles.map((f, i) => (
                                            <span key={i} style={{ fontSize: '0.8rem', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>{f.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Action Panel */}
                    <div className="lg:col-span-1" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.4), rgba(15, 23, 42, 0.8))',
                            borderRadius: '18px', padding: '2rem',
                                backdropFilter: 'blur(10px)', border: '1px solid var(--blue)', position: 'sticky', top: '100px'
                        }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>{t('ready_to_apply')}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5' }}>
                                {t('apply_desc')}
                            </p>
                            <button onClick={handleApply} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                {t('submit_application')} <CheckCircle size={18} />
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', justifyContent: 'center' }}>
                                <Clock size={14} /> {t('app_timer')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchemeDetail;
