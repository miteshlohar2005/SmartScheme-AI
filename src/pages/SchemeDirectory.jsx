import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Loader, AlertCircle, Sparkles, ChevronRight } from 'lucide-react';
import { fetchSchemes, getAIRecommendations } from '../services/schemeApi';
import SchemeCard from '../components/SchemeCard';
import { useTranslation } from 'react-i18next';

const SchemeSkeleton = () => (
    <div className="card" style={{
        background: 'var(--skeleton-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '16px',
        padding: '1.5rem',
        height: '100%',
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column',
    }}>
        <div className="skeleton-pulse" style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--overlay-tint)', marginBottom: '1rem' }}></div>
        <div className="skeleton-pulse" style={{ width: '70%', height: '20px', borderRadius: '4px', background: 'var(--overlay-tint)', marginBottom: '0.75rem' }}></div>
        <div className="skeleton-pulse" style={{ width: '100%', height: '14px', borderRadius: '4px', background: 'var(--overlay-tint)', marginBottom: '0.5rem' }}></div>
        <div className="skeleton-pulse" style={{ width: '90%', height: '14px', borderRadius: '4px', background: 'var(--overlay-tint)', marginBottom: '1.5rem' }}></div>
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
            <div className="skeleton-pulse" style={{ width: '60px', height: '24px', borderRadius: '4px', background: 'var(--overlay-tint)' }}></div>
            <div className="skeleton-pulse" style={{ width: '90px', height: '32px', borderRadius: '8px', background: 'var(--overlay-tint)' }}></div>
        </div>
    </div>
);
const SchemeDirectory = () => {
    const { t, i18n } = useTranslation();
    const language = i18n.language;

    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // AI Recommendation State
    const [aiProfile, setAiProfile] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResults, setAiResults] = useState([]);

    // Filters and Pagination State
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [stateFilter, setStateFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const categories = ["All", "Agriculture", "Women", "Education", "Health", "Startup", "Housing"];
    const states = ["All", "Central", "Maharashtra", "Uttar Pradesh", "Karnataka"]; // Expand as needed

    // Debounced Search implementation
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 400); // 400ms delay helps prevent rapid re-fetching
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Main Fetch Logic
    const loadSchemes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchSchemes({
                page,
                itemsPerPage: 12,
                searchQuery: debouncedSearch,
                categoryFilter: category,
                stateFilter,
                language
            });

            setSchemes(response.data);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError("Failed to load schemes. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, category, stateFilter, language]);

    const handleGetRecommendations = async () => {
        if (!aiProfile) return;
        setAiLoading(true);
        try {
            const recs = await getAIRecommendations(aiProfile, language);
            setAiResults(recs);
        } catch (err) {
            console.error(err);
        } finally {
            setAiLoading(false);
        }
    };

    // Refetch when dependencies change
    useEffect(() => {
        loadSchemes();
    }, [loadSchemes]);

    // Reset to page 1 if filters change
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, category, stateFilter]);

    return (
        <div style={{ padding: '3rem 1.5rem', minHeight: '80vh', background: 'transparent' }}>
            <div className="container">
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: '800', marginBottom: '1rem' }}>
                        {t('directory_title')}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        {t('directory_desc')}
                    </p>
                </div>

                {/* AI Recommendation Widget */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
                    border: '1px solid rgba(96, 165, 250, 0.3)',
                    borderRadius: '16px',
                    padding: '2rem',
                    marginBottom: '3rem',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'var(--blue)', padding: '10px', rounded: '12px', borderRadius: '12px' }}>
                            <Sparkles color="white" size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>{t('ai_matcher_title')}</h2>
                            <p style={{ color: 'var(--blue)', fontSize: '0.9rem' }}>{t('ai_matcher_desc')}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <select
                            value={aiProfile}
                            onChange={(e) => setAiProfile(e.target.value)}
                            style={{
                                flex: 1,
                                minWidth: '200px',
                                padding: '1rem',
                                borderRadius: '12px',
                                background: 'rgba(15, 23, 42, 0.6)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: 'white',
                                fontSize: '1.05rem',
                                outline: 'none'
                            }}
                        >
                            <option value="" style={{ color: 'black' }}>Select your profile...</option>
                            <option value="farmer agriculture rural" style={{ color: 'black' }}>Farmer / Agricultural Worker</option>
                            <option value="student education scholar" style={{ color: 'black' }}>Student / Scholar</option>
                            <option value="women girl empowerment" style={{ color: 'black' }}>Women & Girl Child</option>
                            <option value="startup business msme loan" style={{ color: 'black' }}>Startup / Small Business Owner</option>
                            <option value="health medical treatment" style={{ color: 'black' }}>Seeking Health Benefits</option>
                        </select>

                        <button
                            onClick={handleGetRecommendations}
                            disabled={!aiProfile || aiLoading}
                            className="btn btn-primary"
                            style={{ padding: '1rem 2rem', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            {aiLoading ? <Loader className="animate-spin" size={20} /> : <Sparkles size={20} />}
                            {aiLoading ? t('ai_matcher_loading') : t('ai_matcher_btn')}
                        </button>
                    </div>

                    {/* AI Results */}
                    {aiResults.length > 0 && (
                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--overlay-tint)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                            <h3 style={{ color: 'var(--saffron)', marginBottom: '1rem', fontSize: '1.1rem' }}>{t('ai_matcher_results')}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {aiResults.map(rec => (
                                    <div key={rec.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                        <div>
                                            <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '4px' }}>{rec.name}</h4>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{rec.shortDesc}</p>
                                        </div>
                                        <button onClick={() => setSearchQuery(rec.name)} style={{ background: 'transparent', border: 'none', color: 'var(--blue-light)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                            View <ChevronRight size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Filter and Search Bar */}
                <div style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    marginBottom: '3rem',
                    border: '1px solid var(--card-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}>

                    {/* Top Row: Search */}
                    <div style={{ position: 'relative', width: '100%' }}>
                        <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Try searching for 'farmer loan', 'women education'..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                borderRadius: '12px',
                                background: 'rgba(15, 23, 42, 0.6)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                fontSize: '1.05rem',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>

                    {/* Bottom Row: Select Filters */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        {/* Category Filter */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Filter size={18} color="var(--slate-400)" />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--slate-200)', outline: 'none', width: '100%', fontSize: '0.95rem' }}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat} style={{ color: 'black' }}>{cat === 'All' ? 'All Categories' : cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* State Filter */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Filter size={18} color="var(--slate-400)" />
                            <select
                                value={stateFilter}
                                onChange={(e) => setStateFilter(e.target.value)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--slate-200)', outline: 'none', width: '100%', fontSize: '0.95rem' }}
                            >
                                {states.map(state => (
                                    <option key={state} value={state} style={{ color: 'black' }}>{state === 'All' ? 'All States (Central)' : state}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Info */}
                {!loading && !error && (
                    <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        {t('results_count', { count: schemes.length })}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <SchemeSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5rem 0', color: '#ef4444' }}>
                        <AlertCircle size={30} style={{ marginRight: '0.5rem' }} />
                        <span style={{ fontSize: '1.1rem' }}>{error}</span>
                    </div>
                ) : schemes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 0', background: 'var(--overlay-tint)', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
                        <Search size={50} color="var(--slate-700)" style={{ margin: '0 auto 1rem auto' }} />
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{t('no_matches')}</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>{t('no_matches_desc')}</p>
                    </div>
                ) : (
                    /* Grid Layout */
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {schemes.map(scheme => (
                            <div key={scheme.id}>
                                <SchemeCard scheme={scheme} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '4rem', gap: '1rem' }}>
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="btn"
                            style={{ background: page === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)', color: page === 1 ? 'var(--slate-500)' : 'white' }}
                        >
                            {t('previous')}
                        </button>
                        <span style={{ color: 'var(--slate-300)', fontWeight: '500' }}>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="btn"
                            style={{ background: page === totalPages ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)', color: page === totalPages ? 'var(--slate-500)' : 'white' }}
                        >
                            {t('next')}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SchemeDirectory;
