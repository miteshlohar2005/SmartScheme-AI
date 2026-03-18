import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, ExternalLink, Download, Clock, ShieldCheck, MapPin, ArrowRightLeft, Check, Plus, ChevronRight } from 'lucide-react';
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
        doc.text(scheme.name, 10, 20);

        doc.setFontSize(12);
        doc.text(`Category: ${scheme.category}`, 10, 30);
        doc.text(`State: ${scheme.state}`, 10, 40);
        doc.text(`Application Mode: ${scheme.applicationMode}`, 10, 50);

        doc.setFontSize(14);
        doc.text("Description:", 10, 65);
        doc.setFontSize(11);

        // Automatically wraps text
        const splitDesc = doc.splitTextToSize(scheme.desc, 180);
        doc.text(splitDesc, 10, 75);

        // Add more fields as needed...

        doc.save(`${scheme.id}_details.pdf`);
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
                {/* Header: Icon, Category, Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{
                        background: 'var(--chat-bg-user)',
                        padding: '12px',
                        borderRadius: '12px',
                        color: 'var(--blue)'
                    }}>
                        <ShieldCheck size={28} />
                    </div>
                    <span style={{
                        background: 'rgba(245, 158, 11, 0.15)',
                        color: 'var(--saffron)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                    }}>
                        {scheme.category}
                    </span>
                </div>

                {/* Title & Short Description */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                    {scheme.name}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {scheme.shortDesc}
                </p>

                {/* Meta Info */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <MapPin size={14} /> {scheme.state}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <Clock size={14} /> {scheme.launchYear}
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--card-border)', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => toggleSaveScheme(scheme)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: saved ? 'var(--blue-light)' : 'var(--slate-700)', transition: 'color 0.2s', padding: '4px' }} title="Save Scheme">
                        {saved ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
                    </button>

                    <button onClick={() => toggleCompareScheme(scheme)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: compared ? '#A855F7' : 'var(--slate-700)', transition: 'color 0.2s', padding: '4px' }} title="Compare Scheme">
                        {compared ? <Check size={20} /> : <ArrowRightLeft size={20} />}
                    </button>

                    <button onClick={handleDownloadPDF} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px', transition: 'color 0.2s' }} aria-label="Download PDF">
                        <Download size={20} />
                    </button>
                </div>

                <Link to={`/scheme/${scheme.id}`} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.4rem 1rem', fontSize: '0.9rem', borderRadius: '8px', textDecoration: 'none' }}>
                    {t('more_details')} <ChevronRight size={16} />
                </Link>
            </div>
        </div>
    );
});

export default SchemeCard;
