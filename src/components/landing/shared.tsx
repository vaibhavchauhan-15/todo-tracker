import React from 'react';
import Btn18 from '../ui/Btn18';

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
// PrimaryButton  →  Btn18 primary variant
// ─────────────────────────────────────────────────────────────────────────────
export const PrimaryButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  large?: boolean;
  style?: React.CSSProperties;
}> = ({ children, onClick, large, style }) => (
  <Btn18
    variant="primary"
    size={large ? 'large' : 'default'}
    onClick={onClick}
    style={style}
  >
    {children}
  </Btn18>
);

// ─────────────────────────────────────────────────────────────────────────────
// SecondaryButton  →  Btn18 secondary variant
// ─────────────────────────────────────────────────────────────────────────────
export const SecondaryButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}> = ({ children, onClick, style }) => (
  <Btn18
    variant="secondary"
    onClick={onClick}
    style={style}
  >
    {children}
  </Btn18>
);
