import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pencil, Trash2, CheckCircle2, Circle, Flame,
  CalendarDays, Clock, X,
} from 'lucide-react';
import { Task, Priority, PRIORITY_CFG, CATEGORIES } from './types';
import TaskFormFields, { TaskFormData } from './TaskFormFields';
import { useIsMobile } from './useIsMobile';

export interface TaskCardProps {
  task: Task;
  index: number;
  editingId: string | null;
  editForm: TaskFormData;
  isSaving: boolean;
  onToggle: (id: string, status: 'pending' | 'completed') => void;
  onDeleteClick: (id: string) => void;
  onEditOpen: (task: Task) => void;
  onEditChange: (key: string, val: string) => void;
  onEditSave: (e: React.FormEvent) => void;
  onEditCancel: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task, index, editingId, editForm, isSaving,
  onToggle, onDeleteClick, onEditOpen, onEditChange, onEditSave, onEditCancel,
}) => {
  const isMobile = useIsMobile();
  const pc = PRIORITY_CFG[task.priority as Priority] ?? PRIORITY_CFG.medium;
  const isDone = task.status === 'completed';
  const isEditing = editingId === task.id;

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
      whileHover={!isEditing ? { y: -2, boxShadow: '0 10px 32px rgba(0,0,0,0.38)', borderColor: 'rgba(255,255,255,0.16)' } : undefined}
      style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        background: isDone ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.045)',
        transition: 'border-color 0.2s',
      }}
    >
      {/* ── Non-edit view ── */}
      {!isEditing && (
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
              color: isDone ? '#22c55e' : 'rgba(255,255,255,0.22)',
              transition: 'color 0.2s',
            }}
          >
            {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
          </button>

          {/* Content */}
          <div style={{ flex: 1, padding: '14px 8px 14px 0', minWidth: 0 }}>
            <p style={{
              margin: '0 0 5px', fontWeight: 600, fontSize: 16,
              color: isDone ? 'rgba(255,255,255,0.28)' : '#f0f0f0',
              textDecoration: isDone ? 'line-through' : 'none',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              transition: 'color 0.2s',
            }}>{task.title}</p>

            {task.description && (
              <p style={{
                margin: '0 0 8px', fontSize: 13, color: '#6b7280', lineHeight: 1.45,
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

              {task.dueDate && task.category !== 'daily' && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#9e9e9e', fontSize: 11 }}>
                  <CalendarDays size={11} />{formatDate(task.dueDate)}
                </span>
              )}

              {task.dueTime && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#9e9e9e', fontSize: 11 }}>
                  <Clock size={11} />{task.dueTime}
                </span>
              )}

              <span style={{
                padding: '2px 9px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                color: 'rgba(167,139,250,0.85)', background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.2)',
              }}>
                {CATEGORIES.find(c => c.key === (task.category ?? 'daily'))?.label}
              </span>

              {(task.category ?? 'daily') === 'daily' && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '2px 9px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                  color: (task.streak ?? 0) > 0 ? '#fb923c' : '#9e9e9e',
                  background: (task.streak ?? 0) > 0 ? 'rgba(251,146,60,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${(task.streak ?? 0) > 0 ? 'rgba(251,146,60,0.28)' : 'rgba(255,255,255,0.1)'}`,
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
                color: 'rgba(255,255,255,0.22)', transition: 'color 0.15s, background 0.15s',
                opacity: isDone ? 0.4 : 1,
              }}
              onMouseEnter={e => { if (!isDone) { (e.currentTarget as HTMLButtonElement).style.color = '#a78bfa'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(124,58,237,0.1)'; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.22)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
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
                color: 'rgba(255,255,255,0.22)', transition: 'color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.22)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <Trash2 size={15} />
            </motion.button>
          </div>
        </div>
      )}

      {/* ── Inline edit panel ── */}
      <AnimatePresence>
        {isEditing && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px 0', gap: 10 }}>
              <div style={{ width: 4, height: 20, borderRadius: 2, background: pc.color, flexShrink: 0 }} />
              <span style={{ color: '#9e9e9e', fontSize: 13, fontWeight: 600 }}>Editing task</span>
              <button
                type="button" onClick={onEditCancel}
                style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', color: '#9e9e9e', display: 'flex', alignItems: 'center' }}
                aria-label="Cancel edit"
              >
                <X size={16} />
              </button>
            </div>
            <motion.form
              onSubmit={onEditSave}
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <TaskFormFields form={editForm} onChange={onEditChange} isMobile={isMobile} />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
                  <button
                    type="button" onClick={onEditCancel}
                    style={{
                      padding: '10px 22px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
                      border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
                      color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.75)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; }}
                  >Cancel</button>
                  <button
                    type="submit"
                    disabled={!editForm.title.trim()}
                    style={{
                      padding: '10px 24px', borderRadius: 10,
                      cursor: !editForm.title.trim() ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit', border: 'none',
                      background: !editForm.title.trim() ? 'rgba(124,58,237,0.35)' : 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                      color: !editForm.title.trim() ? 'rgba(255,255,255,0.4)' : '#fff',
                      fontSize: 13, fontWeight: 700, transition: 'box-shadow 0.2s, transform 0.15s',
                      boxShadow: !editForm.title.trim() ? 'none' : '0 2px 14px rgba(124,58,237,0.45)',
                    }}
                    onMouseEnter={e => { if (editForm.title.trim()) { const b = e.currentTarget as HTMLButtonElement; b.style.boxShadow = '0 4px 22px rgba(124,58,237,0.6)'; b.style.transform = 'translateY(-1px)'; } }}
                    onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.boxShadow = '0 2px 14px rgba(124,58,237,0.45)'; b.style.transform = 'none'; }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.form>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskCard;
