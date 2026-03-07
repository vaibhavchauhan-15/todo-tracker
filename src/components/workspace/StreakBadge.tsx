import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const StreakBadge: React.FC<{ count: number }> = ({ count }) => (
  <motion.span
    key={count}
    initial={{ scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 14px', borderRadius: 999,
      background: count > 0 ? 'rgba(251,146,60,0.1)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${count > 0 ? 'rgba(251,146,60,0.28)' : 'rgba(255,255,255,0.1)'}`,
      color: count > 0 ? '#fb923c' : '#9e9e9e',
      fontSize: 12, fontWeight: 700, userSelect: 'none',
    }}
  >
    <Flame size={13} fill={count > 0 ? '#fb923c' : '#9e9e9e'} strokeWidth={0} />
    {count > 0 ? `${count} day streak` : 'No streak yet'}
  </motion.span>
);

export default StreakBadge;
