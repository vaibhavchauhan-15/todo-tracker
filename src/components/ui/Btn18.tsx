import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Btn18Props {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const Btn18: React.FC<Btn18Props> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  style,
  className = '',
}) => {
  const { theme } = useTheme();
  const light = theme === 'light';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn18${light ? ' btn18-light' : ''}${className ? ' ' + className : ''}`}
      style={style}
    >
      <span className="btn18-text-container">
        <span className="btn18-text">{children}</span>
      </span>
    </button>
  );
};

export default Btn18;
