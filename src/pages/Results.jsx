import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, FileText, ExternalLink, MapPin, Users, Info, AlertTriangle, TrendingDown, Hourglass, CalendarClock, Activity, Clock, BarChart } from 'lucide-react';
import { schemesDB } from '../data/schemes';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state?.formData;
    const [matchedSchemes, setMatchedSchemes] = useState([]);
    const [missedOpportunity, setMissedOpportunity] = useState(null);
    const [upcomingOpportunities, setUpcomingOpportunities] = useState([]);

    useEffect(() => {
        if (!formData) {
            navigate('/check-eligibility');
            return;
        }

        const { age: ageStr, income: incomeStr, category, state, occupation, differentlyAbled, gender } = formData;
        const age = parseInt(ageStr, 10);
        const income = parseInt(incomeStr, 10);
        const normalizedCategory = category.toLowerCase();

        // Filter and score logic based on request: Age, Income, Category, State
        const scoredSchemes = schemesDB.map(scheme => {
            const ageMatch = age >= scheme.minAge && age <= scheme.maxAge;
            const incomeMatch = income <= scheme.maxIncome;
            const categoryMatch = scheme.categories.includes(normalizedCategory);
            const stateMatch = scheme.states.includes('All India') || scheme.states.includes(state);

            const genderMatch = !scheme.genders || scheme.genders.includes(gender.toLowerCase());
            const disabledMatch = !scheme.differentlyAbled || scheme.differentlyAbled === differentlyAbled.toLowerCase();

            // STRICT FILTERING
            if (!ageMatch || !incomeMatch || !categoryMatch || !stateMatch || !genderMatch || !disabledMatch) {
                return null;
            }

            // SCORING SYSTEM (Out of 100%)
            let matchScore = 65; // Base score for satisfying strict core criteria

            // 1. Exact Age Priority (+12)
            const ageRange = scheme.maxAge - scheme.minAge;
            if (ageRange <= 15) matchScore += 12; // Highly targeted age group (e.g. students)
            else if (ageRange <= 40) matchScore += 7;
            else matchScore += 2;

            // 2. Exact Income Match Priority (+12)
            if (scheme.maxIncome !== Infinity) {
                matchScore += 10;
                // Bonus for being well within the limit (high priority)
                if (income <= scheme.maxIncome * 0.5) matchScore += 2;
            } else {
                matchScore += 3;
            }

            // 3. Category Priority (+8)
            if (!scheme.categories.includes('general')) {
                matchScore += 8; // Scheme strictly prioritizes reserved categories
            } else if (normalizedCategory !== 'general') {
                matchScore += 3; // Generic scheme but inclusive
            }

            // 4. Exact State Priority (+5)
            if (!scheme.states.includes('All India')) {
                matchScore += 5; // State-exclusive scheme
            }

            // 5. Occupation Specificity (+3)
            if (scheme.occupations && scheme.occupations.includes(occupation.toLowerCase())) {
                if (scheme.occupations.length <= 2) matchScore += 3; // Specific occupation (e.g. Farmers only)
                else matchScore += 1;
            }

            // Cap score cleanly at 99% for realism (100% is rare)
            if (matchScore > 99) matchScore = 99;

            // Calculate advanced probability metrics
            let approvalProb = Math.min(99, matchScore + Math.floor(Math.random() * 6 - 2));
            const processingTime = Math.floor(Math.random() * 31) + 15; // 15 to 45 days

            let compLevel = 'High';
            let probColor = '#EF4444'; // Red

            if (approvalProb >= 80) {
                compLevel = 'Low'; // High probability -> Less restrictive -> Low competition
                probColor = '#10B981'; // Green
            } else if (approvalProb >= 60) {
                compLevel = 'Medium';
                probColor = '#F59E0B'; // Yellow
            }

            return { ...scheme, matchScore, approvalProb, processingTime, compLevel, probColor };
        }).filter(Boolean); // Remove nulls (filtered out schemes)

        // Rank schemes by score descending
        scoredSchemes.sort((a, b) => b.matchScore - a.matchScore);

        // Keep only Top 3 most relevant schemes
        setMatchedSchemes(scoredSchemes.slice(0, 3));

        // -- MISSED BENEFIT DETECTOR LOGIC --
        // Check if user was eligible for schemes in the past 1-3 years 
        // Logic: Try to find a high-value active scheme they qualify for now and technically qualified for historically based on age bounds.
        const highestValueScheme = scoredSchemes.find(s => s.yearlyValue);

        if (highestValueScheme) {
            // Assume 3 missed years for demo structure if their age allows it, otherwise scale down
            const yearsEligible = Math.min(3, Math.max(1, age - highestValueScheme.minAge));

            if (yearsEligible > 0) {
                const totalMissed = highestValueScheme.yearlyValue * yearsEligible;
                setMissedOpportunity({
                    schemeName: highestValueScheme.name,
                    years: yearsEligible,
                    amount: totalMissed
                });
            }
        }

        // -- FUTURE ELIGIBILITY PREDICTOR LOGIC --
        const upcoming = [];
        schemesDB.forEach(scheme => {
            const categoryMatch = scheme.categories.includes(normalizedCategory);
            const stateMatch = scheme.states.includes('All India') || scheme.states.includes(state);
            const genderMatch = !scheme.genders || scheme.genders.includes(gender.toLowerCase());

            // Core constraints must still match (State, Gender, Category)
            if (!categoryMatch || !stateMatch || !genderMatch) return;

            // Check if they are currently failing due to Age constraint alone (Target: Under-age by < 3 years)
            const incomeMatch = income <= scheme.maxIncome;
            if (incomeMatch && age < scheme.minAge) {
                const yearsUntil = scheme.minAge - age;
                if (yearsUntil <= 3) {
                    upcoming.push({
                        ...scheme,
                        predictionType: 'age',
                        predictionReason: `You will become eligible for ${scheme.name} in ${yearsUntil} year${yearsUntil > 1 ? 's' : ''}.`,
                        unlockYear: new Date().getFullYear() + yearsUntil,
                        countdown: yearsUntil
                    });
                    return; // Skip checking income if we already registered it
                }
            }

            // Check if they are currently failing due to Income constraint alone (Target: Barely over by < 20%)
            const ageMatchStrict = age >= scheme.minAge && age <= scheme.maxAge;
            if (ageMatchStrict && scheme.maxIncome !== Infinity && income > scheme.maxIncome) {
                const limitAllowed = scheme.maxIncome * 1.20; // Accept if they are within 20% of the maximum
                if (income <= limitAllowed) {
                    upcoming.push({
                        ...scheme,
                        predictionType: 'income',
                        predictionReason: `If your income drops to ₹${scheme.maxIncome.toLocaleString('en-IN')}, you can formally apply for ${scheme.name}.`,
                        unlockYear: 'Income Dependent',
                        countdown: null
                    });
                }
            }
        });

        // Dedup and set up avoiding current matches
        const uniqueUpcoming = upcoming.filter(u => !scoredSchemes.map(s => s.id).includes(u.id)).slice(0, 2);
        setUpcomingOpportunities(uniqueUpcoming);

    }, [formData, navigate]);

    if (!formData) return null;

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

                    {matchedSchemes.length > 0 && (
                        <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                <span>Overall Match Score</span>
                                <span style={{ color: '#4ADE80', fontWeight: 'bold' }}>{matchedSchemes[0].matchScore}%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${matchedSchemes[0].matchScore}%`, height: '100%', background: 'var(--saffron)', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                    )}
                </div>

                {matchedSchemes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(15,23,42,0.6)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Info size={48} color="var(--slate-400)" style={{ margin: '0 auto 1.5rem auto' }} />
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--slate-200)', marginBottom: '1rem' }}>No perfect matches found</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your profile details to broaden the search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
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
                                                <span style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}><MapPin size={14} style={{ marginRight: '0.25rem' }} /> {scheme.states.join(', ')}</span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', padding: '0.5rem 1rem', borderRadius: '50px', fontWeight: 'bold' }}>
                                            <Activity size={18} style={{ marginRight: '0.5rem' }} /> {scheme.matchScore}% Match
                                        </div>
                                    </div>

                                    <p style={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                        {scheme.shortDesc || scheme.description}
                                    </p>

                                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                        <div>
                                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Benefit Amount</span>
                                            <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>₹{scheme.benefitAmount || 'Variable'}</div>
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '2rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
                                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--text-primary)', margin: '0 0 1rem 0' }}>
                                            <FileText size={18} color="var(--blue)" /> Required Documents
                                        </h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {scheme.documents && scheme.documents.map((doc, i) => (
                                                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                    <CheckCircle2 size={12} color="var(--saffron)" /> {doc}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                                        <Link to={`/scheme/${scheme.id}`} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'white', textDecoration: 'none', fontWeight: '500' }}>
                                            Save Scheme
                                        </Link>
                                        <Link to={`/scheme/${scheme.id}`} className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                                            Apply Now <ExternalLink size={16} />
                                        </Link>
                                    </div>

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
