import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Flame, Sun, Moon, LogOut, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface MobileBottomNavProps {
  user: {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  };
  streak: number;
  onCreateTask?: () => void;
  onLogout?: () => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  user,
  streak,
  onCreateTask,
  onLogout,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [avatarError, setAvatarError] = useState(false);
  const [showStreakTip, setShowStreakTip] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const initials = (user.displayName || user.email || 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {/* Bottom Nav Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'var(--c-sidebar-bg)',
          borderTop: '1px solid var(--c-border)',
          borderRadius: '20px 20px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '8px 4px',
          paddingBottom: 'calc(8px + env(safe-area-inset-bottom))',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.18)',
        }}
      >
        {/* ── Profile ── */}
        <motion.div
          whileTap={{ scale: 0.88 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            cursor: 'default',
            position: 'relative',
          }}
        >
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                overflow: 'hidden',
                background:
                  'linear-gradient(135deg, var(--c-accent) 0%, var(--c-accent-dark) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1.5px solid var(--c-border-accent)',
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {user.photoURL && !avatarError ? (
                <img
                  src={user.photoURL}
                  alt={initials}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={() => setAvatarError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <User size={16} />
              )}
            </div>
            {streak > 0 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: -3,
                  right: -4,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  boxShadow: '0 1px 6px rgba(249,115,22,0.55)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Flame size={8} fill="#fff" strokeWidth={0} />
              </div>
            )}
          </div>
          <span
            style={{
              fontSize: 10,
              color: 'var(--c-text-dim)',
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            Profile
          </span>
        </motion.div>

        {/* ── Streak ── */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => setShowStreakTip((v) => !v)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Flame
              size={22}
              fill={streak > 0 ? '#fb923c' : 'var(--c-text-dim)'}
              strokeWidth={0}
              style={{
                filter:
                  streak > 0
                    ? 'drop-shadow(0 0 5px rgba(249,115,22,0.6))'
                    : 'none',
              }}
            />
            {streak > 0 && (
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#fb923c',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                {streak}
              </span>
            )}
          </div>
          <span
            style={{
              fontSize: 10,
              color: streak > 0 ? '#fb923c' : 'var(--c-text-dim)',
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            Streak
          </span>
        </motion.button>

        {/* ── + Add Task (center CTA) ── */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={onCreateTask}
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: 'linear-gradient(135deg, var(--c-accent) 0%, var(--c-accent-dark) 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow:
              '0 4px 20px var(--c-accent-glow), 0 0 0 2px rgba(99,102,241,0.2)',
          }}
        >
          <Plus size={26} color="#fff" strokeWidth={2.5} />
        </motion.button>

        {/* ── Theme Toggle ── */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={toggleTheme}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 10,
          }}
        >
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.span
                key="sun"
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 30, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex' }}
              >
                <Sun size={22} color="var(--c-text-dim)" strokeWidth={1.8} />
              </motion.span>
            ) : (
              <motion.span
                key="moon"
                initial={{ rotate: 30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -30, opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex' }}
              >
                <Moon size={22} color="var(--c-text-dim)" strokeWidth={1.8} />
              </motion.span>
            )}
          </AnimatePresence>
          <span
            style={{
              fontSize: 10,
              color: 'var(--c-text-dim)',
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </span>
        </motion.button>

        {/* ── Logout ── */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => setShowLogoutConfirm(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 10,
          }}
        >
          <LogOut size={22} color="var(--c-text-dim)" strokeWidth={1.8} />
          <span
            style={{
              fontSize: 10,
              color: 'var(--c-text-dim)',
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            Logout
          </span>
        </motion.button>
      </div>

      {/* ── Streak tooltip overlay ── */}
      <AnimatePresence>
        {showStreakTip && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            onClick={() => setShowStreakTip(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: 90,
            }}
          >
            <div
              style={{
                background: 'var(--c-tooltip-bg)',
                border: '1px solid var(--c-tooltip-border)',
                borderRadius: 12,
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 8px 32px var(--c-tooltip-shadow)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Flame
                size={20}
                fill={streak > 0 ? '#fb923c' : 'var(--c-text-dim)'}
                strokeWidth={0}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: streak > 0 ? '#fb923c' : 'var(--c-text-dim)',
                }}
              >
                {streak > 0 ? `${streak} day streak!` : 'No streak yet'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Logout confirm sheet ── */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 200,
              }}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 38 }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 201,
                background: 'var(--c-surface)',
                borderTop: '1px solid var(--c-border)',
                borderRadius: '20px 20px 0 0',
                padding: '20px 24px',
                paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
              }}
            >
              {/* Drag handle */}
              <div
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  background: 'var(--c-border)',
                  margin: '0 auto 20px',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: 'rgba(239,68,68,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LogOut size={20} color="#ef4444" strokeWidth={2} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'var(--c-text-primary)',
                      lineHeight: 1.3,
                    }}
                  >
                    Sign out?
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--c-text-dim)',
                      marginTop: 2,
                    }}
                  >
                    {user.displayName || user.email || 'User'}
                  </div>
                </div>
              </div>

              <div style={{ height: 1, background: 'var(--c-border)', margin: '16px 0' }} />

              <div style={{ display: 'flex', gap: 10 }}>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowLogoutConfirm(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 12,
                    border: '1px solid var(--c-border)',
                    background: 'transparent',
                    color: 'var(--c-text-primary)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    onLogout?.();
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 12,
                    border: 'none',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(239,68,68,0.35)',
                  }}
                >
                  Sign Out
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileBottomNav;
