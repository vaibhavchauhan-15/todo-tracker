import React, { useState } from 'react';
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

const SIDEBAR_EXPANDED  = 260;
const SIDEBAR_COLLAPSED = 70;

const NAV_ITEMS = [
  { key: 'daily',     label: 'Daily Tasks',     icon: <CheckSquare   size={18} /> },
  { key: 'weekly',    label: 'Weekly Tasks',    icon: <Calendar      size={18} /> },
  { key: 'monthly',   label: 'Monthly Tasks',   icon: <CalendarDays  size={18} /> },
  { key: 'yearly',    label: 'Yearly Tasks',    icon: <CalendarRange size={18} /> },
  { key: 'all',       label: 'All Tasks',       icon: <LayoutGrid    size={18} /> },
  { key: 'completed', label: 'Completed Tasks', icon: <CheckCircle2  size={18} /> },
];

const Sidebar: React.FC<SidebarProps> = ({ user, onCreateTask, onLogout, onNavChange, streak = 0 }) => {
  const { expanded, toggle, setActiveNav } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const [avatarError, setAvatarError] = useState(false);

  const initials = (user.displayName || user.email || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleNav = (key: string) => {
    setActiveNav(key);
    onNavChange?.(key);
  };

  return (
    <motion.aside
      animate={{ width: expanded ? SIDEBAR_EXPANDED : SIDEBAR_COLLAPSED }}
      transition={{ type: 'spring', stiffness: 320, damping: 38 }}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        overflowY: 'auto',
        background: 'var(--c-sidebar-bg)',
        borderRight: '1px solid var(--c-sidebar-divider)',
        borderRadius: '0 20px 20px 0',
        boxShadow: '2px 0 20px rgba(0,0,0,0.22)',
      }}
    >

      {/* ── Header: Logo + Collapse ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: expanded ? '18px 14px 18px 16px' : '18px 10px',
        minHeight: 60,
        flexShrink: 0,
      }}>
        <AnimatePresence>
          {!expanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src="/logo.png"
                alt="TaskMaster"
                style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'contain', display: 'block' }}
              />
            </motion.div>
          )}
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <img
                src="/logo.png"
                alt="TaskMaster"
                style={{ width: 30, height: 30, borderRadius: 9, objectFit: 'contain', flexShrink: 0 }}
              />
              <span style={{
                fontSize: 15, fontWeight: 800,
                color: 'var(--c-text-primary)',
                letterSpacing: '-0.02em', whiteSpace: 'nowrap',
              }}>
                TaskMaster
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={toggle}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          style={{
            width: 28, height: 28, borderRadius: 8,
            border: '1px solid var(--c-border)',
            background: 'transparent',
            color: 'var(--c-text-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
            transition: 'background 0.15s, color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = 'var(--c-accent-bg-hover)';
            btn.style.color = 'var(--c-accent)';
            btn.style.borderColor = 'var(--c-border-accent)';
          }}
          onMouseLeave={e => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = 'transparent';
            btn.style.color = 'var(--c-text-dim)';
            btn.style.borderColor = 'var(--c-border)';
          }}
        >
          <motion.span
            animate={{ rotate: expanded ? 0 : 180 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ display: 'flex' }}
          >
            <ChevronLeft size={15} />
          </motion.span>
        </motion.button>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'var(--c-sidebar-divider)', flexShrink: 0 }} />

      {/* ── User Profile Card ── */}
      <div style={{
        margin: expanded ? '12px 10px 0' : '12px 8px 0',
        padding: expanded ? '12px 12px 10px' : '10px 0',
        borderRadius: 12,
        background: 'var(--c-surface)',
        border: '1px solid var(--c-border)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: expanded ? 'flex-start' : 'center',
        gap: 0,
      }}>
        {/* Avatar row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: expanded ? 10 : 0,
          width: '100%',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, var(--c-accent) 0%, var(--c-accent-dark) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1.5px solid var(--c-border-accent)',
            fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.02em',
          }}>
            {user.photoURL && !avatarError ? (
              <img
                src={user.photoURL}
                alt={initials}
                onError={() => setAvatarError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : initials}
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden', minWidth: 0, flex: 1 }}
              >
                <div style={{
                  fontSize: 13, fontWeight: 700,
                  color: 'var(--c-text-primary)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  lineHeight: 1.3,
                }}>
                  {user.displayName || 'User'}
                </div>
                <div style={{
                  fontSize: 11, color: 'var(--c-text-dim)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  lineHeight: 1.4, marginTop: 2,
                }}>
                  {user.email || ''}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Streak row — inside the card */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{ width: '100%', overflow: 'hidden' }}
            >
              <div style={{
                marginTop: 10,
                paddingTop: 10,
                borderTop: '1px solid var(--c-border)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <Flame
                  size={13}
                  fill={streak > 0 ? '#fb923c' : 'var(--c-text-dim)'}
                  strokeWidth={0}
                />
                <motion.span
                  key={streak}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    fontSize: 12, fontWeight: 600,
                    color: streak > 0 ? '#fb923c' : 'var(--c-text-dim)',
                  }}
                >
                  {streak > 0 ? `${streak} day streak` : 'No streak yet'}
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed streak icon tooltip */}
        {!expanded && (
          <div
            title={streak > 0 ? `${streak} day streak` : 'No streak yet'}
            style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Flame
              size={14}
              fill={streak > 0 ? '#fb923c' : 'var(--c-text-dim)'}
              strokeWidth={0}
            />
          </div>
        )}
      </div>

      {/* ── Create Task Button ── */}
      <div style={{ padding: expanded ? '10px 10px 0' : '10px 8px 0', flexShrink: 0 }}>
        <motion.button
          type="button"
          onClick={onCreateTask}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.97 }}
          title="Create Task"
          style={{
            width: '100%', height: 40, borderRadius: 10,
            border: '1px solid var(--c-border-accent)',
            background: 'var(--c-accent)',
            color: '#fff',
            display: 'flex', alignItems: 'center',
            justifyContent: expanded ? 'flex-start' : 'center',
            gap: expanded ? 8 : 0,
            padding: expanded ? '0 14px' : '0',
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
            letterSpacing: '0.01em',
            transition: 'opacity 0.15s, box-shadow 0.2s',
            boxShadow: '0 2px 10px var(--c-accent-glow-sm)',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.opacity = '0.88';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 18px var(--c-accent-glow)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.opacity = '1';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 10px var(--c-accent-glow-sm)';
          }}
        >
          <Plus size={16} style={{ flexShrink: 0 }} />
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                New Task
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: '12px 8px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        <AnimatePresence>
          {expanded && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{
                fontSize: 10, fontWeight: 700,
                color: 'var(--c-text-dim)',
                letterSpacing: '0.10em', textTransform: 'uppercase',
                padding: '0 6px 6px',
                margin: 0,
              }}
            >
              Menu
            </motion.p>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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

      {/* ── Bottom: Theme + Logout ── */}
      <div style={{
        padding: '8px 8px 16px',
        borderTop: '1px solid var(--c-sidebar-divider)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}>
        <motion.button
          type="button"
          onClick={toggleTheme}
          whileTap={{ scale: 0.95 }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: '100%', height: 40,
            display: 'flex', alignItems: 'center',
            gap: expanded ? 12 : 0,
            justifyContent: expanded ? 'flex-start' : 'center',
            padding: expanded ? '0 14px' : '0',
            borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'transparent',
            color: 'var(--c-sidebar-text)',
            fontSize: 13.5, fontWeight: 500,
            fontFamily: 'inherit',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = 'var(--c-surface)';
            btn.style.color = 'var(--c-text-primary)';
          }}
          onMouseLeave={e => {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.background = 'transparent';
            btn.style.color = 'var(--c-sidebar-text)';
          }}
        >
          {theme === 'dark'
            ? <Sun size={17} style={{ flexShrink: 0 }} />
            : <Moon size={17} style={{ flexShrink: 0 }} />}
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap', pointerEvents: 'none' }}
              >
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

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
