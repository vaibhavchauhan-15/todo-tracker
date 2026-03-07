import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ChevronDown } from 'lucide-react';
import GlowButton from '../ui/GlowButton';
import TaskFormFields, { TaskFormData } from './TaskFormFields';
import { useIsMobile } from './useIsMobile';

interface AddTaskPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  form: TaskFormData;
  onChange: (key: string, val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
}

const AddTaskPanel: React.FC<AddTaskPanelProps> = ({
  isOpen, onToggle, form, onChange, onSubmit, error,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [triggerHover, setTriggerHover] = React.useState(false);
  const isMobile = useIsMobile();

  return (
    <div style={{
      borderRadius: 14,
      border: `1px solid ${
        isOpen          ? 'var(--c-border-accent)'
        : triggerHover  ? 'var(--c-border-accent)'
        : 'var(--c-border)'
      }`,
      background: isOpen
        ? 'var(--c-bg-card)'
        : triggerHover ? 'var(--c-accent-bg)' : 'var(--c-surface)',
      transition: 'border-color 0.2s, background 0.25s, box-shadow 0.25s',
      boxShadow: isOpen
        ? '0 8px 40px rgba(0,0,0,0.18), 0 0 0 3px var(--c-accent-glow-sm)'
        : triggerHover ? '0 2px 16px rgba(0,0,0,0.1)' : 'none',
      overflow: 'hidden',
    }}>

      {/* ── Trigger / Header row ── */}
      <button
        type="button" onClick={onToggle}
        onMouseEnter={() => !isOpen && setTriggerHover(true)}
        onMouseLeave={() => setTriggerHover(false)}
        style={{
          width: '100%', height: 54, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 20px',
          background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        <span style={{
          display: 'flex', alignItems: 'center', gap: 10,
          color: isOpen ? 'var(--c-accent)' : triggerHover ? 'var(--c-accent)' : 'var(--c-text-secondary)',
          fontSize: 14, fontWeight: 600, transition: 'color 0.2s', letterSpacing: '0.01em',
        }}>
          <span style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isOpen
              ? 'var(--c-accent-bg-hover)'
              : triggerHover ? 'var(--c-accent-bg)' : 'var(--c-surface)',
            transition: 'background 0.2s',
          }}>
            <Plus size={14} color={isOpen ? '#c4b5fd' : triggerHover ? '#a78bfa' : 'rgba(255,255,255,0.55)'} strokeWidth={2.5} />
          </span>
          Add Task
        </span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}>
          <ChevronDown size={16} color={isOpen ? 'rgba(196,181,253,0.7)' : 'rgba(255,255,255,0.2)'} />
        </motion.span>
      </button>

      {/* ── Expandable form ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="add-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ height: 1, background: 'var(--c-border-accent)', margin: '0 20px' }} />

            <form onSubmit={onSubmit} style={{ padding: '20px 20px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <TaskFormFields form={form} onChange={onChange} isMobile={isMobile} minDate={today} />

              {error && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 14px', borderRadius: 9,
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)',
                }}>
                  <X size={13} color="#f87171" />
                  <p style={{ margin: 0, color: '#f87171', fontSize: 13 }}>{error}</p>
                </div>
              )}

              <div style={{
                display: 'flex', gap: 10, justifyContent: 'flex-end',
                paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 2,
              }}>
                <button
                  type="button" onClick={onToggle}
                  style={{
                    padding: '10px 22px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
                    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.75)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; }}
                >
                  Cancel
                </button>
                <GlowButton
                  type="submit"
                  disabled={!form.title.trim()}
                  style={{ fontSize: 13 }}
                >
                  <Plus size={13} strokeWidth={2.5} /> Add Task
                </GlowButton>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddTaskPanel;
