import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    // Saved Schemes
    const [savedSchemes, setSavedSchemes] = useState(() => {
        const local = localStorage.getItem('savedSchemes');
        return local ? JSON.parse(local) : [];
    });

    // Compare Schemes
    const [compareSchemes, setCompareSchemes] = useState(() => {
        const local = localStorage.getItem('compareSchemes');
        return local ? JSON.parse(local) : [];
    });

    // My Applications
    const [myApplications, setMyApplications] = useState(() => {
        const local = localStorage.getItem('myApplications');
        return local ? JSON.parse(local) : [];
    });

    useEffect(() => {
        localStorage.setItem('savedSchemes', JSON.stringify(savedSchemes));
    }, [savedSchemes]);

    useEffect(() => {
        localStorage.setItem('compareSchemes', JSON.stringify(compareSchemes));
    }, [compareSchemes]);

    useEffect(() => {
        localStorage.setItem('myApplications', JSON.stringify(myApplications));
    }, [myApplications]);

    // Actions
    const toggleSaveScheme = (scheme) => {
        setSavedSchemes(prev => {
            if (prev.find(s => s.id === scheme.id)) {
                return prev.filter(s => s.id !== scheme.id);
            }
            return [...prev, scheme];
        });
    };

    const isSchemeSaved = (id) => savedSchemes.some(s => s.id === id);

    const toggleCompareScheme = (scheme) => {
        setCompareSchemes(prev => {
            if (prev.find(s => s.id === scheme.id)) {
                return prev.filter(s => s.id !== scheme.id);
            }
            if (prev.length >= 3) {
                alert("You can only compare up to 3 schemes at a time.");
                return prev;
            }
            return [...prev, scheme];
        });
    };

    const isSchemeCompared = (id) => compareSchemes.some(s => s.id === id);

    const applyForScheme = (scheme) => {
        if (!myApplications.find(a => a.scheme.id === scheme.id)) {
            setMyApplications(prev => [...prev, {
                id: Date.now().toString(),
                scheme,
                date: new Date().toISOString().split('T')[0],
                status: 'Applied', // Applied, Under Review, Approved, Rejected
                estimatedApproval: '2-3 weeks'
            }]);
            alert(`Application submitted for ${scheme.name}!`);
        } else {
            alert('You have already applied for this scheme.');
        }
    };

    return (
        <UserContext.Provider value={{
            savedSchemes, toggleSaveScheme, isSchemeSaved,
            compareSchemes, toggleCompareScheme, isSchemeCompared,
            myApplications, applyForScheme
        }}>
            {children}
        </UserContext.Provider>
    );
};
