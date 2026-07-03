import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, ExternalLink, Download, Clock, ShieldCheck, MapPin, ArrowRightLeft, Check, Plus, ChevronRight, Share2, Building2, CheckCircle2, Gift } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';
import { useUser } from '../context/UserContext';

const SchemeCard = memo(({ scheme }) => {
    const { t, i18n } = useTranslation();
    const language = i18n.language;
    const { toggleSaveScheme, isSchemeSaved, toggleCompareScheme, isSchemeCompared } = useUser();
    const saved = isSchemeSaved(scheme.id);
    const compared = isSchemeCompared(scheme.id);

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text(scheme.name || "Government Scheme", 10, 20);

        doc.setFontSize(12);
        doc.text(`Ministry: ${scheme.ministry || 'N/A'}`, 10, 30);
        doc.text(`Category: ${scheme.category || 'N/A'}`, 10, 40);
        doc.text(`Level: ${scheme.governmentLevel || 'N/A'}`, 10, 50);

        doc.setFontSize(14);
        doc.text("Description:", 10, 65);
        doc.setFontSize(11);

        const splitDesc = doc.splitTextToSize(scheme.description || 'N/A', 180);
        doc.text(splitDesc, 10, 75);

        doc.save(`${scheme.id || 'scheme'}_details.pdf`);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: scheme.name,
                    text: scheme.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.error("Error sharing", err);
            }
        } else {
            alert("Share feature is not supported in your browser.");
        }
    };

    return (
        <div className="card scheme-card" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'var(--card-bg)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '1.5rem',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            height: '100%'
        }}>
            <div>
                {/* Header: Icon, Category, Level Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{
                        background: 'var(--chat-bg-user)',
                        padding: '12px',
                        borderRadius: '12px',
                        color: 'var(--blue)'
                    }}>
                        <ShieldCheck size={28} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <span style={{
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: 'var(--saffron)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                        }}>
                            {scheme.category || 'General'}
                        </span>
                        <span style={{
                            background: 'rgba(59, 130, 246, 0.15)',
                            color: 'var(--blue-light)',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                        }}>
                            {scheme.governmentLevel || 'Central'}
                        </span>
                    </div>
                </div>

                {/* Title & Ministry */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                    {scheme.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <Building2 size={14} /> {scheme.ministry || 'Govt of India'}
                </div>

                {/* Description Preview */}
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {scheme.description}
                </p>

                {/* Quick Info (Eligibility, Benefits) */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
                        <CheckCircle2 size={14} color="var(--green)" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span style={{ color: 'var(--slate-300)', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            <strong style={{ color: 'white' }}>Eligible:</strong> {scheme.eligibility || 'Check details'}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <Gift size={14} color="var(--saffron)" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span style={{ color: 'var(--slate-300)', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            <strong style={{ color: 'white' }}>Benefits:</strong> {scheme.benefits || 'Check details'}
                        </span>
                    </div>
                </div>

                {/* Meta Info */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        <Clock size={12} /> Launch: {scheme.launchYear || 'N/A'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: scheme.status === 'Closed' ? 'var(--red)' : 'var(--green)', fontSize: '0.8rem', fontWeight: '500' }}>
                        • {scheme.status || 'Active'}
                    </div>
                </div>
                
                {/* External Links */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {scheme.applyLink && (
                        <a href={scheme.applyLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                            Apply Now <ExternalLink size={14} />
                        </a>
                    )}
                    {scheme.officialWebsite && (
                        <a href={scheme.officialWebsite} target="_blank" rel="noopener noreferrer" className="btn" style={{ flex: scheme.applyLink ? 0 : 1, background: 'rgba(255,255,255,0.05)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                            Website
                        </a>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button onClick={() => toggleSaveScheme(scheme)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: saved ? 'var(--blue-light)' : 'var(--slate-700)', transition: 'color 0.2s', padding: '6px' }} title="Bookmark Scheme">
                        {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                    </button>

                    <button onClick={handleShare} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--slate-700)', transition: 'color 0.2s', padding: '6px' }} title="Share Scheme">
                        <Share2 size={20} />
                    </button>

                    <button onClick={handleDownloadPDF} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--slate-700)', padding: '6px', transition: 'color 0.2s' }} title="Download PDF">
                        <Download size={20} />
                    </button>
                </div>

                <Link to={`/scheme/${scheme.id}`} style={{ color: 'var(--blue-light)', fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                    Details <ChevronRight size={16} />
                </Link>
            </div>
        </div>
    );
});

export default SchemeCard;
