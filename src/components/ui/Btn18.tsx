import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';

interface Btn18Props {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'large';
  style?: React.CSSProperties;
  className?: string;
}

const StyledBtn = styled.button<{ $light: boolean }>`
  /* ── Reset ─────────────────────────────────────────── */
  & *, & :after, & :before, &:after, &:before {
    border: 0 solid;
    box-sizing: border-box;
  }
  & {
    box-sizing: border-box;
  }

  /* ── Base ──────────────────────────────────────────── */
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: button;
  background-color: ${({ $light }) => ($light ? '#fff' : '#6366F1')};
  background-image: none;
  color: ${({ $light }) => ($light ? '#6366F1' : '#fff')};
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 900;
  line-height: 1.5;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-radius: 99rem;
  border-style: solid;
  border-width: 3px;
  border-color: ${({ $light }) => ($light ? '#6366F1' : '#fff')};
  padding: 0.8rem 3rem;
  z-index: 0;
  overflow: hidden;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  transition: color 0.3s;
  box-shadow: ${({ $light }) =>
    $light ? '0 2px 12px rgba(0,0,0,0.15)' : '0 2px 12px rgba(255,255,255,0.06)'};

  &:disabled {
    cursor: default;
    opacity: 0.45;
    pointer-events: none;
  }

  /* ── Text layers ───────────────────────────────────── */
  .text-container {
    overflow: hidden;
    position: relative;
    display: block;
  }

  .text {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    position: relative;
  }

  &:hover .text {
    animation: btn18-move-up 0.3s forwards;
  }

  &:hover {
    color: ${({ $light }) => ($light ? '#fff' : '#6366F1')};
  }

  @keyframes btn18-move-up {
    0%   { transform: translateY(0); }
    50%  { transform: translateY(80%); }
    51%  { transform: translateY(-80%); }
    100% { transform: translateY(0); }
  }

  /* ── Sliding parallelogram pseudo-elements ─────────── */
  &::before,
  &::after {
    --tilt: 20px;
    background: ${({ $light }) => ($light ? '#6366F1' : '#fff')};
    content: "";
    height: 100%;
    position: absolute;
    top: 0;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    width: 100%;
  }

  &::before {
    clip-path: polygon(
      0 0,
      calc(100% - var(--tilt)) 0,
      100% 50%,
      calc(100% - var(--tilt)) 100%,
      0 100%
    );
    left: -100%;
  }

  &::after {
    clip-path: polygon(
      var(--tilt) 0,
      0 50%,
      var(--tilt) 100%,
      100% 100%,
      100% 0
    );
    left: 100%;
    z-index: -1;
  }

  &:hover::before { transform: translateX(100%); }
  &:hover::after  { transform: translateX(-100%); }
`;

const Btn18: React.FC<Btn18Props> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  style,
  className = '',
}) => {
  const { theme } = useTheme();
  return (
    <StyledBtn
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={className}
      $light={theme === 'light'}
    >
      <span className="text-container">
        <span className="text">{children}</span>
      </span>
    </StyledBtn>
  );
};

export default Btn18;
