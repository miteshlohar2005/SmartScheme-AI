import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, AlertTriangle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

// Custom icons for Map Markers
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const centerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper to generate centers near the user's location
const generateDummyCenters = (lat, lng) => [
  { id: 1, name: "Maha e-Seva Kendra - North", lat: lat + 0.015, lng: lng + 0.01, address: "123 Main St, Rural Sector" },
  { id: 2, name: "CSC Center - East", lat: lat - 0.012, lng: lng + 0.02, address: "45 Market Road, Village Square" },
  { id: 3, name: "Common Service Center - South", lat: lat - 0.02, lng: lng - 0.015, address: "Panchayat Bhawan, Block B" },
  { id: 4, name: "Maha e-Seva Kendra - West", lat: lat + 0.008, lng: lng - 0.025, address: "Near Government School" },
  { id: 5, name: "Digital Seva Center", lat: lat + 0.025, lng: lng - 0.005, address: "Tehsil Office Compound" },
];

const CenterLocator = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLocation({ lat, lng });
        setCenters(generateDummyCenters(lat, lng));
        setLoading(false);
      },
      (err) => {
        setError("Location access denied or unavailable. Please enable location services in your browser settings to find nearby centers.");
        setLoading(false);
      }
    );
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid var(--card-border)',
        margin: '2rem auto',
        maxWidth: '1000px',
        color: 'var(--text-primary)',
        boxShadow: 'var(--card-shadow)'
      }}
    >
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <MapPin size={28} color="var(--blue)" />
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>Find Nearest CSC / e-Seva Kendra</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>Locate nearby government service centers for assistance</p>
        </div>
      </div>

      {loading ? (
        <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--skeleton-bg)', borderRadius: '12px' }}>
          <Loader className="animate-spin" size={40} color="var(--blue)" style={{ marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Detecting your location...</p>
        </div>
      ) : error ? (
        <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
          <AlertTriangle size={50} color="var(--danger)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>Location Access Required</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>{error}</p>
        </div>
      ) : (
        <div style={{ borderRadius: '12px', overflow: 'hidden', height: '400px', border: '1px solid var(--card-border)' }}>
          <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Plot User Location */}
            <Marker position={[location.lat, location.lng]} icon={userIcon}>
              <Popup>
                <div style={{ color: 'black' }}>
                  <strong>You are here</strong>
                </div>
              </Popup>
            </Marker>
            
            {/* Plot Service Centers */}
            {centers.map(center => (
              <Marker key={center.id} position={[center.lat, center.lng]} icon={centerIcon}>
                <Popup>
                  <div style={{ color: 'black' }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{center.name}</h3>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>{center.address}</p>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '8px', color: '#3b82f6', textDecoration: 'none', fontWeight: '500' }}>
                      <Navigation size={14} /> Get Directions
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </motion.div>
  );
};

export default CenterLocator;
