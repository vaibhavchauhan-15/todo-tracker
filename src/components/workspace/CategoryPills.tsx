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
            background: active ? 'var(--c-accent-bg-hover)' : 'var(--c-surface)',
            border: `1px solid ${active ? 'var(--c-border-accent)' : 'var(--c-border)'}`,
            color: active ? 'var(--c-accent)' : 'var(--c-text-secondary)',
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
