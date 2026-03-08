import React from 'react';

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
    className={`glow-btn${className ? ' ' + className : ''}`}
    style={style}
  >
    {children}
  </button>
);

export default GlowButton;
