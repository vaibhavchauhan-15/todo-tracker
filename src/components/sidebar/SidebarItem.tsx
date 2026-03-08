import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from './SidebarContext';

// ─── Portal-based tooltip — component pattern so AnimatePresence works correctly ─
const NavTooltip: React.FC<{
  label: string;
  top: number;
  left: number;
  variant?: 'default' | 'danger';
}> = ({ label, top, left, variant = 'default' }) =>
  ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0, x: -8, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -6, scale: 0.94 }}
      transition={{ duration: 0.14, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        left,
        top,
        transform: 'translateY(-50%)',
        background: 'var(--c-tooltip-bg)',
        border: `1px solid ${variant === 'danger' ? 'rgba(239,68,68,0.55)' : 'var(--c-tooltip-border)'}`,
        color: variant === 'danger' ? '#fca5a5' : 'var(--c-tooltip-text)',
        fontSize: 12,
        fontWeight: 600,
        padding: '5px 10px',
        borderRadius: 8,
        whiteSpace: 'nowrap',
        zIndex: 9999,
        boxShadow: '0 4px 20px var(--c-tooltip-shadow)',
        pointerEvents: 'none',
      }}
    >
      {label}
      <span style={{
        position: 'absolute',
        right: 'calc(100% - 1px)',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 0, height: 0,
        borderTop: '5px solid transparent',
        borderBottom: '5px solid transparent',
        borderRight: `6px solid ${variant === 'danger' ? 'rgba(239,68,68,0.55)' : 'var(--c-tooltip-border)'}`,
      }} />
      <span style={{
        position: 'absolute',
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 0, height: 0,
        borderTop: '4px solid transparent',
        borderBottom: '4px solid transparent',
        borderRight: '5px solid var(--c-tooltip-bg)',
      }} />
    </motion.div>,
    document.body
  );

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  navKey: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, navKey, onClick, variant = 'default' }) => {
  const { expanded, activeNav, setActiveNav } = useSidebar();
  const isActive = activeNav === navKey;
  const [hovered, setHovered] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });

  const handleClick = () => {
    if (variant !== 'danger') setActiveNav(navKey);
    onClick?.();
  };

  const handleMouseEnter = () => {
    setHovered(true);
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setTooltipPos({ top: r.top + r.height / 2, left: r.right + 12 });
    }
  };

  const accentColor = variant === 'danger' ? '#ef4444' : '#6366F1';
  const hoverBg     = variant === 'danger' ? 'rgba(239,68,68,0.14)' : 'rgba(99,102,241,0.15)';
  const activeBg    = variant === 'danger' ? 'rgba(239,68,68,0.20)' : 'rgba(99,102,241,0.22)';
  const textColor   = isActive
    ? (variant === 'danger' ? '#fca5a5' : 'var(--c-accent)')
    : hovered
    ? variant === 'danger' ? '#fca5a5' : 'var(--c-text-primary)'
    : 'var(--c-sidebar-text)';

  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        ref={btnRef}
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHovered(false)}
        whileTap={{ scale: 0.96 }}
        style={{
          position: 'relative',
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
          background: isActive ? activeBg : hovered ? hoverBg : 'transparent',
          transition: 'background 0.18s ease, padding 0.3s ease',
          outline: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Active indicator bar */}
        {isActive && (
          <motion.span
            layoutId="active-bar"
            style={{
              position: 'absolute',
              left: 0,
              top: '20%',
              height: '60%',
              width: 3,
              borderRadius: '0 4px 4px 0',
              background: accentColor,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
          />
        )}

        {/* Icon */}
        <motion.span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: textColor,
            transition: 'color 0.18s ease',
          }}
          animate={{ scale: hovered ? 1.12 : 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          {icon}
        </motion.span>

        {/* Label */}
        <motion.span
          animate={{ opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          style={{
            fontSize: 13.5,
            fontWeight: isActive ? 700 : 500,
            color: textColor,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            letterSpacing: '0.01em',
            transition: 'color 0.18s ease',
            pointerEvents: 'none',
          }}
        >
          {label}
        </motion.span>
      </motion.button>

      {/* Tooltip when collapsed — component-based portal so AnimatePresence animates correctly */}
      <AnimatePresence>
        {!expanded && hovered && (
          <NavTooltip
            key="nav-tooltip"
            label={label}
            top={tooltipPos.top}
            left={tooltipPos.left}
            variant={variant}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SidebarItem;
