import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import { MapPin, Search, Navigation, Phone, Filter, Compass, Loader, AlertTriangle, Clock, Map as MapIcon, Mic, Star, Globe, Copy, CheckCircle2, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const defaultCenter = { lat: 20.5937, lng: 78.9629 };

const getMarkerIcon = (type, isSelected) => {
    let color = '';
    switch (type) {
        case 'CSC': color = '#3b82f6'; break;
        case 'Panchayat': color = '#22c55e'; break;
        case 'Govt Office': color = '#ef4444'; break;
        default: color = '#64748b'; break;
    }
    return {
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: isSelected ? 3 : 1,
        strokeColor: isSelected ? '#ffffff' : '#ffffff',
        scale: isSelected ? 1.8 : 1.5,
        anchor: new window.google.maps.Point(12, 24)
    };
};

const libraries = ['places', 'geometry'];

const HelpCenterLocator = () => {
    const { t } = useTranslation();

    const [userLoc, setUserLoc] = useState(null);
    const [centers, setCenters] = useState([]);
    const [filteredCenters, setFilteredCenters] = useState([]);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [selectedCenter, setSelectedCenter] = useState(null);
    const [mapError, setMapError] = useState('');
    const [loadingLocation, setLoadingLocation] = useState(true);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchRadius, setSearchRadius] = useState(25);
    const [quickFilters, setQuickFilters] = useState({ openNow: false, within5km: false, topRated: false });
    const [voiceText, setVoiceText] = useState('');

    const mapRef = useRef(null);
    const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleApiKey || "",
        libraries: libraries
    });

    const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }, []);

    const fetchNearbyCenters = useCallback(async (lat, lng) => {
        setLoadingLocation(true);
        const mockCenters = [];
        const types = ['CSC', 'Panchayat', 'Govt Office'];
        const names = ['Gram Suvidha Kendra', 'Jan Seva CSC', 'Maha E-Seva', 'Village Council', 'District Collectorate Office', 'Municipal Corporation'];

        for (let i = 0; i < 40; i++) {
            const dLat = (Math.random() - 0.5) * 0.8;
            const dLng = (Math.random() - 0.5) * 0.8;
            const typeResult = types[i % types.length];
            const dist = calculateDistance(lat, lng, lat + dLat, lng + dLng);
            const isOpen = Math.random() > 0.3;

            mockCenters.push({
                id: `center-${i}`,
                name: `${names[i % names.length]} - Branch ${i}`,
                type: typeResult,
                lat: lat + dLat,
                lng: lng + dLng,
                distance: parseFloat(dist.toFixed(1)),
                address: `Survey No ${Math.floor(Math.random()*100)}, Main Road, District XYZ`,
                phone: `+91 9${Math.floor(Math.random() * 1000000000)}`,
                openNow: isOpen,
                workingHours: isOpen ? "09:00 AM - 05:00 PM" : "Closed",
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                reviewCount: Math.floor(Math.random() * 500) + 10,
                website: 'https://example.gov.in'
            });
        }

        const sorted = mockCenters.sort((a, b) => a.distance - b.distance);
        setCenters(sorted);
        setLoadingLocation(false);
    }, [calculateDistance]);

    const requestLocation = useCallback(() => {
        setLoadingLocation(true);
        setMapError('');
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
                    setUserLoc(pos);
                    setMapCenter(pos);
                    fetchNearbyCenters(pos.lat, pos.lng);
                },
                (err) => {
                    console.error("Location error:", err);
                    setMapError('Location access denied. Displaying default centers.');
                    fetchNearbyCenters(defaultCenter.lat, defaultCenter.lng);
                },
                { enableHighAccuracy: true, timeout: 5000 }
            );
        } else {
            setMapError('Geolocation not supported. Displaying default centers.');
            fetchNearbyCenters(defaultCenter.lat, defaultCenter.lng);
        }
    }, [fetchNearbyCenters]);

    useEffect(() => { requestLocation(); }, [requestLocation]);

    useEffect(() => {
        if (!centers.length) return;
        let result = centers;
        result = result.filter(c => c.distance <= searchRadius);
        if (activeFilter !== 'All') result = result.filter(c => c.type === activeFilter);
        if (quickFilters.openNow) result = result.filter(c => c.openNow);
        if (quickFilters.within5km) result = result.filter(c => c.distance <= 5);
        if (quickFilters.topRated) result = result.filter(c => parseFloat(c.rating) >= 4.5);
        if (searchQuery) {
            const sq = searchQuery.toLowerCase();
            result = result.filter(c => c.name.toLowerCase().includes(sq) || c.address.toLowerCase().includes(sq));
        }
        if (voiceText) {
            const vt = voiceText.toLowerCase();
            result = result.filter(c => c.name.toLowerCase().includes(vt) || c.type.toLowerCase().includes(vt));
        }
        setFilteredCenters(result);
    }, [activeFilter, searchRadius, centers, quickFilters, searchQuery, voiceText]);

    const onLoad = useCallback((map) => { mapRef.current = map; }, []);
    const onUnmount = useCallback(() => { mapRef.current = null; }, []);

    const handleGetDirections = (e, destLat, destLng) => {
        e.stopPropagation();
        setDirectionsResponse(null);
        if (!userLoc) return alert("Please enable location access first.");
        
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route({
            origin: userLoc, destination: { lat: destLat, lng: destLng }, travelMode: window.google.maps.TravelMode.DRIVING
        }, (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) setDirectionsResponse(result);
            else alert("Could not calculate directions.");
        });
    };

    const handleCopy = (e, text, id) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleQuickFilter = (key) => {
        setQuickFilters(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (loadError) return <div className="container" style={{ paddingTop: '8rem', textAlign: 'center', color: '#ef4444' }}>Critical Map Error</div>;

    const stats = {
        total: filteredCenters.length,
        csc: filteredCenters.filter(c => c.type === 'CSC').length,
        panchayat: filteredCenters.filter(c => c.type === 'Panchayat').length,
        govt: filteredCenters.filter(c => c.type === 'Govt Office').length,
        open: filteredCenters.filter(c => c.openNow).length
    };

    return (
        <div style={{ background: 'transparent', paddingBottom: '4rem', color: 'var(--text-primary)' }}>
            <div className="page-header" style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: 'none' }}>
                <h1 className="page-title">Offline Help Centers</h1>
                <p className="page-subtitle">Find and navigate to nearby CSCs, Panchayats, and Government Offices instantly.</p>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '1600px', width: '95%', margin: '0 auto' }}>
                
                {/* Dashboard Stats (4 Columns) */}
                <div className="stats-grid">
                    {[
                        { label: 'Total Found', val: stats.total, icon: MapIcon, color: '#A855F7', bg: 'rgba(168, 85, 247, 0.1)' },
                        { label: 'CSC Centers', val: stats.csc, icon: Building2, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
                        { label: 'Panchayats', val: stats.panchayat, icon: Building2, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
                        { label: 'Govt Offices', val: stats.govt, icon: Building2, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
                    ].map((s, i) => (
                        <div key={i} style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', backdropFilter: 'blur(10px)' }}>
                            <div style={{ background: s.bg, color: s.color, padding: '0.75rem', borderRadius: '0.75rem' }}><s.icon size={24} /></div>
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', lineHeight: '1' }}>{loadingLocation ? '-' : s.val}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', marginTop: '0.25rem' }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Compact Search & Filters */}
                <div style={{ background: 'rgba(15,23,42,0.75)', borderRadius: '1rem', padding: '1rem', marginBottom: '1rem', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Search Row */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ position: 'relative', flex: 1 }}>
                                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                                <input type="text" placeholder="Search centers by name or address..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '0.75rem', outline: 'none' }} />
                            </div>
                            <button onClick={requestLocation} disabled={loadingLocation} title="Locate Me" style={{ background: userLoc ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.05)', color: userLoc ? '#4ade80' : '#cbd5e1', border: `1px solid ${userLoc ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255,255,255,0.1)'}`, padding: '0.6rem', borderRadius: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                                {loadingLocation ? <Loader size={20} className="animate-spin" /> : <Compass size={20} />}
                            </button>
                        </div>
                        {/* Filters Row */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {['All', 'CSC', 'Panchayat', 'Govt Office'].map(f => (
                                <button key={f} onClick={() => setActiveFilter(f)} style={{ borderRadius: '2rem', padding: '0.4rem 1rem', fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s', background: activeFilter === f ? 'var(--blue)' : 'rgba(255,255,255,0.05)', color: activeFilter === f ? 'white' : 'var(--slate-300)', border: activeFilter === f ? '1px solid var(--blue)' : '1px solid rgba(255,255,255,0.1)' }}>{f}</button>
                            ))}
                            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 0.5rem' }}></div>
                            {[ {k:'openNow', l:'Open Now'}, {k:'within5km', l:'Within 5 km'}, {k:'topRated', l:'Top Rated'} ].map(qf => (
                                <button key={qf.k} onClick={() => toggleQuickFilter(qf.k)} style={{ borderRadius: '2rem', padding: '0.4rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer', background: quickFilters[qf.k] ? 'rgba(168, 85, 247, 0.2)' : 'transparent', color: quickFilters[qf.k] ? '#d8b4fe' : 'var(--slate-400)', border: quickFilters[qf.k] ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    {quickFilters[qf.k] && <CheckCircle2 size={12} />} {qf.l}
                                </button>
                            ))}
                        </div>
                        {/* Radius Slider */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'white', marginBottom: '0.25rem' }}>
                                <span>Search Radius: <strong>{searchRadius} km</strong></span>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input type="range" min="5" max="50" step="5" value={searchRadius} onChange={e => setSearchRadius(Number(e.target.value))} className="custom-slider" style={{ width: '100%', height: '6px', borderRadius: '4px', appearance: 'none', background: `linear-gradient(to right, var(--blue) ${(searchRadius-5)/45*100}%, rgba(255,255,255,0.1) ${(searchRadius-5)/45*100}%)`, cursor: 'pointer', outline: 'none' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                                    <span>5km</span><span>25km</span><span>50km</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="main-content-grid">
                    
                    {/* Left Panel: Map (Sticky on Desktop) */}
                    <div className="map-container" style={{ position: 'sticky', top: '120px', height: '700px', background: 'rgba(15, 23, 42, 0.65)', borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                        {!isLoaded || loadingLocation ? (
                            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}>
                                <Loader className="animate-spin" size={48} style={{ marginBottom: '1rem' }} />
                                <p style={{ color: 'var(--slate-300)' }}>Initializing mapping systems...</p>
                            </div>
                        ) : (
                            <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={mapCenter} zoom={13} onLoad={onLoad} onUnmount={onUnmount} options={{ mapTypeControl: false, streetViewControl: false, styles: [ { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] }, { featureType: 'all', elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] }, { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] }, { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#242f3e' }] }, { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] }, { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] }, { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] }, { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] } ] }}>
                                {userLoc && <Marker position={userLoc} icon={{ path: window.google.maps.SymbolPath.CIRCLE, fillColor: '#38bdf8', fillOpacity: 1, scale: 8, strokeColor: '#ffffff', strokeWeight: 2 }} title="You are here" />}
                                {filteredCenters.map(center => (
                                    <Marker key={center.id} position={{ lat: center.lat, lng: center.lng }} icon={getMarkerIcon(center.type, selectedCenter?.id === center.id)} onClick={() => { setSelectedCenter(center); setMapCenter({ lat: center.lat, lng: center.lng }); mapRef.current?.setZoom(15); document.getElementById(center.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} />
                                ))}
                                {selectedCenter && (
                                    <InfoWindow position={{ lat: selectedCenter.lat, lng: selectedCenter.lng }} onCloseClick={() => setSelectedCenter(null)} options={{ pixelOffset: new window.google.maps.Size(0, -30) }}>
                                        <div style={{ padding: '0.5rem', maxWidth: '220px', color: '#0f172a' }}>
                                            <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', fontSize: '1.05rem', color: '#0f172a' }}>{selectedCenter.name}</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                                <Star size={14} color="#f59e0b" fill="#f59e0b" /> <strong>{selectedCenter.rating}</strong> ({selectedCenter.reviewCount} reviews)
                                            </div>
                                            <p style={{ margin: '0 0 0.5rem 0', color: '#475569', fontSize: '0.85rem' }}>{selectedCenter.type} • {selectedCenter.distance} km away</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: selectedCenter.openNow ? '#16a34a' : '#dc2626', fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: '500' }}>
                                                <Clock size={14} /> {selectedCenter.openNow ? `Open Now • ${selectedCenter.workingHours}` : 'Closed'}
                                            </div>
                                            <button onClick={(e) => handleGetDirections(e, selectedCenter.lat, selectedCenter.lng)} style={{ width: '100%', background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>
                                                <Navigation size={14} /> Navigate Here
                                            </button>
                                        </div>
                                    </InfoWindow>
                                )}
                                {directionsResponse && <DirectionsRenderer directions={directionsResponse} options={{ suppressMarkers: true, polylineOptions: { strokeColor: '#38bdf8', strokeWeight: 6, strokeOpacity: 0.8 } }} />}
                            </GoogleMap>
                        )}
                        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '1rem', fontSize: '0.8rem', fontWeight: '500', color: 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} color="#3b82f6" /> CSC</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} color="#22c55e" /> Panchayat</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} color="#ef4444" /> Govt</div>
                        </div>
                    </div>

                    {/* Right Panel: Free Scrolling List */}
                    <div className="list-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {loadingLocation ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div className="skeleton-pulse" style={{ width: '60%', height: '20px', borderRadius: '4px', marginBottom: '1rem', background: 'rgba(255,255,255,0.1)' }}></div>
                                    <div className="skeleton-pulse" style={{ width: '100%', height: '14px', borderRadius: '4px', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.1)' }}></div>
                                    <div className="skeleton-pulse" style={{ width: '80%', height: '14px', borderRadius: '4px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.1)' }}></div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <div className="skeleton-pulse" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                                        <div className="skeleton-pulse" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                                    </div>
                                </div>
                            ))
                        ) : filteredCenters.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '1rem', border: '1px dashed rgba(255,255,255,0.1)', color: 'var(--slate-400)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <MapIcon size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                                <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Centers Found</h3>
                                <p style={{ fontSize: '0.9rem' }}>Try increasing the search radius or modifying your filters to find more locations.</p>
                                <button onClick={() => { setSearchRadius(50); setActiveFilter('All'); setQuickFilters({openNow: false, within5km: false, topRated: false}); setSearchQuery(''); }} style={{ marginTop: '1.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>Reset Filters</button>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {filteredCenters.map((center, idx) => (
                                    <motion.div
                                        id={center.id}
                                        key={center.id}
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                                        onClick={() => { setSelectedCenter(center); setMapCenter({ lat: center.lat, lng: center.lng }); mapRef.current?.setZoom(15); }}
                                        style={{ background: selectedCenter?.id === center.id ? 'rgba(59, 130, 246, 0.1)' : 'rgba(15, 23, 42, 0.65)', border: selectedCenter?.id === center.id ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem', cursor: 'pointer', transition: 'all 0.3s', backdropFilter: 'blur(10px)' }}
                                        className="help-center-card"
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', color: 'var(--slate-300)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.1)' }}>{center.type}</div>
                                            <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>{center.distance} km</div>
                                        </div>
                                        
                                        <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem', lineHeight: '1.4' }}>{center.name}</h3>
                                        
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                                            <Star size={14} color="#f59e0b" fill="#f59e0b" />
                                            <strong style={{ color: 'white' }}>{center.rating}</strong>
                                            <span style={{ color: 'var(--slate-400)' }}>({center.reviewCount} reviews)</span>
                                        </div>

                                        <p style={{ color: 'var(--slate-300)', fontSize: '0.85rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                            <MapPin size={14} color="var(--slate-400)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                            <span>{center.address}</span>
                                        </p>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '500', color: center.openNow ? '#4ade80' : '#ef4444', marginBottom: '1rem' }}>
                                            <Clock size={14} /> {center.openNow ? `Open • ${center.workingHours}` : 'Closed'}
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <a href={`tel:${center.phone}`} onClick={e => e.stopPropagation()} className="action-btn bg-green"><Phone size={16} /></a>
                                            <button onClick={e => handleGetDirections(e, center.lat, center.lng)} className="action-btn bg-blue"><Navigation size={16} /></button>
                                            <a href={center.website} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="action-btn bg-purple"><Globe size={16} /></a>
                                            <button onClick={e => handleCopy(e, center.address, center.id)} className="action-btn bg-slate" style={{ marginLeft: 'auto', width: 'auto', padding: '0 12px', fontSize: '0.75rem', gap: '0.25rem' }}>
                                                {copiedId === center.id ? <><CheckCircle2 size={14} color="#4ade80" /> Copied</> : <><Copy size={14} /> Copy</>}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .stats-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 20px; }
                @media (min-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (min-width: 1024px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }

                .main-content-grid { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: start; }
                @media (min-width: 1024px) { .main-content-grid { grid-template-columns: 45% 55%; } }

                .help-center-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
                .action-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; border: none; cursor: pointer; transition: all 0.2s; color: white; text-decoration: none; }
                .action-btn:hover { filter: brightness(1.2); transform: scale(1.05); }
                .bg-green { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
                .bg-blue { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
                .bg-purple { background: rgba(168, 85, 247, 0.2); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.3); }
                .bg-slate { background: rgba(255, 255, 255, 0.05); color: #cbd5e1; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem; }
                
                .custom-slider::-webkit-slider-thumb {
                    -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--blue);
                    cursor: pointer; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); border: 2px solid white; transition: transform 0.2s;
                }
                .custom-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
                
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                .skeleton-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            `}</style>
        </div>
    );
};

export default HelpCenterLocator;
