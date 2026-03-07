import React from 'react';
import { Priority, PRIORITY_CFG } from './types';

interface PriorityPillsProps {
  value: Priority;
  onChange: (p: Priority) => void;
}

const PriorityPills: React.FC<PriorityPillsProps> = ({ value, onChange }) => (
  <div style={{ display: 'flex', gap: 6 }}>
    {(Object.keys(PRIORITY_CFG) as Priority[]).map(p => {
      const cfg = PRIORITY_CFG[p];
      const active = value === p;
      return (
        <button
          key={p} type="button"
          onClick={() => onChange(p)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
            fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
            background: active ? cfg.bg : 'rgba(255,255,255,0.03)',
            border: `1px solid ${active ? cfg.border : 'rgba(255,255,255,0.08)'}`,
            color: active ? cfg.color : 'rgba(255,255,255,0.35)',
          }}
        >
          <span style={{
            width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
            background: active ? cfg.color : 'rgba(255,255,255,0.2)',
            transition: 'background 0.15s',
            boxShadow: active ? `0 0 6px ${cfg.color}88` : 'none',
          }} />
          {cfg.label}
        </button>
      );
    })}
  </div>
);

export default PriorityPills;
