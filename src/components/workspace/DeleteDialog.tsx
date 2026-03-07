import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface DeleteDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ onConfirm, onCancel }) => {
  const [countdown, setCountdown] = useState(5);
  const circumference = 2 * Math.PI * 14;

  useEffect(() => {
    if (countdown <= 0) { onCancel(); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, onCancel]);

  const progress = countdown / 5;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1200,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1,    opacity: 1 }}
        exit={{ scale: 0.92,    opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        style={{
          background: 'var(--c-bg-card)', border: '1px solid var(--c-border)',
          borderRadius: 18, padding: '24px 24px 20px', maxWidth: 360, width: '100%',
          boxShadow: '0 28px 72px rgba(0,0,0,0.55)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'rgba(239,68,68,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(239,68,68,0.35)',
          }}>
            <Trash2 size={18} color="#ef4444" />
          </div>
          <span style={{ color: 'var(--c-text-primary)', fontWeight: 700, fontSize: 16 }}>Delete Task?</span>
          {/* Countdown ring */}
          <div style={{ marginLeft: 'auto', position: 'relative', width: 34, height: 34, flexShrink: 0 }}>
            <svg width="34" height="34" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="17" cy="17" r="14" fill="none" stroke="var(--c-border)" strokeWidth="3" />
              <circle
                cx="17" cy="17" r="14" fill="none"
                stroke="var(--c-text-secondary)" strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
                style={{ transition: 'stroke-dashoffset 0.9s linear' }}
              />
            </svg>
            <span style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--c-text-muted)', fontSize: 12, fontWeight: 800,
            }}>{countdown}</span>
          </div>
        </div>
        <p style={{ color: 'var(--c-text-secondary)', fontSize: 13, margin: '0 0 6px', lineHeight: 1.6 }}>
          Are you sure you want to delete this task? This action cannot be undone.
        </p>
        <p style={{ color: 'var(--c-text-dim)', fontSize: 12, margin: '0 0 20px' }}>
          Closing automatically in {countdown}s…
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 18px', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit',
              border: '1px solid var(--c-border-strong)', background: 'transparent',
              color: 'var(--c-text-secondary)', fontSize: 13, fontWeight: 600,
            }}
          >Cancel</button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 18px', borderRadius: 9, cursor: 'pointer', fontFamily: 'inherit',
              border: 'none', background: '#ef4444', color: '#fff', fontSize: 13, fontWeight: 700,
            }}
          >Delete</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteDialog;
