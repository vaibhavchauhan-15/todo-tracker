import React from 'react';
import './GlowButton.css';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  style,
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`glow-button ${className}`.trim()}
    style={style}
  >
    {children}
  </button>
);

export default GlowButton;
