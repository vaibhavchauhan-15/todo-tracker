import React from 'react';
import { motion } from 'framer-motion';
import { C } from './tokens';

// ─────────────────────────────────────────────────────────────────────────────
// GradientText
// ─────────────────────────────────────────────────────────────────────────────
export const GradientText: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <span
    style={{
      background: 'linear-gradient(135deg, #818CF8 0%, #6366F1 40%, #22C55E 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      ...style,
    }}
  >
    {children}
  </span>
);

// ─────────────────────────────────────────────────────────────────────────────
// SectionBadge
// ─────────────────────────────────────────────────────────────────────────────
export const SectionBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'rgba(99,102,241,0.12)',
      border: '1px solid rgba(99,102,241,0.3)',
      borderRadius: 100,
      padding: '6px 16px',
      fontSize: 13,
      fontWeight: 600,
      color: '#818CF8',
      marginBottom: 20,
      letterSpacing: '0.02em',
    }}
  >
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PrimaryButton
// ─────────────────────────────────────────────────────────────────────────────
export const PrimaryButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  large?: boolean;
  style?: React.CSSProperties;
}> = ({ children, onClick, large, style }) => (
  <motion.button
    whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(99,102,241,0.55)' }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    style={{
      background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentDark} 100%)`,
      color: '#fff',
      border: 'none',
      borderRadius: 12,
      padding: large ? '16px 40px' : '12px 28px',
      fontSize: large ? 17 : 15,
      fontWeight: 600,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      letterSpacing: '0.01em',
      transition: 'box-shadow 0.3s',
      ...style,
    }}
  >
    {children}
  </motion.button>
);

// ─────────────────────────────────────────────────────────────────────────────
// SecondaryButton
// ─────────────────────────────────────────────────────────────────────────────
export const SecondaryButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}> = ({ children, onClick, style }) => (
  <motion.button
    whileHover={{ scale: 1.04, background: 'rgba(255,255,255,0.1)' }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    style={{
      background: 'rgba(255,255,255,0.05)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: 12,
      padding: '12px 28px',
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      letterSpacing: '0.01em',
      transition: 'background 0.3s',
      ...style,
    }}
  >
    {children}
  </motion.button>
);
