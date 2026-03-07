import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ChevronDown, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import Btn18 from './ui/Btn18';
import { generateAITasks, AITask, AITasksResult, GoalType, TimeCommitment, CategoryFilter } from '../ai/groq';
import { Priority, PRIORITY_CFG, Category } from './workspace/types';
import { useIsMobile } from './workspace/useIsMobile';

const DRAWER_WIDTH = 500;

// ── Primitive styles ──────────────────────────────────────────
const inputBase: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  padding: '12px 14px', borderRadius: 10,
  background: 'var(--c-input-bg)',
  border: '1px solid var(--c-input-border)',
  color: 'var(--c-input-text)', fontSize: 14, fontFamily: 'inherit',
  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
};

const FL: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label style={{
    display: 'block', marginBottom: 8,
    color: 'var(--c-text-secondary)', fontSize: 11,
    fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
  }}>
    {children}
  </label>
);

// ── Custom Select ─────────────────────────────────────────────
interface SelectOption { value: string; label: string; }
interface CustomSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, disabled }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        style={{
          ...inputBase,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          userSelect: 'none',
        }}
      >
        <span style={{ color: 'var(--c-input-text)' }}>{selected?.label ?? value}</span>
        <ChevronDown
          size={14}
          style={{
            color: 'var(--c-text-secondary)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
            flexShrink: 0,
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
              zIndex: 10000,
              background: 'var(--c-bg-card)',
              border: '1px solid var(--c-border-strong)',
              borderRadius: 10,
              boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
              overflow: 'hidden',
            }}
          >
            {options.map(opt => {
              const active = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  style={{
                    display: 'flex', width: '100%', textAlign: 'left',
                    padding: '10px 14px',
                    background: active ? 'var(--c-accent-bg)' : 'transparent',
                    color: active ? 'var(--c-accent)' : 'var(--c-text-primary)',
                    border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: 14,
                    fontWeight: active ? 600 : 400,
                    transition: 'background 0.12s',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'var(--c-surface-hover)'; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  {opt.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Priority badge ────────────────────────────────────────────
const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const cfg = PRIORITY_CFG[priority] ?? PRIORITY_CFG.medium;
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
      letterSpacing: '0.04em', textTransform: 'capitalize',
    }}>
      {cfg.label}
    </span>
  );
};

// ── Editable task row ─────────────────────────────────────────
interface EditableTaskProps {
  task: AITask;
  category: Category;
  onChange: (updated: AITask) => void;
  onRemove: () => void;
}

const EditableTask: React.FC<EditableTaskProps> = ({ task, category, onChange, onRemove }) => {
  const [expanded, setExpanded] = useState(false);
  const catColors: Record<Category, string> = {
    daily:   '#a78bfa',
    weekly:  '#38bdf8',
    monthly: '#fb923c',
    yearly:  '#4ade80',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      style={{
        borderRadius: 10, border: '1px solid var(--c-border)',
        background: 'var(--c-bg-card)', overflow: 'hidden',
      }}
    >
      <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* category dot */}
        <span style={{
          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
          background: catColors[category],
        }} />

        {/* title — inline edit */}
        <input
          value={task.title}
          onChange={e => onChange({ ...task, title: e.target.value })}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--c-text-primary)', fontSize: 13, fontWeight: 600,
            fontFamily: 'inherit',
          }}
          placeholder="Task title"
        />

        <PriorityBadge priority={task.priority} />

        {/* expand / collapse description */}
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--c-text-secondary)', padding: 2, display: 'flex', alignItems: 'center',
          }}
          title="Edit description"
        >
          <ChevronDown size={14} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>

        {/* remove */}
        <button
          type="button"
          onClick={onRemove}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'rgba(239,68,68,0.5)', padding: 2, display: 'flex', alignItems: 'center',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(239,68,68,0.5)'; }}
          title="Remove task"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* description edit */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 12px 10px', borderTop: '1px solid var(--c-border)' }}>
              <textarea
                value={task.description}
                onChange={e => onChange({ ...task, description: e.target.value })}
                rows={2}
                placeholder="Description"
                style={{
                  ...inputBase,
                  marginTop: 8,
                  resize: 'vertical',
                  fontSize: 13,
                  minHeight: 60,
                }}
              />
              <div style={{ marginTop: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--c-text-secondary)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Priority:</span>
                {(['low', 'medium', 'high'] as Priority[]).map(p => {
                  const cfg = PRIORITY_CFG[p];
                  const active = task.priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => onChange({ ...task, priority: p })}
                      style={{
                        padding: '3px 10px', borderRadius: 6, cursor: 'pointer',
                        fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
                        color: active ? cfg.color : 'var(--c-text-secondary)',
                        background: active ? cfg.bg : 'transparent',
                        border: `1px solid ${active ? cfg.border : 'var(--c-border)'}`,
                        transition: 'all 0.15s',
                        textTransform: 'capitalize',
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Category section header ───────────────────────────────────
interface CategorySectionProps {
  label: string;
  count: number;
  color: string;
  children: React.ReactNode;
}

const CategorySection: React.FC<CategorySectionProps> = ({ label, count, color, children }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span style={{
        width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0,
      }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span style={{
        fontSize: 11, fontWeight: 700,
        color, background: `${color}22`,
        border: `1px solid ${color}44`,
        borderRadius: 20, padding: '1px 7px',
      }}>
        {count}
      </span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
  </div>
);

// ── Example prompts ───────────────────────────────────────────
const EXAMPLE_PROMPTS = [
  'Build a study routine for data science',
  'Create a daily productivity system',
  'Plan a gym workout schedule',
  'Prepare for semester exams',
  'Start a healthy morning routine',
];

// ── Main component ────────────────────────────────────────────
export interface AITaskPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTasks: (tasks: AITasksResult) => Promise<void>;
}

const AITaskPanel: React.FC<AITaskPanelProps> = ({ isOpen, onClose, onAddTasks }) => {
  const isMobile = useIsMobile();

  const [prompt, setPrompt] = useState('');
  const [goalType, setGoalType] = useState<GoalType>('custom');
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitment>('moderate');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AITasksResult | null>(null);
  const [saving, setSaving] = useState(false);

  const totalCount = result
    ? result.daily.length + result.weekly.length + result.monthly.length + result.yearly.length
    : 0;

  const handleClose = () => {
    onClose();
    // Reset state after drawer animates out
    setTimeout(() => {
      setPrompt('');
      setGoalType('custom');
      setTimeCommitment('moderate');
      setCategoryFilter('all');
      setError(null);
      setResult(null);
    }, 350);
  };

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const tasks = await generateAITasks(trimmed, goalType, timeCommitment, categoryFilter);
      setResult(tasks);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = (category: Category, index: number, updated: AITask) => {
    if (!result) return;
    setResult({
      ...result,
      [category]: result[category].map((t, i) => (i === index ? updated : t)),
    });
  };

  const removeTask = (category: Category, index: number) => {
    if (!result) return;
    setResult({ ...result, [category]: result[category].filter((_, i) => i !== index) });
  };

  const handleAddAll = async () => {
    if (!result || totalCount === 0) return;
    setSaving(true);
    try {
      await onAddTasks(result);
      handleClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save tasks. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const catMeta: { key: Category; label: string; color: string }[] = [
    { key: 'daily',   label: 'Daily',   color: '#a78bfa' },
    { key: 'weekly',  label: 'Weekly',  color: '#38bdf8' },
    { key: 'monthly', label: 'Monthly', color: '#fb923c' },
    { key: 'yearly',  label: 'Yearly',  color: '#4ade80' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="ai-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 999,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(2px)',
            }}
          />

          {/* ── Drawer ── */}
          <motion.div
            key="ai-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 1000,
              width: isMobile ? '100vw' : DRAWER_WIDTH,
              background: 'var(--c-bg-card)',
              borderLeft: '1px solid var(--c-border-accent)',
              borderRadius: isMobile ? 0 : '20px 0 0 20px',
              boxShadow: '-12px 0 48px rgba(0,0,0,0.35)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* ── Header ── */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid var(--c-border)',
              flexShrink: 0,
            }}>
              <span style={{
                display: 'flex', alignItems: 'center', gap: 10,
                color: 'var(--c-accent)', fontSize: 16, fontWeight: 700,
              }}>
                <span style={{
                  width: 30, height: 30, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg, rgba(196,181,253,0.2), rgba(56,189,248,0.15))',
                  border: '1px solid rgba(196,181,253,0.25)',
                }}>
                  <Sparkles size={14} color="#c4b5fd" strokeWidth={2} />
                </span>
                AI Generate Tasks
              </span>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  width: 32, height: 32, borderRadius: 8, cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(255,255,255,0.5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.85)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)';
                }}
              >
                <X size={14} />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 22 }}>

              {/* Prompt */}
              <div>
                <FL>Describe your goal *</FL>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  disabled={loading}
                  rows={3}
                  placeholder={"Describe what tasks you want to create...\n\nExample: Create a fitness routine for me"}
                  style={{
                    ...inputBase,
                    resize: 'vertical', minHeight: 90, lineHeight: 1.6, fontSize: 14,
                    opacity: loading ? 0.5 : 1,
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--c-input-border-focus)'; e.target.style.boxShadow = '0 0 0 3px var(--c-accent-glow-sm)'; e.target.style.background = 'var(--c-input-bg-focus)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--c-input-border)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--c-input-bg)'; }}
                />

                {/* Example prompt chips */}
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {EXAMPLE_PROMPTS.map(ex => (
                    <button
                      key={ex}
                      type="button"
                      disabled={loading}
                      onClick={() => setPrompt(ex)}
                      style={{
                        padding: '4px 10px', borderRadius: 20,
                        border: '1px solid rgba(196,181,253,0.2)',
                        background: 'rgba(196,181,253,0.06)',
                        color: 'rgba(196,181,253,0.75)',
                        fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        fontFamily: 'inherit', transition: 'all 0.15s',
                        opacity: loading ? 0.4 : 1,
                      }}
                      onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(196,181,253,0.14)'; (e.currentTarget as HTMLButtonElement).style.color = '#c4b5fd'; } }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(196,181,253,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(196,181,253,0.75)'; }}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <FL>Goal Type</FL>
                  <CustomSelect
                    value={goalType}
                    onChange={v => setGoalType(v as GoalType)}
                    disabled={loading}
                    options={[
                      { value: 'study',        label: 'Study'        },
                      { value: 'fitness',      label: 'Fitness'      },
                      { value: 'productivity', label: 'Productivity' },
                      { value: 'work',         label: 'Work'         },
                      { value: 'personal',     label: 'Personal'     },
                      { value: 'custom',       label: 'Custom'       },
                    ]}
                  />
                </div>

                <div>
                  <FL>Time Commitment</FL>
                  <CustomSelect
                    value={timeCommitment}
                    onChange={v => setTimeCommitment(v as TimeCommitment)}
                    disabled={loading}
                    options={[
                      { value: 'light',    label: 'Light'    },
                      { value: 'moderate', label: 'Moderate' },
                      { value: 'intense',  label: 'Intense'  },
                    ]}
                  />
                </div>
              </div>

              {/* Category filter */}
              <div>
                <FL>Category</FL>
                <CustomSelect
                  value={categoryFilter}
                  onChange={v => setCategoryFilter(v as CategoryFilter)}
                  disabled={loading}
                  options={[
                    { value: 'all',     label: 'All Categories' },
                    { value: 'daily',   label: 'Daily'          },
                    { value: 'weekly',  label: 'Weekly'         },
                    { value: 'monthly', label: 'Monthly'        },
                    { value: 'yearly',  label: 'Yearly'         },
                  ]}
                />
              </div>

              {/* Generate button */}
              <Btn18
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', fontSize: 13, fontWeight: 700, textTransform: 'none', letterSpacing: 0, borderRadius: 10, padding: '11px 24px' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                    Generating…
                  </>
                ) : (
                  <>
                    <Sparkles size={15} strokeWidth={2} />
                    Generate Tasks
                  </>
                )}
              </Btn18>

              {/* Error */}
              {error && (
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  padding: '11px 14px', borderRadius: 9,
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)',
                }}>
                  <AlertCircle size={14} color="#f87171" style={{ marginTop: 1, flexShrink: 0 }} />
                  <p style={{ margin: 0, color: '#f87171', fontSize: 13 }}>{error}</p>
                </div>
              )}

              {/* ── Preview ── */}
              {result && totalCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
                >
                  {/* Preview header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 10,
                    background: 'linear-gradient(135deg, rgba(196,181,253,0.08), rgba(56,189,248,0.06))',
                    border: '1px solid rgba(196,181,253,0.18)',
                  }}>
                    <Sparkles size={13} color="#c4b5fd" />
                    <span style={{ fontSize: 13, color: 'var(--c-text-primary)', fontWeight: 600 }}>
                      {totalCount} tasks generated — review and edit before adding
                    </span>
                  </div>

                  {/* Task lists by category */}
                  {catMeta.map(({ key, label, color }) => {
                    const list = result[key];
                    if (!list.length) return null;
                    return (
                      <CategorySection key={key} label={label} count={list.length} color={color}>
                        <AnimatePresence>
                          {list.map((task, i) => (
                            <EditableTask
                              key={`${key}-${i}`}
                              task={task}
                              category={key}
                              onChange={updated => updateTask(key, i, updated)}
                              onRemove={() => removeTask(key, i)}
                            />
                          ))}
                        </AnimatePresence>
                      </CategorySection>
                    );
                  })}
                </motion.div>
              )}

              {/* Empty result guard */}
              {result && totalCount === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--c-text-secondary)', fontSize: 13, padding: '20px 0' }}>
                  All tasks removed. Generate again to get new suggestions.
                </div>
              )}
            </div>

            {/* ── Fixed footer ── */}
            {result && totalCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  flexShrink: 0,
                  borderTop: '1px solid var(--c-border)',
                  padding: '16px 24px',
                  display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center',
                  background: 'var(--c-bg-card)',
                }}
              >
                <Btn18
                  type="button"
                  onClick={handleClose}
                  disabled={saving}
                  style={{ padding: '9px 20px', fontSize: 13, fontWeight: 600, textTransform: 'none', letterSpacing: 0, borderRadius: 10 }}
                >
                  Cancel
                </Btn18>
                <Btn18
                  onClick={handleAddAll}
                  disabled={saving || totalCount === 0}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700, textTransform: 'none', letterSpacing: 0, borderRadius: 10, padding: '9px 20px' }}
                >
                  {saving ? (
                    <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
                  ) : (
                    <><Sparkles size={13} strokeWidth={2} /> Add {totalCount} Tasks</>
                  )}
                </Btn18>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AITaskPanel;
