import React from 'react';
import { useUser } from '../context/UserContext';
import SchemeCard from '../components/SchemeCard';
import { Bookmark, Search } from 'lucide-react';

const SavedSchemes = () => {
    const { savedSchemes } = useUser();

    return (
        <div style={{ padding: '3rem 1.5rem', minHeight: '80vh', background: 'transparent' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ display: 'inline-flex', background: 'rgba(59, 130, 246, 0.2)', padding: '16px', borderRadius: '50%', color: 'var(--blue)', marginBottom: '1rem' }}>
                        <Bookmark size={40} />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--slate-50)', fontWeight: '800', marginBottom: '1rem' }}>
                        Saved Schemes
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        Your personal collection of bookmarked government schemes.
                    </p>
                </div>

                {savedSchemes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 0', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Search size={50} color="var(--slate-600)" style={{ margin: '0 auto 1rem auto' }} />
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--slate-300)', marginBottom: '0.5rem' }}>No saved schemes yet</h3>
                        <p style={{ color: 'var(--slate-500)' }}>Explore the directory and bookmark schemes you are interested in.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedSchemes.map(scheme => (
                            <SchemeCard key={scheme.id} scheme={scheme} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedSchemes;
