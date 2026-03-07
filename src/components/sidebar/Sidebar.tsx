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
  Zap,
  Sun,
  Moon,
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

const Sidebar: React.FC<SidebarProps> = ({ user, onCreateTask, onLogout, onNavChange }) => {
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
        boxShadow: expanded
          ? '4px 0 32px rgba(0,0,0,0.28), inset -1px 0 0 var(--c-accent-glow-sm)'
          : '2px 0 12px rgba(0,0,0,0.18)',
      }}
    >
      {/* ── Top: Logo + Toggle ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: expanded ? 'space-between' : 'center',
        padding: expanded ? '20px 16px 16px' : '20px 0 16px',
        minHeight: 64,
        flexShrink: 0,
      }}>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <div style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: 'linear-gradient(135deg, var(--c-accent), var(--c-accent-dark))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 12px var(--c-accent-glow)',
                flexShrink: 0,
              }}>
                <Zap size={16} color="#fff" />
              </div>
              <span style={{
                fontSize: 15,
                fontWeight: 800,
                color: 'var(--c-text-primary)',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}>
                TaskMaster
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button */}
        <motion.button
          type="button"
          onClick={toggle}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          title={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            border: '1px solid var(--c-border)',
            background: 'var(--c-surface)',
            color: 'var(--c-sidebar-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'background 0.18s, color 0.18s, border-color 0.18s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--c-accent-bg-hover)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--c-accent)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--c-border-accent)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--c-surface)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--c-sidebar-text)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--c-border)';
          }}
        >
          <motion.span
            animate={{ rotate: expanded ? 0 : 180 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ display: 'flex' }}
          >
            <ChevronLeft size={16} />
          </motion.span>
        </motion.button>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'var(--c-sidebar-divider)', margin: '0 12px', flexShrink: 0 }} />

      {/* ── User Profile ── */}
      <div style={{
        padding: expanded ? '14px 14px 10px' : '14px 0 10px',
        display: 'flex',
        alignItems: 'center',
        gap: expanded ? 10 : 0,
        justifyContent: expanded ? 'flex-start' : 'center',
        flexShrink: 0,
      }}>
        {/* Avatar */}
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          flexShrink: 0,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--c-accent) 0%, var(--c-accent-dark) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid var(--c-border-accent)',
          boxShadow: '0 2px 12px var(--c-accent-glow)',
          transition: 'border-color 0.25s',
          fontSize: 14,
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '0.02em',
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

        {/* Name + email */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden', minWidth: 0 }}
            >
              <div style={{
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--c-text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.3,
              }}>
                {user.displayName || 'User'}
              </div>
              <div style={{
                fontSize: 11,
                color: 'var(--c-text-dim)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.4,
                marginTop: 1,
              }}>
                {user.email || ''}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'var(--c-sidebar-divider)', margin: '0 12px 8px', flexShrink: 0 }} />

      {/* ── Create Task Button ── */}
      <div style={{ padding: expanded ? '0 10px 6px' : '0 10px 6px', flexShrink: 0 }}>
        <motion.button
          type="button"
          onClick={onCreateTask}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          title="Create Task"
          style={{
            width: '100%',
            height: 40,
            borderRadius: 12,
            border: '1px solid var(--c-border-accent)',
            background: 'var(--c-accent-bg)',
            color: 'var(--c-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: expanded ? 'flex-start' : 'center',
            gap: expanded ? 8 : 0,
            padding: expanded ? '0 14px' : '0',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.01em',
            transition: 'background 0.2s, box-shadow 0.2s, border-color 0.2s',
            boxShadow: '0 2px 12px var(--c-accent-glow-sm)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--c-accent-bg-hover)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px var(--c-accent-glow)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--c-accent-bg)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 12px var(--c-accent-glow-sm)';
          }}
        >
          <motion.span
            whileHover={{ rotate: 90 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            style={{ display: 'flex', flexShrink: 0 }}
          >
            <Plus size={17} />
          </motion.span>
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
              >
                Create Task
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'var(--c-sidebar-divider)', margin: '0 12px 6px', flexShrink: 0 }} />

      {/* ── Navigation ── */}
      <nav style={{ flex: 1, padding: '4px 10px', overflowY: 'auto', overflowX: 'hidden' }}>
        <AnimatePresence>
          {expanded && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: 'var(--c-text-dim)',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                padding: '4px 4px 8px 4px',
                margin: 0,
              }}
            >
              Navigation
            </motion.p>
          )}
        </AnimatePresence>

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

      {/* ── Bottom Section: Theme Toggle + Logout ── */}
      <div style={{
        padding: '8px 10px 16px',
        borderTop: '1px solid var(--c-sidebar-divider)',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        {/* Theme toggle */}
        <motion.button
          type="button"
          onClick={toggleTheme}
          whileTap={{ scale: 0.94 }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: '100%',
            height: 44,
            display: 'flex',
            alignItems: 'center',
            gap: expanded ? 12 : 0,
            justifyContent: expanded ? 'flex-start' : 'center',
            padding: expanded ? '0 14px' : '0',
            borderRadius: 12,
            border: 'none',
            cursor: 'pointer',
            background: 'transparent',
            color: 'var(--c-sidebar-text)',
            fontSize: 13.5,
            fontWeight: 500,
            fontFamily: 'inherit',
            transition: 'background 0.18s, color 0.18s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'var(--c-surface-hover)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--c-text-primary)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--c-sidebar-text)';
          }}
        >
          {theme === 'dark'
            ? <Sun size={18} style={{ flexShrink: 0 }} />
            : <Moon size={18} style={{ flexShrink: 0 }} />}
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
          icon={<LogOut size={18} />}
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
