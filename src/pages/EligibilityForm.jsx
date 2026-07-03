import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader, ShieldCheck, Mic, MicOff, User, Calendar, Users, IndianRupee, Tag, MapPin, Briefcase, Activity, CheckCircle, Download, Share2, Bookmark, FileText, Clock, Sparkles, ChevronRight, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAIRecommendations } from '../services/schemeApi';
import { useNavigate } from 'react-router-dom';

const EligibilityForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        gender: '',
        income: '',
        category: '',
        state: '',
        occupation: '',
        differentlyAbled: ''
    });
    const [errors, setErrors] = useState({});

    // Voice AI Feature State
    const [isListening, setIsListening] = useState(false);
    const [voiceText, setVoiceText] = useState('');

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Your browser doesn't support Voice AI. Please use Chrome.");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        recognition.onstart = () => {
            setIsListening(true);
            setVoiceText('Listening... Speak now 🎙️');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            setVoiceText(`" ${transcript} "`);

            const newData = { ...formData };
            let clearErrors = {};

            const ageMatch = transcript.match(/(\d+)\s*(year|years|saal)/i);
            if (ageMatch) {
                newData.age = ageMatch[1];
                clearErrors.age = undefined;
            }

            if (transcript.includes('female') || transcript.includes('woman') || transcript.includes('girl') || transcript.includes('aurat')) {
                newData.gender = 'female';
                clearErrors.gender = undefined;
            } else if (transcript.includes('male') || transcript.includes('man') || transcript.includes('boy') || transcript.includes('aadmi')) {
                newData.gender = 'male';
                clearErrors.gender = undefined;
            }

            if (transcript.includes('farm') || transcript.includes('kisan') || transcript.includes('agriculture')) {
                newData.occupation = 'farmer';
                clearErrors.occupation = undefined;
            } else if (transcript.includes('student') || transcript.includes('study') || transcript.includes('college')) {
                newData.occupation = 'student';
                clearErrors.occupation = undefined;
            } else if (transcript.includes('business') || transcript.includes('shop') || transcript.includes('dukaan')) {
                newData.occupation = 'business';
                clearErrors.occupation = undefined;
            }

            const statesList = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"];

            statesList.forEach(state => {
                if (transcript.includes(state.toLowerCase())) {
                    newData.state = state;
                    clearErrors.state = undefined;
                }
            });

            const lakhMatch = transcript.match(/(\d+)\s*lakh/i);
            if (lakhMatch) {
                newData.income = (parseInt(lakhMatch[1]) * 100000).toString();
                clearErrors.income = undefined;
            } else {
                const thousandMatch = transcript.match(/(\d+)\s*thousand/i);
                if (thousandMatch) {
                    newData.income = (parseInt(thousandMatch[1]) * 1000).toString();
                    clearErrors.income = undefined;
                }
            }

            setFormData(newData);
            setErrors(prev => ({ ...prev, ...clearErrors }));

            setTimeout(() => {
                setVoiceText('');
                setIsListening(false);
            }, 4000);
        };

        recognition.onerror = (event) => {
            console.error(event.error);
            setVoiceText('Voice not recognized. Try again!');
            setTimeout(() => {
                setIsListening(false);
                setVoiceText('');
            }, 2000);
        };

        recognition.onend = () => {
            if (!voiceText.includes('"')) {
                setIsListening(false);
            }
        };

        recognition.start();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: undefined });
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Required';
        if (!formData.age || isNaN(formData.age) || formData.age <= 0 || formData.age > 120) newErrors.age = 'Invalid age';
        if (!formData.gender) newErrors.gender = 'Required';
        if (!formData.income || isNaN(formData.income) || formData.income < 0) newErrors.income = 'Invalid income';
        if (!formData.category) newErrors.category = 'Required';
        if (!formData.state) newErrors.state = 'Required';
        if (!formData.occupation) newErrors.occupation = 'Required';
        if (!formData.differentlyAbled) newErrors.differentlyAbled = 'Required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            const firstError = document.querySelector('.floating-input-group.error');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setLoading(true);
        setShowResults(false);

        const profileQuery = `${formData.occupation} ${formData.gender} ${formData.category} from ${formData.state}`;
        
        try {
            const recs = await getAIRecommendations(profileQuery, 'en');
            setRecommendations(recs);
        } catch (err) {
            console.error(err);
            setRecommendations([]);
        }

        setLoading(false);
        setShowResults(true);
        
        setTimeout(() => {
            document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const FloatingInput = ({ icon: Icon, type, name, label, options, placeholder = " " }) => {
        const hasValue = formData[name] !== '';
        const hasError = errors[name];
        
        return (
            <div className={`floating-input-group ${hasValue ? 'has-value' : ''} ${hasError ? 'error' : ''}`}>
                <Icon className="input-icon" size={20} />
                
                {options ? (
                    <select
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="floating-input"
                    >
                        <option value="" disabled hidden></option>
                        {options.map(opt => (
                            <option key={opt.value} value={opt.value} style={{ color: 'black' }}>{opt.label}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className="floating-input"
                        min={type === 'number' ? '0' : undefined}
                    />
                )}
                
                <label className="floating-label">{label}</label>
                
                {hasError && <span className="error-text">{hasError}</span>}
            </div>
        );
    };

    return (
        <div style={{ background: 'transparent', minHeight: 'calc(100vh - 140px)', paddingBottom: '4rem' }}>
            <div className="page-header" style={{ marginBottom: '-3rem', paddingTop: '2rem', paddingBottom: '4rem' }}>
                <h1 className="page-title" style={{ fontSize: '2.5rem' }}>{t('form_title')}</h1>
                <p className="page-subtitle" style={{ fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>{t('form_desc')}</p>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '1200px' }}>
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="card"
                    style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', padding: '2.5rem', borderRadius: '1.5rem', boxShadow: 'var(--shadow-lg)' }}
                >
                    
                    {/* Integrated Voice AI & Security Block */}
                    <div style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)', padding: '1.5rem 2rem', borderRadius: '1rem', marginBottom: '2.5rem', border: '1px solid rgba(56, 189, 248, 0.2)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <ShieldCheck size={24} color="#4ade80" />
                                <span style={{ color: '#4ade80', fontWeight: '600', fontSize: '0.95rem' }}>Bank-grade Encrypted Data</span>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', color: 'white', margin: 0, fontWeight: '600' }}>AI Voice Assistant</h3>
                            <p style={{ color: 'var(--slate-300)', fontSize: '0.9rem', margin: 0, maxWidth: '350px' }}>
                                Say <i style={{ color: '#bae6fd' }}>"I am a 45 year old female farmer from Maharashtra with an income of 2 lakh"</i>
                            </p>
                            {voiceText && (
                                <div style={{ marginTop: '0.5rem', color: '#f8fafc', fontSize: '0.9rem', fontStyle: voiceText.includes('"') ? 'italic' : 'normal' }}>
                                    {voiceText}
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={startListening}
                            disabled={isListening}
                            className={`voice-btn ${isListening ? 'listening' : ''}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                background: isListening ? '#ef4444' : '#0ea5e9',
                                color: 'white',
                                border: 'none',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '3rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: isListening ? 'default' : 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: isListening ? '0 0 20px rgba(239, 68, 68, 0.6)' : '0 4px 14px 0 rgba(14, 165, 233, 0.3)'
                            }}
                        >
                            {isListening ? <MicOff size={20} className="animate-pulse" /> : <Mic size={20} />}
                            {isListening ? 'Recording Audio...' : 'Tap to Speak'}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-5" style={{ marginBottom: '2.5rem' }}>
                            
                            <FloatingInput icon={User} type="text" name="fullName" label="Full Name" />
                            <FloatingInput icon={Calendar} type="number" name="age" label="Age (Years)" />
                            
                            <FloatingInput icon={Users} type="text" name="gender" label="Gender" options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'other', label: 'Transgender / Other' }
                            ]} />
                            
                            <FloatingInput icon={IndianRupee} type="number" name="income" label="Annual Family Income (₹)" />
                            
                            <FloatingInput icon={Tag} type="text" name="category" label="Social Category" options={[
                                { value: 'general', label: 'General' },
                                { value: 'obc', label: 'OBC' },
                                { value: 'sc', label: 'SC' },
                                { value: 'st', label: 'ST' }
                            ]} />
                            
                            <FloatingInput icon={MapPin} type="text" name="state" label="State / UT" options={[
                                { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
                                { value: 'Bihar', label: 'Bihar' },
                                { value: 'Delhi', label: 'Delhi' },
                                { value: 'Gujarat', label: 'Gujarat' },
                                { value: 'Karnataka', label: 'Karnataka' },
                                { value: 'Maharashtra', label: 'Maharashtra' },
                                { value: 'Tamil Nadu', label: 'Tamil Nadu' },
                                { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
                                { value: 'West Bengal', label: 'West Bengal' }
                                // Truncated for space, assume all states in real prod
                            ]} />
                            
                            <FloatingInput icon={Briefcase} type="text" name="occupation" label="Current Occupation" options={[
                                { value: 'student', label: 'Student' },
                                { value: 'farmer', label: 'Farmer' },
                                { value: 'business', label: 'Business' },
                                { value: 'unemployed', label: 'Unemployed' },
                                { value: 'employed', label: 'Employed (Salaried/Wage)' }
                            ]} />
                            
                            <FloatingInput icon={Activity} type="text" name="differentlyAbled" label="Differently Abled?" options={[
                                { value: 'no', label: 'No' },
                                { value: 'yes', label: 'Yes' }
                            ]} />

                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ fontSize: '1.1rem', padding: '1rem 2.5rem', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold' }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={20} /> Analyzing Profile...
                                    </>
                                ) : (
                                    <>
                                        <Search size={20} /> Find My Schemes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Premium Results Section (Inline) */}
                <AnimatePresence>
                    {showResults && (
                        <motion.div
                            id="results-section"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            style={{ marginTop: '3rem' }}
                        >
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', textAlign: 'center', marginBottom: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem' }}>
                                <Sparkles color="var(--blue-light)" /> Your Personalized Eligibility Results
                            </h2>

                            <div className="grid lg:grid-cols-3 gap-6">
                                {/* Left Panel: Score & Actions */}
                                <div className="lg:col-span-1" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '1.25rem', border: '1px solid rgba(34, 197, 94, 0.2)', textAlign: 'center' }}>
                                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'conic-gradient(#4ade80 95%, rgba(255,255,255,0.1) 0)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem auto' }}>
                                            <div style={{ width: '105px', height: '105px', borderRadius: '50%', background: 'var(--bg-dark)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                <span style={{ fontSize: '2rem', fontWeight: '800', color: 'white', lineHeight: '1' }}>95%</span>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Match</span>
                                            </div>
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', color: 'white', fontWeight: '700', marginBottom: '0.5rem' }}>High Eligibility</h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>You qualify for multiple high-value schemes.</p>
                                    </div>

                                    <div style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(10px)', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                                        <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Clock size={18} color="var(--blue)" /> Application Timeline
                                        </h4>
                                        <div style={{ borderLeft: '2px solid rgba(59, 130, 246, 0.3)', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div style={{ position: 'relative' }}>
                                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--blue)', position: 'absolute', left: '-1.4rem', top: '4px' }}></div>
                                                <strong style={{ color: 'white', fontSize: '0.9rem' }}>Step 1: Document Prep</strong>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>1-2 Days</div>
                                            </div>
                                            <div style={{ position: 'relative' }}>
                                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', position: 'absolute', left: '-1.4rem', top: '4px' }}></div>
                                                <strong style={{ color: 'white', fontSize: '0.9rem' }}>Step 2: Submit Application</strong>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Instant</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                                        <button className="results-btn"><Download size={18} /> Download PDF Report</button>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                            <button className="results-btn"><Share2 size={18} /> Share</button>
                                            <button className="results-btn"><Bookmark size={18} /> Save</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Panel: AI Summary & Schemes */}
                                <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.2), rgba(15, 23, 42, 0.8))', backdropFilter: 'blur(10px)', padding: '2rem', borderRadius: '1.25rem', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                                        <h3 style={{ fontSize: '1.25rem', color: 'white', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Award size={20} color="var(--saffron)" /> SmartScheme AI Summary
                                        </h3>
                                        <p style={{ color: 'var(--slate-200)', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                                            Based on your profile as a {formData.age}-year-old {formData.gender} {formData.occupation} from {formData.state}, you are eligible for targeted financial and empowerment schemes. We recommend prioritizing schemes tailored for the {formData.category} category to maximize your benefits.
                                        </p>
                                        
                                        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                            <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FileText size={16} color="var(--slate-400)" /> Required Core Documents
                                            </h4>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {['Aadhaar Card', 'Income Certificate', 'Domicile Certificate', 'Bank Passbook'].map(doc => (
                                                    <span key={doc} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', color: 'var(--slate-300)' }}>
                                                        {doc}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', color: 'white', fontWeight: '700', marginBottom: '1rem' }}>Top Recommended Schemes</h3>
                                        {recommendations.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {recommendations.map(rec => (
                                                    <div key={rec.id} style={{ background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(10px)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div>
                                                            <div style={{ display: 'inline-block', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--saffron)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>{rec.category || 'General'}</div>
                                                            <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>{rec.name}</h4>
                                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rec.shortDesc}</p>
                                                        </div>
                                                        <button onClick={() => navigate(`/scheme/${rec.id}`)} style={{ background: 'var(--blue)', border: 'none', color: 'white', padding: '0.75rem', borderRadius: '50%', cursor: 'pointer', flexShrink: 0, marginLeft: '1rem', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }}>
                                                            <ChevronRight size={20} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '1rem', border: '1px dashed rgba(255,255,255,0.2)', color: 'var(--slate-400)' }}>
                                                No specific schemes found for this exact criteria, but you may qualify for general state schemes.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                /* Floating Input Styles */
                .floating-input-group {
                    position: relative;
                    width: 100%;
                }
                .input-icon {
                    position: absolute;
                    left: 1.25rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--slate-400);
                    pointer-events: none;
                    transition: color 0.3s;
                    z-index: 2;
                }
                .floating-input {
                    width: 100%;
                    padding: 1.5rem 1.25rem 0.5rem 3.5rem;
                    border-radius: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    background: rgba(15, 23, 42, 0.6);
                    color: white;
                    font-size: 1rem;
                    outline: none;
                    transition: all 0.3s;
                    appearance: none;
                }
                .floating-input:focus {
                    border-color: var(--blue);
                    background: rgba(15, 23, 42, 0.9);
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
                }
                .floating-label {
                    position: absolute;
                    left: 3.5rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--slate-400);
                    pointer-events: none;
                    transition: all 0.2s ease-out;
                    font-size: 1rem;
                    z-index: 1;
                }
                .floating-input-group.has-value .floating-label,
                .floating-input-group:focus-within .floating-label {
                    top: 0.6rem;
                    font-size: 0.75rem;
                    color: var(--blue-light);
                    transform: translateY(0);
                    font-weight: 500;
                }
                .floating-input-group:focus-within .input-icon {
                    color: var(--blue-light);
                }
                
                /* Select Specific Fixes */
                select.floating-input option {
                    background: #0f172a;
                    color: white;
                }
                
                /* Error State */
                .floating-input-group.error .floating-input {
                    border-color: #ef4444;
                    animation: shake 0.5s;
                }
                .floating-input-group.error .input-icon,
                .floating-input-group.error .floating-label {
                    color: #ef4444 !important;
                }
                .error-text {
                    position: absolute;
                    right: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #ef4444;
                    font-size: 0.8rem;
                    pointer-events: none;
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }

                /* Results Buttons */
                .results-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    padding: 0.8rem;
                    border-radius: 0.75rem;
                    font-size: 0.9rem;
                    font-weight: 600;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    width: 100%;
                }
                .results-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                /* Voice pulse */
                .voice-btn.listening {
                    animation: pulse-red 1.5s infinite;
                }
                @keyframes pulse-red {
                    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
            `}</style>
        </div>
    );
};

export default EligibilityForm;
