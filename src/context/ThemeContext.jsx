import React, { createContext, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        // Read from localStorage or default to 'dark'
        return localStorage.getItem('app-theme') || 'dark';
    });

    useEffect(() => {
        // Apply theme data attribute to body
        document.body.setAttribute('data-theme', theme);
        // Save to localStorage
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    const toggleTheme = (e) => {
        const isDark = theme === 'dark';
        const nextTheme = isDark ? 'light' : 'dark';

        // Respect reduced motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setTheme(nextTheme);
            return;
        }

        console.log("Animation starts");

        // Background color of the new theme to use for the overlay reveal
        const nextBg = nextTheme === 'light'
            ? '#FFFFFF'
            : 'linear-gradient(135deg, #0d0914, #1a103c)';

        // Determine origin point of the transition (fallback to center of screen)
        const x = e?.clientX ?? window.innerWidth / 2;
        const y = e?.clientY ?? window.innerHeight / 2;

        // Calculate distance to the furthest corner to ensure the circle covers the screen
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // Create overlay element
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = nextBg;
        overlay.style.zIndex = '999999';
        overlay.style.pointerEvents = 'none';
        
        // Initial state
        overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
        document.body.appendChild(overlay);

        // Animate overlay expanding using requestAnimationFrame for smoothness
        requestAnimationFrame(() => {
            const animation = overlay.animate(
                [
                    { clipPath: `circle(0px at ${x}px ${y}px)` },
                    { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` }
                ],
                {
                    duration: 600,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    fill: 'forwards'
                }
            );

            animation.onfinish = () => {
                console.log("Theme switches");
                
                // 1. Switch the theme state synchronously
                flushSync(() => {
                    setTheme(nextTheme);
                });
                
                // 2. Force DOM update immediately for underlying CSS transitions to kick in
                document.body.setAttribute('data-theme', nextTheme);
                
                // 3. Fade out the overlay to reveal the newly themed UI smoothly transitioning
                const fadeOut = overlay.animate(
                    [{ opacity: 1 }, { opacity: 0 }],
                    {
                        duration: 300,
                        easing: 'ease-out',
                        fill: 'forwards'
                    }
                );

                fadeOut.onfinish = () => {
                    console.log("Animation ends");
                    overlay.remove();
                };
            };
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
