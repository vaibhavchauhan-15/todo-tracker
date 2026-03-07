import React from 'react';
import styled from 'styled-components';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const StyledButton = styled.button`
  position: relative;
  width: fit-content;
  height: 40px;
  background-color: #000;
  display: inline-flex;
  align-items: center;
  color: white;
  justify-content: center;
  border: none;
  padding: 12px 20px;
  gap: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    left: -4px;
    top: -1px;
    margin: auto;
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    border-radius: 10px;
    background: linear-gradient(-45deg, #e81cff 0%, #40c9ff 100%);
    z-index: -10;
    pointer-events: none;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  &::after {
    content: "";
    z-index: -1;
    position: absolute;
    inset: 0;
    background: linear-gradient(-45deg, #fc00ff 0%, #00dbde 100%);
    transform: translate3d(0, 0, 0) scale(0.95);
    filter: blur(20px);
  }

  &:hover::after {
    filter: blur(30px);
  }

  &:hover::before {
    transform: rotate(-180deg);
  }

  &:active::before {
    scale: 0.7;
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  style,
}) => (
  <StyledButton
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={className}
    style={style}
  >
    {children}
  </StyledButton>
);

export default GlowButton;
