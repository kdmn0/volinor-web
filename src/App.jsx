/**
 * App.jsx
 * Projenin ana giriş bileşenidir (Root Component).
 * Yükleme ekranı, UI (Kullanıcı Arayüzü) ve 3D sahneyi (Experience) bir araya getirerek
 * ana sayfa düzenini oluşturur.
 */
import { useEffect } from 'react';
import { Experience } from './scene/Experience';
import { ConfigPanel } from './components/layout/ConfigPanel';
import { LoadingScreen } from './components/feedback/LoadingScreen';
import { useConfigStore } from './store/useConfigStore';
import { AnimatePresence, motion } from 'motion/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RouteManager } from './router/RouteManager';
import AuthPage from './pages/auth/AuthPage';
import VerifyEmail from './pages/auth/VerifyEmail';
import ResetPassword from './pages/auth/ResetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import ModelLibraryPage from './pages/ModelLibraryPage';
import { AmbientParticles } from './components/effects/AmbientParticles';

function MainLayout() {
  const selectedPart = useConfigStore((state) => state.selectedPart);
  const activePage = useConfigStore((state) => state.activePage);

  return (
    <div className="w-full h-screen overflow-hidden bg-transparent font-sans selection:bg-white selection:text-black">
      <LoadingScreen />
      <ConfigPanel />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AmbientParticles />
        <AnimatePresence>
          {(selectedPart === 'subtitle3' || (selectedPart === null && activePage === null)) && (
            <motion.div
              key="orbit-rings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse 62% 52% at 50% 50%, rgba(18, 78, 170, 0.30) 0%, rgba(8, 130, 200, 0.11) 40%, transparent 68%)',
                }}
              />
              <svg
                viewBox="0 0 1920 1080"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                aria-hidden="true"
              >
                <g transform="translate(960, 540)" fill="none" stroke="#2a4a80">
                  <circle r="165" strokeWidth="1.1" opacity="0.20" />
                  <circle r="285" strokeWidth="1.1" opacity="0.23" />
                  <circle r="410" strokeWidth="1.2" opacity="0.20" />
                  <circle r="535" strokeWidth="1.1" opacity="0.16" />
                  <circle r="670" strokeWidth="1.0" opacity="0.11" />
                </g>
                <g transform="translate(960, 540)">
                  <g style={{ animation: 'orbit-cw 65s linear infinite', transformOrigin: '0 0' }}>
                    <circle r="225" strokeWidth="1.2" fill="none" stroke="#2a4a80" opacity="0.24" />
                    <circle r="470" strokeWidth="1.1" fill="none" stroke="#2a4a80" opacity="0.18" />
                    <g fill="#2a4a80" opacity="0.52">
                      <circle cx="225" cy="0" r="2.5" />
                      <circle cx="-225" cy="0" r="2.5" />
                      <circle cx="0" cy="225" r="2.5" />
                      <circle cx="0" cy="-225" r="2.5" />
                      <circle cx="159" cy="159" r="1.5" />
                      <circle cx="-159" cy="159" r="1.5" />
                      <circle cx="159" cy="-159" r="1.5" />
                      <circle cx="-159" cy="-159" r="1.5" />
                    </g>
                    <g fill="#2a4a80" opacity="0.38">
                      <circle cx="470" cy="0" r="3" />
                      <circle cx="-470" cy="0" r="3" />
                      <circle cx="0" cy="470" r="3" />
                      <circle cx="0" cy="-470" r="3" />
                      <circle cx="332" cy="332" r="2" />
                      <circle cx="-332" cy="332" r="2" />
                      <circle cx="332" cy="-332" r="2" />
                      <circle cx="-332" cy="-332" r="2" />
                    </g>
                  </g>
                </g>
                <g transform="translate(960, 540)">
                  <g style={{ animation: 'orbit-ccw 95s linear infinite', transformOrigin: '0 0' }}>
                    <circle r="348" strokeWidth="1.2" fill="none" stroke="#2a4a80" opacity="0.21" />
                    <circle r="595" strokeWidth="1.1" fill="none" stroke="#2a4a80" opacity="0.13" />
                    <g fill="#2a4a80" opacity="0.46">
                      <circle cx="348" cy="0" r="2" />
                      <circle cx="-348" cy="0" r="2" />
                      <circle cx="0" cy="348" r="2" />
                      <circle cx="0" cy="-348" r="2" />
                      <circle cx="246" cy="246" r="1.5" />
                      <circle cx="-246" cy="246" r="1.5" />
                      <circle cx="246" cy="-246" r="1.5" />
                      <circle cx="-246" cy="-246" r="1.5" />
                    </g>
                    <g fill="#2a4a80" opacity="0.30">
                      <circle cx="595" cy="0" r="3" />
                      <circle cx="-595" cy="0" r="3" />
                      <circle cx="0" cy="595" r="3" />
                      <circle cx="0" cy="-595" r="3" />
                    </g>
                  </g>
                </g>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="pointer-events-auto w-full h-full">
          <Experience />
        </div>
      </div>
    </div>
  );
}

import ModelDetailPage from './pages/ModelDetailPage';

function App() {
  const setIsLoggedIn = useConfigStore((s) => s.setIsLoggedIn);
  const setUserEmail = useConfigStore((s) => s.setUserEmail);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const email = localStorage.getItem('user_email');
    if (token) {
      setIsLoggedIn(true);
      if (email) setUserEmail(email);
    }
  }, [setIsLoggedIn, setUserEmail]);

  return (
    <BrowserRouter>
      <RouteManager />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/verify-email/:key" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="/model-kutuphanesi" element={<ModelLibraryPage />} />
        <Route path="/model-kutuphanesi/:id" element={<ModelDetailPage />} />
        <Route path="*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
