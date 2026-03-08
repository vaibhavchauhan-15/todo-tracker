import React from 'react';
import { motion } from 'framer-motion';
import {
  Pencil, Trash2, CheckCircle2, Circle, Flame,
  CalendarDays, Clock,
} from 'lucide-react';
import { Task, Priority, PRIORITY_CFG, CATEGORIES } from './types';

export interface TaskCardProps {
  task: Task;
  index: number;
  onToggle: (id: string, status: 'pending' | 'completed') => void;
  onDeleteClick: (id: string) => void;
  onEditOpen: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task, index, onToggle, onDeleteClick, onEditOpen,
}) => {
  const pc = PRIORITY_CFG[task.priority as Priority] ?? PRIORITY_CFG.medium;
  const isDone = task.status === 'completed';

  const formatDate = (d: string) => {
    if (!d) return '';
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18, scale: 0.95 }}
      animate={{ opacity: isDone ? 0.62 : 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.045, 0.3) }}
      whileHover={{ y: -2, boxShadow: '0 10px 32px rgba(0,0,0,0.18)', borderColor: 'var(--c-border-strong)' }}
      style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid var(--c-border)',
        background: isDone ? 'var(--c-surface)' : 'var(--c-bg-card)',
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
          {/* Priority strip */}
          <div style={{ width: 4, flexShrink: 0, background: pc.color, opacity: isDone ? 0.35 : 1 }} />

          {/* Toggle */}
          <button
            onClick={() => onToggle(task.id, task.status)}
            aria-label={isDone ? 'Mark as pending' : 'Mark as complete'}
            style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              padding: '0 14px', display: 'flex', alignItems: 'center',
              color: isDone ? 'var(--c-green)' : 'var(--c-text-dim)',
              transition: 'color 0.2s',
            }}
          >
            {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
          </button>

          {/* Content */}
          <div style={{ flex: 1, padding: '14px 8px 14px 0', minWidth: 0 }}>
            <p style={{
              margin: '0 0 5px', fontWeight: 600, fontSize: 16,
              color: isDone ? 'var(--c-text-dim)' : 'var(--c-text-primary)',
              textDecoration: isDone ? 'line-through' : 'none',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              transition: 'color 0.2s',
            }}>{task.title}</p>

            {task.description && (
              <p style={{
                margin: '0 0 8px', fontSize: 13, color: 'var(--c-text-secondary)', lineHeight: 1.45,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>{task.description}</p>
            )}

            {/* Metadata chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
              <span style={{
                padding: '2px 9px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                color: pc.color, background: pc.bg, border: `1px solid ${pc.border}`,
              }}>{pc.label.toUpperCase()}</span>

              {task.category !== 'daily' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: task.dueDate ? 'var(--c-text-secondary)' : 'var(--c-text-dim)' }}>
                  <CalendarDays size={11} />{task.dueDate ? formatDate(task.dueDate) : '—'}
                </span>
              )}

              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: task.dueTime ? 'var(--c-text-secondary)' : 'var(--c-text-dim)' }}>
                <Clock size={11} />{task.dueTime || '—'}
              </span>

              <span style={{
                padding: '2px 9px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                color: 'var(--c-accent-light)', background: 'var(--c-accent-bg)',
                border: '1px solid var(--c-border-accent)',
              }}>
                {CATEGORIES.find(c => c.key === (task.category ?? 'daily'))?.label}
              </span>

              {(task.category ?? 'daily') === 'daily' && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '2px 9px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                  color: (task.streak ?? 0) > 0 ? '#fb923c' : 'var(--c-text-secondary)',
                  background: (task.streak ?? 0) > 0 ? 'rgba(251,146,60,0.14)' : 'var(--c-surface)',
                  border: `1px solid ${(task.streak ?? 0) > 0 ? 'rgba(251,146,60,0.38)' : 'var(--c-border)'}`,
                  userSelect: 'none',
                }}>
                  <Flame size={10} fill={(task.streak ?? 0) > 0 ? '#fb923c' : '#9e9e9e'} strokeWidth={0} />
                  {(task.streak ?? 0) > 0 ? `${task.streak}d streak` : 'No streak'}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, paddingRight: 12 }}>
            <motion.button
              whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.93 }}
              type="button"
              onClick={() => onEditOpen(task)}
              disabled={isDone}
              aria-label="Edit task"
              style={{
                border: 'none', background: 'transparent', cursor: isDone ? 'not-allowed' : 'pointer',
                padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center',
                color: 'var(--c-text-secondary)', transition: 'color 0.15s, background 0.15s',
                opacity: isDone ? 0.4 : 1,
              }}
              onMouseEnter={e => { if (!isDone) { (e.currentTarget as HTMLButtonElement).style.color = 'var(--c-accent)'; (e.currentTarget as HTMLButtonElement).style.background = 'var(--c-accent-bg)'; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--c-text-secondary)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <Pencil size={15} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.93 }}
              type="button"
              onClick={() => onDeleteClick(task.id)}
              aria-label="Delete task"
              style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                padding: 8, borderRadius: 8, display: 'flex', alignItems: 'center',
                color: 'var(--c-text-secondary)', transition: 'color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--c-text-secondary)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <Trash2 size={15} />
            </motion.button>
          </div>
        </div>
    </motion.div>
  );
};

export default TaskCard;
