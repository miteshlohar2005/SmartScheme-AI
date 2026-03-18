import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Search, Navigation, Phone, Filter, Compass, Loader, AlertTriangle, Clock, Map as MapIcon, Mic } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const containerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '1rem'
};

const defaultCenter = {
    lat: 20.5937,
    lng: 78.9629 // Center of India
};

// SVG Icon Helpers
const getMarkerIcon = (type) => {
    let color = '';
    switch (type) {
        case 'CSC': color = '#3b82f6'; break; // Blue
        case 'Panchayat': color = '#22c55e'; break; // Green
        case 'Govt Office': color = '#ef4444'; break; // Red
        default: color = '#64748b'; break; // Slate
    }

    return {
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: '#ffffff',
        scale: 1.5,
        anchor: new window.google.maps.Point(12, 24)
    };
};

// IMPORTANT FIX: Declare libraries outside the component so it doesn't trigger endless re-renders!
const libraries = ['places', 'geometry'];

const HelpCenterLocator = () => {
    const { t } = useTranslation();

    // --- State ---
    const [userLoc, setUserLoc] = useState(null);
    const [centers, setCenters] = useState([]);
    const [filteredCenters, setFilteredCenters] = useState([]);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [selectedCenter, setSelectedCenter] = useState(null);
    const [mapError, setMapError] = useState('');
    const [loadingLocation, setLoadingLocation] = useState(false);

    // Filters
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchRadius, setSearchRadius] = useState(20); // KM
    const [voiceText, setVoiceText] = useState('');

    const mapRef = useRef(null);

    // DEBUGGING: Log API Key (Safe for local dev to ensure Vite is picking it up)
    const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    console.log("Maps API Key Detected:", googleApiKey ? "YES! Starts with " + googleApiKey.substring(0, 5) : "UNDEFINED! Check .env file and restart server.");

    // Load Google Maps Script
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleApiKey || "",
        libraries: libraries
    });

    // Haversine distance formula
    const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
    }, []);

    // Mock Backend Fetch based on User Location
    const fetchNearbyCenters = useCallback(async (lat, lng) => {
        // In a real app, this calls Firebase or API: `/api/centers?lat=${lat}&lng=${lng}&radius=${searchRadius}`
        // Here we dynamically generate mock centers radiating from the user's lat/lng
        const mockCenters = [];
        const types = ['CSC', 'Panchayat', 'Govt Office'];
        const names = ['Gram Suvidha Kendra', 'Jan Seva CSC', 'Maha E-Seva', 'Village Council', 'District Collectorate Office', 'Municipal Corporation'];

        for (let i = 0; i < 25; i++) {
            // Random offset within roughly 20-30km
            const dLat = (Math.random() - 0.5) * 0.4;
            const dLng = (Math.random() - 0.5) * 0.4;

            const typeResult = types[i % types.length];
            const dist = calculateDistance(lat, lng, lat + dLat, lng + dLng);

            const now = new Date();
            const isOpen = Math.random() > 0.3; // 70% chance open

            mockCenters.push({
                id: `center-${i}`,
                name: `${names[i % names.length]} - Branch ${i}`,
                type: typeResult,
                lat: lat + dLat,
                lng: lng + dLng,
                distance: parseFloat(dist.toFixed(1)), // KM
                address: `Survey No ${dist.toFixed(0)}, Main Road, District XYZ`,
                phone: `+91 9${Math.floor(Math.random() * 1000000000)}`,
                openNow: isOpen,
                visitedBy: Math.floor(Math.random() * 500),
                workingHours: isOpen ? "09:00 AM - 05:00 PM" : "Closed"
            });
        }

        // Sort by distance
        const sorted = mockCenters.sort((a, b) => a.distance - b.distance);
        setCenters(sorted);
        setFilteredCenters(sorted.filter(c => c.distance <= searchRadius));
    }, [calculateDistance, searchRadius]);

    const requestLocation = useCallback(() => {
        setLoadingLocation(true);
        setMapError('');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const pos = { lat: latitude, lng: longitude };
                    setUserLoc(pos);
                    setMapCenter(pos);
                    fetchNearbyCenters(latitude, longitude);
                    setLoadingLocation(false);
                },
                (err) => {
                    console.error("Location error:", err);
                    setMapError('Location access denied or unavailable. Please enter your Pincode manually.');
                    setLoadingLocation(false);
                    // Fallback to default
                    fetchNearbyCenters(defaultCenter.lat, defaultCenter.lng);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            setMapError('Geolocation is not supported by this browser.');
            setLoadingLocation(false);
        }
    }, [fetchNearbyCenters]);

    useEffect(() => {
        requestLocation();
    }, [requestLocation]);

    // Filtering Logic
    useEffect(() => {
        if (!centers.length) return;

        let result = centers;

        // Radius filter
        result = result.filter(c => c.distance <= searchRadius);

        // Type filter
        if (activeFilter !== 'All') {
            result = result.filter(c => c.type === activeFilter);
        }

        // Voice text filter (if populated through voice search)
        if (voiceText) {
            const lowerText = voiceText.toLowerCase();
            result = result.filter(c =>
                c.name.toLowerCase().includes(lowerText) ||
                c.type.toLowerCase().includes(lowerText)
            );
        }

        setFilteredCenters(result);
    }, [activeFilter, searchRadius, centers, voiceText]);

    const onLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    const onUnmount = useCallback(() => {
        mapRef.current = null;
    }, []);

    const handleVoiceSearch = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Voice search not supported. Please use Chrome.");
            return;
        }

        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recog = new SpeechRec();
        recog.lang = 'en-IN';

        recog.onresult = (e) => {
            const text = e.results[0][0].transcript;
            setVoiceText(text);

            // Auto mapping
            if (text.toLowerCase().includes('csc')) setActiveFilter('CSC');
            else if (text.toLowerCase().includes('panchayat')) setActiveFilter('Panchayat');
            else if (text.toLowerCase().includes('office')) setActiveFilter('Govt Office');
        };

        recog.start();
    };

    const handleGetDirections = (e, destLat, destLng) => {
        e.stopPropagation();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${destLat},${destLng}&travelmode=driving`;
                    window.open(directionsUrl, "_blank");
                },
                (err) => {
                    console.error("Location error for directions:", err);
                    alert("Please enable location access to get directions.");
                    // Fallback to just destination if origin drops
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`, "_blank");
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}`, "_blank");
        }
    };

    const mostVisitedCenter = useMemo(() => {
        if (!filteredCenters.length) return null;
        return [...filteredCenters].sort((a, b) => b.visitedBy - a.visitedBy)[0];
    }, [filteredCenters]);

    if (loadError) {
        return (
            <div className="container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '2rem', borderRadius: '1rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <AlertTriangle size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.8 }} />
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Map Failed to Load</h2>
                    <p>There was a critical error loading Google Maps. Please verify your <b>VITE_GOOGLE_MAPS_API_KEY</b> is correct in your .env file, you are not suffering from Referrer Restrictions, and you have the "Maps JavaScript API" enabled in Google Cloud Console.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'transparent', minHeight: 'calc(100vh - 140px)', paddingBottom: '4rem', color: 'var(--text-primary)' }}>
            <div className="page-header" style={{ marginBottom: '-4rem', paddingBottom: '6rem', borderBottom: 'none' }}>
                <h1 className="page-title" style={{ color: 'var(--text-primary)' }}>Offline Help Centers</h1>
                <p className="page-subtitle" style={{ color: 'var(--text-primary)' }}>Find nearby CSCs, Panchayats, and Government Offices.</p>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 10, padding: '0 32px' }}>
                {/* 1. Control Panel */}
                <div style={{
                    background: 'rgba(15,23,42,0.75)',
                    borderRadius: '18px',
                    padding: '20px',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    marginBottom: '24px',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.08)'
                }}>
                    <div className="grid md:grid-cols-12 items-center" style={{ gap: '16px' }}>
                        <div className="md:col-span-4" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <button
                                onClick={requestLocation}
                                disabled={loadingLocation}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '10px 16px', borderRadius: '12px',
                                    background: userLoc ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.05)',
                                    color: userLoc ? '#4ade80' : '#cbd5e1',
                                    border: `1px solid ${userLoc ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                                    fontWeight: '500', transition: 'all 0.2s', cursor: 'pointer'
                                }}
                            >
                                {loadingLocation ? <Loader size={18} className="animate-spin" /> : <Compass size={18} />}
                                {userLoc ? 'Live Location Active' : 'Use My Location'}
                            </button>

                            <button onClick={handleVoiceSearch} title="Voice Search" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', padding: '10px', borderRadius: '50%', cursor: 'pointer', transition: 'all 0.2s' }}>
                                <Mic size={20} />
                            </button>
                        </div>

                        <div className="md:col-span-5" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {['All', 'CSC', 'Panchayat', 'Govt Office'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    style={{
                                        whiteSpace: 'nowrap', borderRadius: '20px', padding: '8px 16px', fontWeight: '500', transition: 'all 0.2s', fontSize: '14px', cursor: 'pointer',
                                        background: activeFilter === filter ? '#A855F7' : 'rgba(255,255,255,0.05)',
                                        color: activeFilter === filter ? '#ffffff' : '#CBD5E1',
                                        border: activeFilter === filter ? '1px solid #A855F7' : '1px solid rgba(255,255,255,0.1)',
                                    }}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        <div className="md:col-span-3 flex flex-col justify-center" style={{ gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '500' }}>Radius:</span>
                                <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>{searchRadius} km</span>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="50"
                                value={searchRadius}
                                onChange={(e) => setSearchRadius(Number(e.target.value))}
                                className="custom-slider"
                                style={{
                                    width: '100%', height: '6px', borderRadius: '8px', cursor: 'pointer', outline: 'none',
                                    appearance: 'none',
                                    background: `linear-gradient(to right, #A855F7 ${(searchRadius - 5) / 45 * 100}%, rgba(255,255,255,0.2) ${(searchRadius - 5) / 45 * 100}%)`
                                }}
                            />
                        </div>
                    </div>

                    {mapError && (
                        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertTriangle size={16} /> {mapError}
                            <input type="text" placeholder="Enter Pincode or City..." style={{ marginLeft: 'auto', padding: '6px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', outline: 'none' }} />
                        </div>
                    )}
                    {voiceText && (
                        <div style={{ marginTop: '16px', color: '#A855F7', fontSize: '14px', fontStyle: 'italic' }}>
                            Voice query: "{voiceText}"
                        </div>
                    )}
                </div>

                <div className="grid lg:grid-cols-3" style={{ gap: '24px' }}>
                    {/* 2. Map Section */}
                    <div className="lg:col-span-2" style={{
                        background: 'rgba(15, 23, 42, 0.65)', borderRadius: '18px', overflow: 'hidden',
                        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)',
                        height: '380px', marginTop: '20px', position: 'relative'
                    }}>
                        {!isLoaded ? (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                                <Loader className="animate-spin" size={32} />
                            </div>
                        ) : (
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                center={mapCenter}
                                zoom={12}
                                onLoad={onLoad}
                                onUnmount={onUnmount}
                                options={{
                                    mapTypeControl: false,
                                    streetViewControl: false,
                                    styles: [
                                        { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
                                        { featureType: 'all', elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
                                        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
                                        { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
                                        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
                                        { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
                                        { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
                                        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
                                    ]
                                }}
                            >
                                {userLoc && (
                                    <Marker
                                        position={userLoc}
                                        icon={{
                                            path: window.google.maps.SymbolPath.CIRCLE,
                                            fillColor: '#A855F7',
                                            fillOpacity: 1,
                                            scale: 8,
                                            strokeColor: '#ffffff',
                                            strokeWeight: 2,
                                        }}
                                        title="You are here"
                                    />
                                )}

                                {filteredCenters.map((center) => (
                                    <Marker
                                        key={center.id}
                                        position={{ lat: center.lat, lng: center.lng }}
                                        icon={getMarkerIcon(center.type)}
                                        onClick={() => setSelectedCenter(center)}
                                        animation={window.google.maps.Animation.DROP}
                                    />
                                ))}

                                {selectedCenter && (
                                    <InfoWindow
                                        position={{ lat: selectedCenter.lat, lng: selectedCenter.lng }}
                                        onCloseClick={() => setSelectedCenter(null)}
                                        options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
                                    >
                                        <div style={{ padding: '0.5rem', maxWidth: '200px', color: '#1e293b' }}>
                                            <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', fontSize: '1rem' }}>{selectedCenter.name}</h4>
                                            <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.8rem' }}>{selectedCenter.type}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: selectedCenter.openNow ? '#22c55e' : '#ef4444', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                                                <Clock size={12} /> {selectedCenter.openNow ? 'Open Now' : 'Closed'}
                                            </div>
                                            <button
                                                onClick={(e) => handleGetDirections(e, selectedCenter.lat, selectedCenter.lng)}
                                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#3b82f6', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '500' }}
                                            >
                                                <Navigation size={14} /> Get Directions
                                            </button>
                                        </div>
                                    </InfoWindow>
                                )}
                            </GoogleMap>
                        )}

                        {/* Map Legend */}
                        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '16px', fontSize: '12px', fontWeight: '500', color: 'var(--text-primary)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="#3b82f6" /> CSC</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="#22c55e" /> Panchayat</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="#ef4444" /> Govt Office</div>
                        </div>
                    </div>

                    {/* Right Panel: List View */}
                    <div className="flex flex-col h-[600px] overflow-y-auto pr-2 custom-scrollbar" style={{ marginTop: '20px' }}>
                        {/* 3. Most Popular Nearby */}
                        {mostVisitedCenter && activeFilter === 'All' && (
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.8))',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: '16px',
                                padding: '16px',
                                marginBottom: '16px',
                                backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)'
                            }}>
                                <div style={{ fontSize: '11px', letterSpacing: '1px', color: '#A855F7', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    ⭐ MOST POPULAR NEARBY
                                </div>
                                <h3 style={{ margin: '0 0 6px 0', color: 'var(--text-primary)', fontSize: '18px', fontWeight: '600' }}>{mostVisitedCenter.name}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '13px', fontWeight: '500' }}>{mostVisitedCenter.visitedBy} visits this week</p>
                                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', color: 'var(--text-primary)', fontWeight: 'bold' }}>{mostVisitedCenter.distance} km</span>
                                </div>
                            </div>
                        )}

                        <AnimatePresence>
                            {filteredCenters.length === 0 ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-primary)' }}>
                                    <MapIcon size={48} style={{ opacity: 0.3, margin: '0 auto 1rem auto' }} />
                                    No centers found within {searchRadius}km.
                                </motion.div>
                            ) : (
                                filteredCenters.map((center, index) => (
                                    <motion.div
                                        key={center.id}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        onClick={() => {
                                            setMapCenter({ lat: center.lat, lng: center.lng });
                                            setSelectedCenter(center);
                                            mapRef.current?.setZoom(15);
                                        }}
                                        className="help-center-card"
                                        style={{
                                            background: 'rgba(15, 23, 42, 0.65)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            borderRadius: '14px',
                                            padding: '16px',
                                            marginBottom: '12px',
                                            backdropFilter: 'blur(10px)',
                                            WebkitBackdropFilter: 'blur(10px)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '12px',
                                            transition: 'transform 0.3s, box-shadow 0.3s',
                                        }}
                                    >
                                        {/* 4. Left side: Content */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h3 style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: '600', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{center.name}</h3>
                                            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>
                                                {center.type}
                                            </div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {center.address}
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '500', color: center.openNow ? '#4ade80' : '#ef4444' }}>
                                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: center.openNow ? '#4ade80' : '#ef4444', display: 'inline-block' }}></span>
                                                {center.workingHours}
                                            </div>
                                        </div>

                                        {/* 4. Right side: Distance + Actions */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', flexShrink: 0 }}>
                                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px', color: 'var(--text-primary)', fontWeight: '600', fontSize: '12px', textAlign: 'center' }}>
                                                {center.distance} km
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <a
                                                    href={`tel:${center.phone}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', transition: 'background 0.2s' }}
                                                    title="Call Center"
                                                    className="action-btn"
                                                >
                                                    <Phone size={14} />
                                                </a>
                                                <button
                                                    onClick={(e) => handleGetDirections(e, center.lat, center.lng)}
                                                    style={{ border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.1)', color: '#A855F7', transition: 'background 0.2s' }}
                                                    title="Get Directions"
                                                    className="action-btn"
                                                >
                                                    <Navigation size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Scoped CSS Styles */}
            <style>{`
                .help-center-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
                }
                .action-btn:hover {
                    filter: brightness(1.2);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(255,255,255,0.15);
                    border-radius: 20px;
                }
                .custom-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #A855F7;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
                    border: 2px solid white;
                }
            `}</style>
        </div>
    );
};

export default HelpCenterLocator;
