import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import GlowButton from '../ui/GlowButton';
import Btn18 from '../ui/Btn18';
import { C, EASE_OUT } from './tokens';
import { GradientText } from './shared';

interface NavbarProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onGetStarted, onLogin }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = ['Features', 'How it Works', 'Pricing', 'FAQ'];

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase().replace(/ /g, '-'))?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="landing-navbar"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          background: 'rgba(11,15,25,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.png" alt="TaskMaster" style={{ width: 34, height: 34, borderRadius: 10, objectFit: 'contain' }} />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em' }}>
            Task<GradientText>Master</GradientText>
          </span>
        </div>

        {/* Desktop nav links */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="desktop-nav">
          {links.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              style={{
                background: 'none', border: 'none',
                color: C.textSecondary, fontSize: 14, fontWeight: 500,
                cursor: 'pointer', padding: '8px 14px', borderRadius: 8,
                transition: 'color 0.2s, background 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.color = '#fff';
                (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.color = C.textSecondary;
                (e.target as HTMLButtonElement).style.background = 'none';
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Btn18 onClick={onLogin}>
            Log in
          </Btn18>
          <GlowButton onClick={onGetStarted}>Get Started Free</GlowButton>
          <button
            onClick={() => setMobileOpen(true)}
            style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
            className="hamburger-btn"
          >
            <Menu size={22} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(11,15,25,0.98)',
              display: 'flex', flexDirection: 'column',
              padding: '24px 28px', gap: 8,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src="/logo.png" alt="TaskMaster" style={{ width: 30, height: 30, borderRadius: 9, objectFit: 'contain' }} />
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Task<GradientText>Master</GradientText></span>
              </div>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {links.map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(l)}
                style={{
                  background: 'none', border: 'none', color: '#fff',
                  fontSize: 18, fontWeight: 600, cursor: 'pointer',
                  textAlign: 'left', padding: '14px 0',
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                {l}
              </button>
            ))}

            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Btn18 onClick={onLogin} style={{ width: '100%', justifyContent: 'center' }}>Log in</Btn18>
              <GlowButton onClick={onGetStarted}>Get Started Free</GlowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* ── Desktop tweaks ── */
        @media (min-width: 641px) and (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: block !important; }
        }
        /* ── Hide full desktop navbar on mobile ── */
        @media (max-width: 640px) {
          .landing-navbar { display: none !important; }
        }
      `}</style>

      {/* ── Mobile-only slim top bar ── */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        className="mobile-topbar"
        style={{
          display: 'none',
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          height: 52,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          background: 'rgba(11,15,25,0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src="/logo.png" alt="TaskMaster" style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'contain' }} />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>
            Task<GradientText>Master</GradientText>
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={onGetStarted}
          style={{
            background: 'linear-gradient(135deg, #6366F1, #4f46e5)',
            border: 'none', borderRadius: 10,
            color: '#fff', fontWeight: 700, fontSize: 12,
            padding: '7px 14px', cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(99,102,241,0.4)',
          }}
        >
          Get Started
        </motion.button>
      </motion.div>

      <style>{`
        @media (max-width: 640px) {
          .mobile-topbar { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
