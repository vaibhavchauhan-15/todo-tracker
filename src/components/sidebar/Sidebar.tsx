import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare,
  Calendar,
  CalendarDays,
  CalendarRange,
  LayoutGrid,
  CheckCircle2,
  LogOut,
  ChevronLeft,
  Plus,
  Sun,
  Moon,
  Flame,
} from 'lucide-react';
import { useSidebar } from './SidebarContext';
import SidebarItem from './SidebarItem';
import { useTheme } from '../../contexts/ThemeContext';

interface SidebarProps {
  user: {
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  };
  onCreateTask?: () => void;
  onLogout?: () => void;
  onNavChange?: (key: string) => void;
  streak?: number;
}

const W_EXPANDED  = 260;
const W_COLLAPSED = 68;

const NAV_ITEMS = [
  { key: 'daily',     label: 'Daily Tasks',     icon: <CheckSquare   size={18} /> },
  { key: 'weekly',    label: 'Weekly Tasks',    icon: <Calendar      size={18} /> },
  { key: 'monthly',   label: 'Monthly Tasks',   icon: <CalendarDays  size={18} /> },
  { key: 'yearly',    label: 'Yearly Tasks',    icon: <CalendarRange size={18} /> },
  { key: 'all',       label: 'All Tasks',       icon: <LayoutGrid    size={18} /> },
  { key: 'completed', label: 'Completed Tasks', icon: <CheckCircle2  size={18} /> },
];

// ─── Tooltip — portal-based, escapes sidebar overflow:hidden ─────────────────
const Tooltip: React.FC<{ label: string; top: number; left: number }> = ({ label, top, left }) =>
  ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0, x: -6, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -4, scale: 0.95 }}
      transition={{ duration: 0.13, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        left,
        top,
        transform: 'translateY(-50%)',
        background: 'var(--c-tooltip-bg)',
        border: '1px solid var(--c-tooltip-border)',
        color: 'var(--c-tooltip-text)',
        fontSize: 12,
        fontWeight: 600,
        padding: '5px 10px',
        borderRadius: 7,
        whiteSpace: 'nowrap',
        zIndex: 9999,
        boxShadow: '0 6px 24px var(--c-tooltip-shadow)',
        pointerEvents: 'none',
      }}
    >
      {label}
      <span style={{
        position: 'absolute', right: 'calc(100% - 1px)', top: '50%',
        transform: 'translateY(-50%)', width: 0, height: 0,
        borderTop: '5px solid transparent', borderBottom: '5px solid transparent',
        borderRight: '6px solid var(--c-tooltip-border)',
      }} />
      <span style={{
        position: 'absolute', right: '100%', top: '50%',
        transform: 'translateY(-50%)', width: 0, height: 0,
        borderTop: '4px solid transparent', borderBottom: '4px solid transparent',
        borderRight: '5px solid var(--c-tooltip-bg)',
      }} />
    </motion.div>,
    document.body
  );

// ─── Rich profile tooltip ─────────────────────────────────────────────────────
const ProfileTooltip: React.FC<{
  displayName: string | null;
  email: string | null;
  streak: number;
  top: number;
  left: number;
}> = ({ displayName, email, streak, top, left }) =>
  ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0, x: -8, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -6, scale: 0.95 }}
      transition={{ duration: 0.14, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        left,
        top,
        transform: 'translateY(-50%)',
        background: 'var(--c-tooltip-bg)',
        border: '1px solid var(--c-tooltip-border)',
        borderRadius: 11,
        padding: '11px 13px',
        zIndex: 9999,
        boxShadow: '0 8px 32px var(--c-tooltip-shadow)',
        pointerEvents: 'none',
        minWidth: 168,
      }}
    >
      <span style={{
        position: 'absolute', right: 'calc(100% - 1px)', top: '50%',
        transform: 'translateY(-50%)', width: 0, height: 0,
        borderTop: '6px solid transparent', borderBottom: '6px solid transparent',
        borderRight: '7px solid var(--c-tooltip-border)',
      }} />
      <span style={{
        position: 'absolute', right: '100%', top: '50%',
        transform: 'translateY(-50%)', width: 0, height: 0,
        borderTop: '5px solid transparent', borderBottom: '5px solid transparent',
        borderRight: '6px solid var(--c-tooltip-bg)',
      }} />
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-tooltip-text)', lineHeight: 1.3, marginBottom: 3 }}>
        {displayName || 'User'}
      </div>
      {email && (
        <div style={{ fontSize: 11, color: 'var(--c-text-dim)', lineHeight: 1.5, marginBottom: streak > 0 ? 8 : 0 }}>
          {email}
        </div>
      )}
      {streak > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingTop: 8, borderTop: '1px solid var(--c-border)' }}>
          <Flame size={12} fill="#fb923c" strokeWidth={0} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#fb923c' }}>{streak} day streak</span>
        </div>
      )}
    </motion.div>,
    document.body
  );

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
const Sidebar: React.FC<SidebarProps> = ({ user, onCreateTask, onLogout, onNavChange, streak = 0 }) => {
  const { expanded, toggle, setActiveNav } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const [avatarError, setAvatarError]     = useState(false);
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [createHovered, setCreateHovered] = useState(false);
  const [themeHovered, setThemeHovered]   = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const createRef  = useRef<HTMLDivElement>(null);
  const themeRef   = useRef<HTMLDivElement>(null);

  const [profileTip, setProfileTip] = useState({ top: 0, left: 0 });
  const [createTip,  setCreateTip]  = useState({ top: 0, left: 0 });
  const [themeTip,   setThemeTip]   = useState({ top: 0, left: 0 });

  const computeTip = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      return { top: r.top + r.height / 2, left: r.right + 10 };
    }
    return { top: 0, left: 0 };
  };

  const initials = (user.displayName || user.email || 'U')
    .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const handleNav = (key: string) => { setActiveNav(key); onNavChange?.(key); };

  return (
    <motion.aside
      animate={{ width: expanded ? W_EXPANDED : W_COLLAPSED }}
      transition={{ type: 'spring', stiffness: 300, damping: 36 }}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0, top: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--c-sidebar-bg)',
        borderRight: '1px solid var(--c-sidebar-divider)',
        borderRadius: '0 20px 20px 0',
        boxShadow: '2px 0 24px rgba(0,0,0,0.16)',
      }}
    >

      {/* ══ HEADER — fixed 56px, toggle always centered when collapsed ════════ */}
      <div style={{
        height: 56, flexShrink: 0,
        display: 'flex', alignItems: 'center',
        justifyContent: expanded ? 'space-between' : 'center',
        padding: expanded ? '0 12px 0 16px' : '0',
        overflow: 'hidden',
      }}>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: 9, overflow: 'hidden', flex: 1, minWidth: 0 }}
            >
              <img src="/logo.png" alt="TaskMaster"
                style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'contain', flexShrink: 0 }} />
              <span style={{
                fontSize: 15, fontWeight: 800, color: 'var(--c-text-primary)',
                letterSpacing: '-0.025em', whiteSpace: 'nowrap',
              }}>
                TaskMaster
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button" onClick={toggle}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            border: '1px solid var(--c-border)', background: 'transparent',
            color: 'var(--c-text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background 0.15s, color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background = 'var(--c-accent-bg-hover)';
            b.style.color = 'var(--c-accent)';
            b.style.borderColor = 'var(--c-border-accent)';
          }}
          onMouseLeave={e => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background = 'transparent';
            b.style.color = 'var(--c-text-dim)';
            b.style.borderColor = 'var(--c-border)';
          }}
        >
          <motion.span
            animate={{ rotate: expanded ? 0 : 180 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ display: 'flex' }}
          >
            <ChevronLeft size={14} />
          </motion.span>
        </motion.button>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'var(--c-sidebar-divider)', flexShrink: 0 }} />

      {/* ══ USER PROFILE — single layout, no swap, no vertical layout shift ══
          Avatar + badge always visible. Name/email/streak animate in/out.     */}
      <div style={{ padding: '10px 8px', flexShrink: 0 }}>
        <div
          ref={profileRef}
          style={{
            position: 'relative',
            borderRadius: 12,
            background: 'var(--c-surface)',
            border: '1px solid var(--c-border)',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 101,
          }}
          onMouseEnter={() => {
            if (!expanded) {
              setProfileTip(computeTip(profileRef));
              setAvatarHovered(true);
            }
          }}
          onMouseLeave={() => setAvatarHovered(false)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {/* Avatar + streak badge — always visible */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, var(--c-accent) 0%, var(--c-accent-dark) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1.5px solid var(--c-border-accent)',
                fontSize: 13, fontWeight: 700, color: '#fff',
              }}>
                {user.photoURL && !avatarError ? (
                  <img src={user.photoURL} alt={initials}
                    onError={() => setAvatarError(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : initials}
              </div>
              {streak > 0 && (
                <div style={{
                  position: 'absolute', bottom: -3, right: -4,
                  width: 16, height: 16, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  boxShadow: '0 1px 6px rgba(249,115,22,0.55)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 2,
                }}>
                  <Flame size={9} fill="#fff" strokeWidth={0} />
                </div>
              )}
            </div>

            {/* Name + email — fade/collapse when sidebar is collapsed */}
            <motion.div
              animate={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: 'hidden', minWidth: 0, flex: 1 }}
            >
              <div style={{
                fontSize: 13, fontWeight: 700, color: 'var(--c-text-primary)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3,
              }}>
                {user.displayName || 'User'}
              </div>
              <div style={{
                fontSize: 11, color: 'var(--c-text-dim)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.5, marginTop: 1,
              }}>
                {user.email || ''}
              </div>
            </motion.div>
          </div>

          {/* Streak row — fixed height, no layout shift. Cross-fades between expanded/collapsed content */}
          <div style={{
            marginTop: 9,
            borderTop: '1px solid var(--c-border)',
            position: 'relative',
            height: 36,
            flexShrink: 0,
          }}>
            {/* Expanded: full "N day streak" label */}
            <motion.div
              animate={{ opacity: expanded ? 1 : 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: 'absolute', top: 8, left: 0, right: 0,
                display: 'flex', alignItems: 'center', gap: 6,
                pointerEvents: 'none',
              }}
            >
              <Flame size={14} fill={streak > 0 ? '#fb923c' : 'var(--c-text-dim)'} strokeWidth={0} />
              <span style={{ fontSize: 12, fontWeight: 600, color: streak > 0 ? '#fb923c' : 'var(--c-text-dim)', whiteSpace: 'nowrap' }}>
                {streak > 0 ? `${streak} day streak` : 'No streak yet'}
              </span>
            </motion.div>
            {/* Collapsed: large flame + day count, centered */}
            <motion.div
              animate={{ opacity: expanded ? 0 : 1 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: 'absolute', top: 5, left: 0, right: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
                pointerEvents: 'none',
              }}
            >
              <Flame size={20} fill={streak > 0 ? '#fb923c' : 'var(--c-text-dim)'} strokeWidth={0}
                style={{ filter: streak > 0 ? 'drop-shadow(0 0 5px rgba(249,115,22,0.6))' : 'none' }} />
              {streak > 0 && (
                <span style={{ fontSize: 13, fontWeight: 800, color: '#fb923c', lineHeight: 1, letterSpacing: '-0.02em' }}>{streak}</span>
              )}
            </motion.div>
          </div>

          {/* Rich tooltip shown on collapsed hover — portaled to body */}
          <AnimatePresence>
            {!expanded && avatarHovered && (
              <ProfileTooltip
                displayName={user.displayName}
                email={user.email}
                streak={streak}
                top={profileTip.top}
                left={profileTip.left}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ══ CREATE TASK BUTTON ══════════════════════════════════════════════ */}
      <div style={{ padding: '0 8px 10px', flexShrink: 0 }}>
        <div
          ref={createRef}
          style={{ position: 'relative' }}
          onMouseEnter={() => {
            setCreateTip(computeTip(createRef));
            setCreateHovered(true);
          }}
          onMouseLeave={() => setCreateHovered(false)}
        >
          <motion.button
            type="button" onClick={onCreateTask}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            style={{
              width: '100%', height: 40, borderRadius: 10,
              border: '1px solid var(--c-border-accent)',
              background: 'var(--c-accent)', color: '#fff',
              display: 'flex', alignItems: 'center',
              justifyContent: expanded ? 'flex-start' : 'center',
              gap: expanded ? 8 : 0,
              padding: expanded ? '0 14px' : '0',
              cursor: 'pointer', fontSize: 13.5, fontWeight: 600,
              letterSpacing: '0.01em',
              transition: 'opacity 0.15s, box-shadow 0.2s',
              boxShadow: '0 2px 10px var(--c-accent-glow-sm)',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '0.87';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px var(--c-accent-glow)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '1';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 10px var(--c-accent-glow-sm)';
            }}
          >
            <Plus size={16} style={{ flexShrink: 0 }} />
            <motion.span
              animate={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap', pointerEvents: 'none' }}
            >
              New Task
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {!expanded && createHovered && <Tooltip label="New Task" top={createTip.top} left={createTip.left} />}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'var(--c-sidebar-divider)', flexShrink: 0 }} />

      {/* ══ NAVIGATION — stable positions, no vertical shift ════════════════
          "Menu" label always occupies 20px height; only its opacity changes.  */}
      <nav style={{ flex: 1, padding: '8px 8px 4px', overflowY: 'auto', overflowX: 'visible' }}>
        <div style={{ height: 20, display: 'flex', alignItems: 'center', padding: '0 6px', marginBottom: 4 }}>
          <motion.span
            animate={{ opacity: expanded ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            style={{
              fontSize: 10, fontWeight: 700, color: 'var(--c-text-dim)',
              letterSpacing: '0.10em', textTransform: 'uppercase',
            }}
          >
            Menu
          </motion.span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(item => (
            <SidebarItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              navKey={item.key}
              onClick={() => handleNav(item.key)}
            />
          ))}
        </div>
      </nav>

      {/* ══ BOTTOM: THEME + LOGOUT ══════════════════════════════════════════ */}
      <div style={{
        padding: '8px 8px 16px',
        borderTop: '1px solid var(--c-sidebar-divider)',
        flexShrink: 0,
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        <div
          ref={themeRef}
          style={{ position: 'relative' }}
          onMouseEnter={() => {
            setThemeTip(computeTip(themeRef));
            setThemeHovered(true);
          }}
          onMouseLeave={() => setThemeHovered(false)}
        >
          <motion.button
            type="button" onClick={toggleTheme} whileTap={{ scale: 0.95 }}
            style={{
              width: '100%', height: 40,
              display: 'flex', alignItems: 'center',
              gap: expanded ? 12 : 0,
              justifyContent: expanded ? 'flex-start' : 'center',
              padding: expanded ? '0 14px' : '0',
              borderRadius: 10, border: 'none', cursor: 'pointer',
              background: 'transparent', color: 'var(--c-sidebar-text)',
              fontSize: 13.5, fontWeight: 500, fontFamily: 'inherit',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = 'var(--c-surface)';
              b.style.color = 'var(--c-text-primary)';
            }}
            onMouseLeave={e => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = 'transparent';
              b.style.color = 'var(--c-sidebar-text)';
            }}
          >
            {theme === 'dark'
              ? <Sun  size={17} style={{ flexShrink: 0 }} />
              : <Moon size={17} style={{ flexShrink: 0 }} />}
            <motion.span
              animate={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap', pointerEvents: 'none' }}
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {!expanded && themeHovered && (
              <Tooltip label={theme === 'dark' ? 'Light mode' : 'Dark mode'} top={themeTip.top} left={themeTip.left} />
            )}
          </AnimatePresence>
        </div>

        <SidebarItem
          icon={<LogOut size={17} />}
          label="Logout"
          navKey="__logout__"
          onClick={onLogout}
          variant="danger"
        />
      </div>
    </motion.aside>
  );
};

export default Sidebar;
