import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { Category, CATEGORIES } from './types';

const EmptyState: React.FC<{ category: Category }> = ({ category }) => {
  const label = CATEGORIES.find(c => c.key === category)?.label ?? 'task';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ textAlign: 'center', padding: '72px 0' }}
    >
      <div style={{
        width: 68, height: 68, borderRadius: 18, margin: '0 auto 18px',
        background: 'var(--c-accent-bg)', border: '1px dashed var(--c-border-accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ClipboardList size={28} color="var(--c-accent)" style={{ opacity: 0.5 }} />
      </div>
      <p style={{ margin: '0 0 6px', color: 'var(--c-text-muted)', fontWeight: 600, fontSize: 16 }}>
        No {label} tasks yet
      </p>
      <p style={{ margin: 0, color: 'var(--c-text-dim)', fontSize: 13 }}>
        Start by adding your first task above
      </p>
    </motion.div>
  );
};

export default EmptyState;
