import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GalaxyBackground from './components/GalaxyBackground';
import PageTransition from './components/PageTransition';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext'; // Fixed path
import './App.css';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const EligibilityForm = lazy(() => import('./pages/EligibilityForm'));
const Results = lazy(() => import('./pages/Results'));
const ChatAssistant = lazy(() => import('./pages/ChatAssistant'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SchemeDirectory = lazy(() => import('./pages/SchemeDirectory'));
const HelpCenterLocator = lazy(() => import('./pages/HelpCenterLocator'));
const SchemeDetail = lazy(() => import('./pages/SchemeDetail'));
const CompareSchemes = lazy(() => import('./pages/CompareSchemes'));
const SavedSchemes = lazy(() => import('./pages/SavedSchemes'));
const MyApplications = lazy(() => import('./pages/MyApplications'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '50vh' }}>
    <div className="spinner"></div>
    <style>{`
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(255, 255, 255, 0.1);
                border-left-color: var(--blue);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}</style>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/check-eligibility" element={<PageTransition><EligibilityForm /></PageTransition>} />
        <Route path="/schemes" element={<PageTransition><SchemeDirectory /></PageTransition>} />
        <Route path="/results" element={<PageTransition><Results /></PageTransition>} />
        <Route path="/scheme/:id" element={<PageTransition><SchemeDetail /></PageTransition>} />
        <Route path="/compare" element={<PageTransition><CompareSchemes /></PageTransition>} />
        <Route path="/saved-schemes" element={<PageTransition><SavedSchemes /></PageTransition>} />
        <Route path="/my-applications" element={<PageTransition><MyApplications /></PageTransition>} />
        <Route path="/help-centers" element={<PageTransition><HelpCenterLocator /></PageTransition>} />
        <Route path="/assistant" element={<PageTransition><ChatAssistant /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <div className="flex-col min-h-screen">
            <GalaxyBackground />
            <Navbar />
            <main className="flex-grow" style={{ flex: 1, minHeight: 'calc(100vh - 140px)' }}>
              <Suspense fallback={<PageLoader />}>
                <AnimatedRoutes />
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
