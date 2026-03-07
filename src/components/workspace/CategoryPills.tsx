import React from 'react';
import { Category, CATEGORIES } from './types';

interface CategoryPillsProps {
  value: Category;
  onChange: (c: Category) => void;
}

const CategoryPills: React.FC<CategoryPillsProps> = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
    {CATEGORIES.map(c => {
      const active = value === c.key;
      return (
        <button
          key={c.key} type="button"
          onClick={() => onChange(c.key)}
          style={{
            padding: '7px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
            background: active ? 'rgba(124,58,237,0.18)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${active ? 'rgba(124,58,237,0.55)' : 'rgba(255,255,255,0.08)'}`,
            color: active ? '#c4b5fd' : 'rgba(255,255,255,0.35)',
            letterSpacing: '0.01em',
          }}
        >
          {c.label}
        </button>
      );
    })}
  </div>
);

export default CategoryPills;
