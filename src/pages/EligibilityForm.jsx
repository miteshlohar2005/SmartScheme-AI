import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Loader, ShieldCheck, Mic, MicOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EligibilityForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
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
        recognition.lang = 'en-IN'; // Indian English, but catches Hinglish words well

        recognition.onstart = () => {
            setIsListening(true);
            setVoiceText('Listening... Speak now 🎙️');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            setVoiceText(`" ${transcript} "`);

            // NLP Magic Mapping Algorithm
            const newData = { ...formData };
            let clearErrors = {};

            // 1. Age Extraction
            const ageMatch = transcript.match(/(\d+)\s*(year|years|saal)/i);
            if (ageMatch) {
                newData.age = ageMatch[1];
                clearErrors.age = undefined;
            }

            // 2. Gender Extraction
            if (transcript.includes('female') || transcript.includes('woman') || transcript.includes('girl') || transcript.includes('aurat')) {
                newData.gender = 'female';
                clearErrors.gender = undefined;
            } else if (transcript.includes('male') || transcript.includes('man') || transcript.includes('boy') || transcript.includes('aadmi')) {
                newData.gender = 'male';
                clearErrors.gender = undefined;
            }

            // 3. Occupation
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

            // 4. State matching
            const statesList = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"];

            statesList.forEach(state => {
                if (transcript.includes(state.toLowerCase())) {
                    newData.state = state;
                    clearErrors.state = undefined;
                }
            });

            // 5. Income (Simple heuristics)
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
            if (!voiceText.includes('"')) { // Only stop if we didn't get a result yet
                setIsListening(false);
            }
        };

        recognition.start();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.age || isNaN(formData.age) || formData.age <= 0 || formData.age > 120) newErrors.age = 'Please enter a valid age';
        if (!formData.gender) newErrors.gender = 'Please select a gender';
        if (!formData.income || isNaN(formData.income) || formData.income < 0) newErrors.income = 'Please enter a valid income';
        if (!formData.category) newErrors.category = 'Please select a category';
        if (!formData.state) newErrors.state = 'Please select a state';
        if (!formData.occupation) newErrors.occupation = 'Please select an occupation';
        if (!formData.differentlyAbled) newErrors.differentlyAbled = 'Please specify if differently abled';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        // Simulate AI processing delay
        setTimeout(() => {
            setLoading(false);
            navigate('/results', { state: { formData } });
        }, 2000);
    };

    return (
        <div style={{ background: 'transparent', minHeight: 'calc(100vh - 140px)', paddingBottom: '4rem' }}>
            <div className="page-header" style={{ marginBottom: '-6rem' }}>
                <h1 className="page-title">{t('form_title')}</h1>
                <p className="page-subtitle">{t('form_desc')}</p>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="card"
                    style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem', borderRadius: '1.5rem', boxShadow: 'var(--shadow-lg)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '2rem' }}>
                        <ShieldCheck size={36} color="var(--success)" />
                        <span style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{t('form_secure')}</span>
                    </div>

                    {/* Entry Details Message Card */}
                    <div style={{ background: 'var(--overlay-tint)', border: '1px solid var(--card-border)', padding: '2.5rem', borderRadius: '1rem', textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: '600' }}>
                            Enter Your Details to Check Eligibility
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
                            Provide basic information to find government schemes you are eligible for.
                        </p>
                        <button
                            type="button"
                            onClick={() => { const form = document.getElementById('eligibility-grid'); if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                            style={{ padding: '0.75rem 2rem', background: 'var(--blue)', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '500', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--shadow-sm)' }}
                        >
                            {t('start_check')}
                        </button>
                    </div>

                    {/* ✨ NEW FEATURE: Accessible Voice AI ✨ */}
                    <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '2rem', borderRadius: '1rem', textAlign: 'center', marginBottom: '3rem', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, rgba(0,0,0,0) 60%)', zIndex: 0 }}></div>

                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.25rem 0.75rem', borderRadius: '2rem', fontSize: '0.875rem', fontWeight: '600' }}>
                                <span style={{ width: '8px', height: '8px', background: '#38bdf8', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px #38bdf8' }}></span>
                                Accessible AI Voice
                            </div>

                            <h3 style={{ fontSize: '1.5rem', color: 'white', margin: 0, fontWeight: '600' }}>Speak to Fill Form</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto 0.5rem auto' }}>
                                Try saying: <i style={{ color: '#bae6fd' }}>"I am a 45 year old female farmer from Maharashtra with an income of 2 lakh"</i>
                            </p>

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
                                    padding: '1rem 2rem',
                                    borderRadius: '3rem',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    cursor: isListening ? 'default' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: isListening ? '0 0 20px rgba(239, 68, 68, 0.6)' : '0 4px 14px 0 rgba(14, 165, 233, 0.39)'
                                }}
                            >
                                {isListening ? <MicOff size={24} className="animate-pulse" /> : <Mic size={24} />}
                                {isListening ? 'Recording Audio...' : 'Tap to Speak'}
                            </button>

                            {/* Voice Feedback Text box */}
                            {voiceText && (
                                <div style={{ marginTop: '0.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#f8fafc', width: '100%', maxWidth: '500px', fontStyle: voiceText.includes('"') ? 'italic' : 'normal' }}>
                                    {voiceText}
                                </div>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div id="eligibility-grid" className="grid md:grid-cols-2 gap-6" style={{ marginBottom: '2rem' }}>

                            <div className="input-group">
                                <label className="input-label" htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`input-field ${errors.fullName ? 'error' : ''}`}
                                    placeholder="e.g. Rahul Kumar"
                                    style={{ borderRadius: '0.75rem', padding: '1rem', borderColor: errors.fullName ? 'var(--danger)' : 'var(--card-border)', background: 'var(--overlay-tint)', color: 'var(--text-primary)' }}
                                />
                                {errors.fullName && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.fullName}</span>}
                            </div>

                            <div className="input-group">
                                <label className="input-label" htmlFor="age">Age (Years)</label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    min="0"
                                    max="120"
                                    className={`input-field ${errors.age ? 'error' : ''}`}
                                    placeholder="e.g. 28"
                                    style={{ borderRadius: '0.75rem', padding: '1rem', borderColor: errors.age ? 'var(--danger)' : 'var(--card-border)', background: 'var(--overlay-tint)', color: 'var(--text-primary)' }}
                                />
                                {errors.age && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.age}</span>}
                            </div>

                            <div className="input-group">
                                <label className="input-label" htmlFor="gender">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={`input-field ${errors.gender ? 'error' : ''}`}
                                    style={{ borderRadius: '0.75rem', padding: '1rem', borderColor: errors.gender ? 'var(--danger)' : 'var(--card-border)', background: 'var(--overlay-tint)', color: 'var(--text-primary)' }}
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Transgender / Other</option>
                                </select>
                                {errors.gender && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.gender}</span>}
                            </div>

                            <div className="input-group">
                                <label className="input-label" htmlFor="income">Annual Family Income (₹)</label>
                                <input
                                    type="number"
                                    id="income"
                                    name="income"
                                    value={formData.income}
                                    onChange={handleChange}
                                    min="0"
                                    className={`input-field ${errors.income ? 'error' : ''}`}
                                    placeholder="e.g. 250000"
                                    style={{ borderRadius: '0.75rem', padding: '1rem', borderColor: errors.income ? 'var(--danger)' : 'var(--card-border)', background: 'var(--overlay-tint)', color: 'var(--text-primary)' }}
                                />
                                {errors.income && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.income}</span>}
                            </div>

                            <div className="input-group">
                                <label className="input-label" htmlFor="category">Social Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`input-field ${errors.category ? 'error' : ''}`}
                                    style={{ borderRadius: '0.75rem', padding: '1rem', borderColor: errors.category ? 'var(--danger)' : 'var(--card-border)', background: 'var(--overlay-tint)', color: 'var(--text-primary)' }}
                                >
                                    <option value="" disabled>Select Category</option>
                                    <option value="general">General</option>
                                    <option value="obc">OBC</option>
                                    <option value="sc">SC</option>
                                    <option value="st">ST</option>
                                </select>
                                {errors.category && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.category}</span>}
                            </div>

                            <div className="input-group">
                                <label className="input-label" htmlFor="state">State / UT</label>
                                <select
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className={`input-field ${errors.state ? 'error' : ''}`}
                                    style={{ borderRadius: '0.75rem', padding: '1rem', borderColor: errors.state ? 'var(--danger)' : 'var(--card-border)', background: 'var(--overlay-tint)', color: 'var(--text-primary)' }}
                                >
                                    <option value="" disabled>Select State</option>
                                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                    <option value="Assam">Assam</option>
                                    <option value="Bihar">Bihar</option>
                                    <option value="Chhattisgarh">Chhattisgarh</option>
                                    <option value="Goa">Goa</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Haryana">Haryana</option>
                                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                                    <option value="Jharkhand">Jharkhand</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Kerala">Kerala</option>
                                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                                    <option value="Maharashtra">Maharashtra</option>
                                    <option value="Manipur">Manipur</option>
                                    <option value="Meghalaya">Meghalaya</option>
                                    <option value="Mizoram">Mizoram</option>
                                    <option value="Nagaland">Nagaland</option>
                                    <option value="Odisha">Odisha</option>
                                    <option value="Punjab">Punjab</option>
                                    <option value="Rajasthan">Rajasthan</option>
                                    <option value="Sikkim">Sikkim</option>
                                    <option value="Tamil Nadu">Tamil Nadu</option>
                                    <option value="Telangana">Telangana</option>
                                    <option value="Tripura">Tripura</option>
                                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                                    <option value="Uttarakhand">Uttarakhand</option>
                                    <option value="West Bengal">West Bengal</option>
                                    <option value="Delhi">Delhi</option>
                                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                    <option value="Other UTs">Other UTs</option>
                                </select>
                                {errors.state && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.state}</span>}
                            </div>

                            <div className="input-group">
                                <label className="input-label" htmlFor="occupation">Current Occupation</label>
                                <select
                                    id="occupation"
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                    className={`input-field ${errors.occupation ? 'error' : ''}`}
                                    style={{ borderRadius: '0.75rem', padding: '1rem', borderColor: errors.occupation ? 'var(--danger)' : 'var(--card-border)', background: 'var(--overlay-tint)', color: 'var(--text-primary)' }}
                                >
                                    <option value="" disabled>Select Occupation</option>
                                    <option value="student">Student</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="business">Business</option>
                                    <option value="unemployed">Unemployed</option>
                                    <option value="employed">Employed (Salaried/Wage)</option>
                                </select>
                                {errors.occupation && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.occupation}</span>}
                            </div>

                            <div className="input-group">
                                <label className="input-label" htmlFor="differentlyAbled">Are you differently abled?</label>
                                <select
                                    id="differentlyAbled"
                                    name="differentlyAbled"
                                    value={formData.differentlyAbled}
                                    onChange={handleChange}
                                    className={`input-field ${errors.differentlyAbled ? 'error' : ''}`}
                                    style={{ borderRadius: '0.75rem', padding: '1rem', borderColor: errors.differentlyAbled ? 'var(--danger)' : 'var(--card-border)', background: 'var(--overlay-tint)', color: 'var(--text-primary)' }}
                                >
                                    <option value="" disabled>Select Option</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                                {errors.differentlyAbled && <span style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.differentlyAbled}</span>}
                            </div>

                        </div>

                        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ fontSize: '1.25rem', padding: '1rem 3rem', borderRadius: '50px', width: '100%', maxWidth: '400px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} size={24} />
                                        Analyzing Profile...
                                    </>
                                ) : (
                                    <>
                                        <Search size={24} /> Find My Schemes
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </motion.div>
            </div>

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .input-field.error {
          animation: shake 0.5s;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .btn-primary:disabled {
          background-color: var(--slate-400);
          cursor: not-allowed;
          transform: none !important;
        }

        .voice-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(14, 165, 233, 0.6) !important;
        }
        
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
