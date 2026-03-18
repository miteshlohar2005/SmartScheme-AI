import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Trash2, ShieldCheck, CheckCircle2, Mic, MicOff, Volume2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { schemesDB } from '../data/schemes';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useTranslation } from 'react-i18next';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const ChatAssistant = () => {
    const { t, i18n } = useTranslation();
    const language = i18n.language;

    // Map Context Language to Speech API Locale
    const langMap = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'mr': 'mr-IN'
    };
    const speechLocale = langMap[language] || 'en-US';

    const initialMessage = {
        id: 1,
        sender: 'ai',
        text: t('chat_welcome'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const [messages, setMessages] = useState([initialMessage]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Voice State
    const [isListening, setIsListening] = useState(false);
    const [isSpeakingId, setIsSpeakingId] = useState(null);
    const recognitionRef = useRef(null);
    const synthesisRef = useRef(window.speechSynthesis);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                if (finalTranscript) {
                    setInput(prev => prev + (prev ? ' ' : '') + finalTranscript);
                } else if (interimTranscript) {
                    // Optionally show interim results somewhere, or just update input directly
                    // but usually updating input directly on interim makes editing hard.
                    // For now, we wait for final to append, or we overwrite. Let's overwrite for simplicity.
                    setInput(interimTranscript);
                }
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };
        } else {
            console.warn("Speech Recognition API not supported in this browser.");
        }
    }, []);

    // Update language when it changes contextually
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = speechLocale;
        }
    }, [speechLocale]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (err) {
                console.error("Microphone access failed or already started", err);
            }
        }
    };

    const speakText = (text, messageId) => {
        if (!synthesisRef.current) return;

        // If already speaking this message, stop it
        if (isSpeakingId === messageId) {
            synthesisRef.current.cancel();
            setIsSpeakingId(null);
            return;
        }

        synthesisRef.current.cancel(); // Stop any current speech

        // Strip markdown asterisks for cleaner reading
        const cleanText = text.replace(/\*\*/g, '');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = speechLocale;

        // Try to find a natural voice for the locale
        const voices = synthesisRef.current.getVoices();
        const preferredVoice = voices.find(v => v.lang === speechLocale) || voices.find(v => v.lang.startsWith(speechLocale.split('-')[0]));
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onend = () => setIsSpeakingId(null);
        utterance.onerror = () => setIsSpeakingId(null);

        setIsSpeakingId(messageId);
        synthesisRef.current.speak(utterance);
    };

    // Cleanup speech synthesis on unmount
    useEffect(() => {
        return () => {
            if (synthesisRef.current) {
                synthesisRef.current.cancel();
            }
        };
    }, []);

    const generateAIResponseFromGemini = async (userText) => {
        try {
            const prompt = `You are the official AI assistant for SmartScheme AI, a safe, transparent platform helping citizens of India find government schemes. 
Here is a complete JSON list of the active schemes in our platform's secure database: ${JSON.stringify(schemesDB)}.

Your job is to read the user's details and answer their questions about what schemes they might qualify for based on that database. 
- Talk warmly and professionally like a government helper.
- DO NOT mention the JSON database technically, just parse it in your head and tell them names of schemes they match.
- Use simple Markdown (like bolding scheme names or using bullet points) to format neatly.
- If they provided enough details and you found matching schemes, you MUST include a special tag at the very end of your message in this exact format: [SCHEMES: id1, id2, id3] where id1, id2 are the exact IDs from the JSON database. For example: [SCHEMES: pm-kisan, ayushman-bharat]. Only include the IDs of the schemes you explicitly recommended.
- If they don't give you enough information to check schemes (Age, Income, Occupation, State, Category), politely ask them to describe themselves a bit more!

User Query: "${userText}"`;

            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error(error);
            return t('chat_error');
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Fetch AI Response dynamically via Gemini
        let aiResponseText = await generateAIResponseFromGemini(userMsg.text);

        let recommendedSchemes = [];
        const match = aiResponseText.match(/\[SCHEMES:\s*(.*?)\]/);
        if (match) {
            const ids = match[1].split(',').map(s => s.trim());
            recommendedSchemes = schemesDB.filter(s => ids.includes(s.id));
            aiResponseText = aiResponseText.replace(/\[SCHEMES:\s*(.*?)\]/, '').trim();
        }

        const aiMsg = {
            id: Date.now() + 1,
            sender: 'ai',
            text: aiResponseText,
            recommendedSchemes,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);

        // Auto-read response
        speakText(aiResponseText, aiMsg.id);
    };

    const clearChat = () => {
        setMessages([initialMessage]);
    };

    const formatMessage = (text) => {
        // Simple markdown to bold parts of the text
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} style={{ color: 'var(--blue)' }}>{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)', background: 'transparent' }}>

            {/* Background Pattern Overlay */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                opacity: 0.1,
                backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)',
                backgroundSize: '24px 24px',
                pointerEvents: 'none',
                zIndex: 0
            }}></div>

            <div className="container chat-container" style={{ display: 'flex', flexDirection: 'column', maxWidth: '900px', margin: '0 auto 40px auto', padding: '1rem', position: 'relative', zIndex: 10, height: '70vh', maxHeight: '70vh', overflowY: 'auto' }}>

                {/* Chat Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', borderRadius: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', borderBottom: '3px solid var(--saffron)', position: 'sticky', top: 0, zIndex: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'var(--blue)', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
                            <Bot size={24} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>{t('chat_title')}</h2>
                            <p style={{ color: 'var(--success)', fontSize: '0.75rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <CheckCircle2 size={12} /> {t('chat_status')}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }} className="d-none md-inline">
                            <ShieldCheck size={16} /> {t('chat_secure')}
                        </span>
                        <button
                            onClick={clearChat}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '50px', fontSize: '0.875rem', fontWeight: '600', transition: 'all 0.2s' }}
                        >
                            <Trash2 size={16} /> {t('chat_clear')}
                        </button>
                    </div>
                </div>

                {/* Chat Messages Area */}
                <div style={{ flexGrow: 1, padding: '1.5rem 0.5rem 80px 0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}
                        >
                            <div style={{
                                background: msg.sender === 'user' ? 'var(--chat-bg-user)' : 'var(--chat-bg-ai)',
                                backdropFilter: 'blur(12px)',
                                color: 'var(--text-primary)',
                                padding: '0.75rem 1rem',
                                borderRadius: '0.75rem',
                                borderTopRightRadius: msg.sender === 'user' ? '0' : '0.75rem',
                                borderTopLeftRadius: msg.sender === 'ai' ? '0' : '0.75rem',
                                border: '1px solid var(--card-border)',
                                boxShadow: 'var(--shadow-sm)',
                                maxWidth: '80%',
                                fontSize: '0.95rem',
                                lineHeight: '1.5',
                                position: 'relative',
                            }}>
                                <div style={{ whiteSpace: 'pre-wrap' }}>
                                    {formatMessage(msg.text)}
                                </div>

                                {msg.recommendedSchemes && msg.recommendedSchemes.length > 0 && (
                                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {msg.recommendedSchemes.map(scheme => (
                                            <div key={scheme.id} style={{
                                                background: 'var(--overlay-tint)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--card-border)'
                                            }}>
                                                <h4 style={{ color: 'var(--saffron)', margin: '0 0 0.5rem 0', fontSize: '1.05rem' }}>{scheme.name}</h4>
                                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>{scheme.shortDesc}</p>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <Link to={`/scheme/${scheme.id}`} style={{ padding: '0.4rem 0.8rem', background: 'var(--blue)', color: 'white', borderRadius: '6px', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-block' }}>
                                                        {t('more_details')}
                                                    </Link>
                                                    <Link to={`/scheme/${scheme.id}`} style={{ padding: '0.4rem 0.8rem', background: 'transparent', border: '1px solid var(--blue)', color: 'var(--blue)', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                                                        {t('apply')} <ExternalLink size={14} />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div style={{
                                    display: 'flex',
                                    justifyContent: msg.sender === 'ai' ? 'space-between' : 'flex-end',
                                    alignItems: 'center',
                                    marginTop: '0.5rem',
                                    paddingTop: '0.5rem',
                                    borderTop: msg.sender === 'ai' ? '1px solid rgba(255,255,255,0.1)' : 'none'
                                }}>
                                    {msg.sender === 'ai' && (
                                        <button
                                            onClick={() => speakText(msg.text, msg.id)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: isSpeakingId === msg.id ? 'var(--blue-light)' : 'rgba(255,255,255,0.5)',
                                                cursor: 'pointer',
                                                padding: '0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                transition: 'color 0.2s',
                                                animation: isSpeakingId === msg.id ? 'pulse-glow 1.5s infinite' : 'none'
                                            }}
                                            title="Read aloud"
                                        >
                                            <Volume2 size={16} />
                                        </button>
                                    )}
                                    <div style={{ fontSize: '0.65rem', color: msg.sender === 'user' ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.5)' }}>
                                        {msg.time}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ display: 'flex', alignItems: 'flex-start' }}
                        >
                            <div style={{
                                background: 'var(--glass-bg)',
                                backdropFilter: 'blur(12px)',
                                padding: '1rem',
                                borderRadius: '0.75rem',
                                borderTopLeftRadius: '0',
                                border: '1px solid var(--card-border)',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                display: 'flex',
                                gap: '0.3rem'
                            }}>
                                <div className="typing-dot" style={{ animationDelay: '0s', background: 'var(--text-primary)' }}></div>
                                <div className="typing-dot" style={{ animationDelay: '0.2s', background: 'var(--text-primary)' }}></div>
                                <div className="typing-dot" style={{ animationDelay: '0.4s', background: 'var(--text-primary)' }}></div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div style={{ position: 'sticky', bottom: 0, marginTop: '1rem', zIndex: 20 }}>
                    {isListening && (
                        <div style={{ position: 'absolute', top: '-25px', left: '20px', color: 'var(--blue)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', animation: 'pulse 1.5s infinite' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--blue)' }}></div>
                            {t('chat_listening')}
                        </div>
                    )}
                    <div style={{ padding: '0.5rem', background: 'var(--glass-bg)', backdropFilter: 'blur(12px)', borderRadius: '50px', boxShadow: '0 4px 15px rgba(0,0,0,0.4)', display: 'flex', gap: '0.5rem', alignItems: 'center', border: isListening ? '1px solid var(--blue)' : '1px solid var(--card-border)', transition: 'border 0.3s' }}>
                        <button
                            onClick={toggleListening}
                            style={{
                                background: isListening ? 'var(--chat-bg-user)' : 'transparent',
                                color: isListening ? 'var(--blue)' : 'var(--text-secondary)',
                                padding: '0.75rem',
                                borderRadius: '50%',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                animation: isListening ? 'pulse-glow 1.5s infinite' : 'none'
                            }}
                            title={isListening ? "Stop listening" : "Start speaking"}
                        >
                            {isListening ? <Mic size={22} /> : <MicOff size={22} />}
                        </button>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isListening ? "Speaking..." : t('chat_placeholder')}
                            style={{ flexGrow: 1, border: 'none', outline: 'none', padding: '0.75rem 0.5rem', fontSize: '1rem', color: 'var(--text-primary)', background: 'transparent' }}
                        />

                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            style={{
                                background: input.trim() ? 'var(--blue)' : 'var(--slate-700)',
                                color: 'white',
                                padding: '0.75rem',
                                borderRadius: '50%',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: input.trim() ? 'pointer' : 'default',
                                transition: 'all 0.2s',
                                width: '45px',
                                height: '45px',
                                marginRight: '4px'
                            }}
                        >
                            <Send size={20} style={{ transform: 'translateX(2px)' }} />
                        </button>
                    </div>
                </div>

            </div>

            <style>{`
        .typing-dot {
          width: 8px;
          height: 8px;
          background-color: var(--slate-400);
          border-radius: 50%;
          animation: typing 1s infinite ease-in-out;
        }

        @keyframes typing {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-5px); opacity: 1; }
        }

        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(147, 197, 253, 0.4); color: var(--blue-light); }
          70% { box-shadow: 0 0 0 10px rgba(147, 197, 253, 0); color: #fff; }
          100% { box-shadow: 0 0 0 0 rgba(147, 197, 253, 0); color: var(--blue-light); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .chat-container {
          scrollbar-width: none;
        }

        .chat-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    );
};

export default ChatAssistant;
