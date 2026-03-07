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
        background: 'rgba(124,58,237,0.07)', border: '1px dashed rgba(124,58,237,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ClipboardList size={28} color="rgba(124,58,237,0.45)" />
      </div>
      <p style={{ margin: '0 0 6px', color: 'rgba(255,255,255,0.55)', fontWeight: 600, fontSize: 16 }}>
        No {label} tasks yet
      </p>
      <p style={{ margin: 0, color: 'rgba(255,255,255,0.28)', fontSize: 13 }}>
        Start by adding your first task above
      </p>
    </motion.div>
  );
};

export default EmptyState;
