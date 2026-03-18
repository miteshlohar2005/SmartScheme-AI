import React, { createContext, useState, useContext, useEffect } from 'react';

// Isolated translations
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import mr from '../locales/mr.json';
import ta from '../locales/ta.json';

const translations = {
    en,
    hi,
    mr,
    ta
};

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    // 2. Persist in local storage
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('appLanguage') || 'en';
    });
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Apply smooth transition when language changes
        setIsFading(true);
        const timer = setTimeout(() => {
            localStorage.setItem('appLanguage', language);
            document.documentElement.lang = language;
            setIsFading(false);
        }, 300); // 0.3s syncs with fade transition time

        return () => clearTimeout(timer);
    }, [language]);

    const t = (key) => {
        return translations[language]?.[key] || key;
    };

    const changeLanguage = (lang) => {
        if (lang === language) return;
        setLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
            {/* Adding container rendering fading class */}
            <div style={{ transition: 'opacity 0.3s ease-in-out', opacity: isFading ? 0 : 1 }}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
};
