import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, X } from 'lucide-react';
import { Category, Task, StreakData, CATEGORIES } from './workspace/types';
import { useIsMobile } from './workspace/useIsMobile';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../services/todoService';
import EmptyState from './workspace/EmptyState';
import DeleteDialog from './workspace/DeleteDialog';
import TaskCard from './workspace/TaskCard';
import AITaskPanel from './AITaskPanel';
import TaskFormFields, { TaskFormData } from './workspace/TaskFormFields';
import Btn18 from './ui/Btn18';
import { AITasksResult } from '../ai/groq';

interface WorkspaceProps {
  user: any;
  externalCategory?: Category;
  navView?: string;
  triggerAdd?: boolean;
  onAddHandled?: () => void;
  onStreakChange?: (count: number) => void;
  onViewChange?: (key: string) => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ user, externalCategory, navView, triggerAdd, onAddHandled, onStreakChange, onViewChange }) => {
  const [tasks, setTasks]               = useState<Task[]>([]);
  const [loading, setLoading]           = useState(true);
  const [activeView, setActiveView]     = useState<'all' | 'completed' | Category>(
    navView === 'all' ? 'all' : navView === 'completed' ? 'completed' : (externalCategory ?? 'daily')
  );
  const [panelOpen, setPanelOpen]       = useState(false);
  const [panelMode, setPanelMode]       = useState<'add' | 'edit'>('add');
  const [aiOpen, setAiOpen]             = useState(false);
  const [deleteId, setDeleteId]         = useState<string | null>(null);
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [streak, setStreak]             = useState<StreakData>({ count: 0, lastDate: '' });
  const streakRef                       = useRef<StreakData>({ count: 0, lastDate: '' });
  const isMobile                        = useIsMobile();
  const activeCategory: Category        = (activeView !== 'all' && activeView !== 'completed') ? activeView as Category : 'daily';

  const today = new Date().toISOString().split('T')[0];

  /* ── Load tasks from Supabase on mount ── */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getTodos(user.uid)
      .then(data => { if (!cancelled) setTasks(data); })
      .catch(err => console.error('Failed to load tasks:', err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.uid]);

  /* ── Recompute daily progress & streak when tasks change ── */
  useEffect(() => {
    const todayDate = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];

    const dailyToday = tasks.filter(t => (t.category ?? 'daily') === 'daily' && t.dueDate === todayDate);

    const anyDone = dailyToday.some(t => t.status === 'completed');
    const prev = streakRef.current;
    if (anyDone && prev.lastDate !== todayDate) {
      const next = prev.lastDate === yesterdayDate ? prev.count + 1 : 1;
      const updated: StreakData = { count: next, lastDate: todayDate };
      streakRef.current = updated;
      setStreak(updated);
      onStreakChange?.(next);
    } else if (!anyDone) {
      setStreak(prev);
      onStreakChange?.(prev.count);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  /* ── Sync external category / view from sidebar ── */
  useEffect(() => {
    if (navView === 'all' || navView === 'completed') {
      setActiveView(navView as 'all' | 'completed');
      setPanelOpen(false);
      setEditingId(null);
    } else if (externalCategory && externalCategory !== activeView) {
      setActiveView(externalCategory);
      setPanelOpen(false);
      setEditingId(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalCategory, navView]);

  /* ── Handle sidebar "Create Task" trigger ── */
  useEffect(() => {
    if (triggerAdd) {
      setPanelForm({ title: '', description: '', priority: 'medium', category: activeCategory, dueDate: today, dueTime: '' });
      setPanelMode('add');
      setPanelOpen(true);
      onAddHandled?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerAdd]);

  /* ── Keyboard shortcut: "N" to open add panel ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === 'n' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        setPanelForm({ title: '', description: '', priority: 'medium', category: activeCategory, dueDate: today, dueTime: '' });
        setPanelMode('add');
        setPanelOpen(o => !o);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Shared panel form ── */
  const [panelForm, setPanelForm] = useState<TaskFormData>({
    title: '', description: '', priority: 'medium',
    category: 'daily', dueDate: today, dueTime: '',
  });
  const [panelError, setPanelError] = useState<string | null>(null);

  /* ── Sync add-mode category to active tab when panel is closed ── */
  useEffect(() => {
    if (!panelOpen) setPanelForm(f => ({ ...f, category: activeCategory, dueDate: today, dueTime: '' }));
  }, [activeCategory, panelOpen, today]);

  /* ── Shared form change handler ── */
  const handlePanelChange = useCallback((key: string, val: string) => {
    setPanelForm(f => ({ ...f, [key]: val }));
  }, []);

  /* ── AI task bulk insert ── */
  const handleAIAddTasks = useCallback(async (result: AITasksResult) => {
    const categories = ['daily', 'weekly', 'monthly', 'yearly'] as const;
    const allInserts = categories.flatMap(cat =>
      result[cat].map(t => ({
        userId:            user.uid,
        title:             t.title.trim(),
        description:       t.description.trim(),
        priority:          t.priority as import('./workspace/types').Task['priority'],
        category:          cat as string,
        dueDate:           '',
        dueTime:           '',
        status:            'pending' as const,
        completed:         false,
        streak:            0,
        lastCompletedDate: '',
      }))
    );
    // Optimistic — add placeholders, then replace with real rows
    const optimisticTasks: import('./workspace/types').Task[] = allInserts.map(t => ({
      ...t,
      id:        crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    setTasks(prev => [...optimisticTasks, ...prev]);
    try {
      const { createTodo: create } = await import('../services/todoService');
      const saved = await Promise.all(allInserts.map(t => create(t)));
      // Replace optimistic rows with DB rows
      setTasks(prev => {
        const optimisticIds = new Set(optimisticTasks.map(t => t.id));
        const rest = prev.filter(t => !optimisticIds.has(t.id));
        return [...saved, ...rest];
      });
    } catch (err) {
      console.error('Failed to save AI tasks:', err);
      // Revert optimistic rows
      setTasks(prev => prev.filter(t => !optimisticTasks.some(ot => ot.id === t.id)));
      throw err;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.uid]);

  const handlePanelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!panelForm.title.trim()) return;
    setPanelError(null);
    const snapshot = { ...panelForm };
    const isEdit = panelMode === 'edit';
    setPanelForm({ title: '', description: '', priority: 'medium', category: activeCategory, dueDate: today, dueTime: '' });
    setPanelOpen(false);

    if (isEdit && editingId) {
      const id = editingId;
      setEditingId(null);
      const patch: Partial<Task> = {
        title:       snapshot.title.trim(),
        description: snapshot.description.trim(),
        priority:    snapshot.priority as Task['priority'],
        category:    snapshot.category,
        dueDate:     snapshot.dueDate,
        dueTime:     snapshot.dueTime,
        updatedAt:   new Date().toISOString(),
      };
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
      updateTodo(id, patch).catch(err => console.error('Failed to update task:', err));
    } else {
      const optimisticId = crypto.randomUUID();
      const newTask: Task = {
        id: optimisticId,
        userId:      user.uid,
        title:       snapshot.title.trim(),
        description: snapshot.description.trim(),
        priority:    snapshot.priority as Task['priority'],
        category:    snapshot.category,
        dueDate:     snapshot.dueDate,
        dueTime:     snapshot.dueTime,
        status:      'pending',
        completed:   false,
        streak:      0,
        lastCompletedDate: '',
        createdAt:   new Date().toISOString(),
        updatedAt:   new Date().toISOString(),
      };
      setTasks(prev => [newTask, ...prev]);
      createTodo({
        userId:            newTask.userId,
        title:             newTask.title,
        description:       newTask.description,
        priority:          newTask.priority,
        category:          newTask.category,
        dueDate:           newTask.dueDate,
        dueTime:           newTask.dueTime,
        status:            newTask.status,
        completed:         newTask.completed,
        streak:            newTask.streak,
        lastCompletedDate: newTask.lastCompletedDate,
      })
        .then(saved => setTasks(prev => prev.map(t => t.id === optimisticId ? saved : t)))
        .catch(err => {
          console.error('Failed to create task:', err);
          setPanelError('Failed to save task. Please try again.');
          setTasks(prev => prev.filter(t => t.id !== optimisticId));
        });
    }
  };

  const handleToggle = async (id: string, status: 'pending' | 'completed') => {
    const next = status === 'completed' ? 'pending' : 'completed';
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const todayDate = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];

    let streakUpdates: Partial<Task> = {};
    if ((task.category ?? 'daily') === 'daily') {
      if (next === 'completed') {
        const cur = task.streak ?? 0;
        const last = task.lastCompletedDate ?? '';
        let newStreak: number;
        if (last === todayDate) {
          newStreak = cur; // already counted today
        } else if (last === yesterdayDate) {
          newStreak = cur + 1; // continue streak
        } else {
          newStreak = 1; // start / restart streak
        }
        streakUpdates = { streak: newStreak, lastCompletedDate: todayDate };
      } else {
        // Uncompleting – undo today's increment if applicable
        const cur = task.streak ?? 0;
        if (task.lastCompletedDate === todayDate && cur > 0) {
          const newStreak = cur - 1;
          const lastDate = newStreak > 0 ? yesterdayDate : '';
          streakUpdates = { streak: newStreak, lastCompletedDate: lastDate };
        }
      }
    }

    const patch: Partial<Task> = {
      status: next,
      completed: next === 'completed',
      updatedAt: new Date().toISOString(),
      ...streakUpdates,
    };
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
    updateTodo(id, patch).catch(err => {
      console.error('Failed to update task:', err);
      // Revert on failure
      setTasks(prev => prev.map(t =>
        t.id === id ? { ...t, status, completed: status === 'completed' } : t
      ));
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    const id = deleteId;
    const removed = tasks.find(t => t.id === id);
    setDeleteId(null); // close dialog immediately
    setTasks(prev => prev.filter(t => t.id !== id));
    deleteTodo(id).catch(err => {
      console.error('Failed to delete task:', err);
      // Revert on failure
      if (removed) setTasks(prev => [removed, ...prev]);
    });
  };

  const openEdit = (task: Task) => {
    setEditingId(task.id);
    setPanelForm({
      title:       task.title,
      description: task.description ?? '',
      priority:    task.priority ?? 'medium',
      category:    (task.category ?? 'daily') as Category,
      dueDate:     task.dueDate ?? today,
      dueTime:     task.dueTime ?? '',
    });
    setPanelMode('edit');
    setPanelOpen(true);
  };

  /* ── Derived data ── */
  const filtered = activeView === 'all'
    ? tasks
    : activeView === 'completed'
    ? tasks.filter(t => t.status === 'completed')
    : tasks.filter(t => (t.category ?? 'daily') === activeView);
  const pending   = filtered.filter(t => t.status === 'pending').length;
  const done      = filtered.filter(t => t.status === 'completed').length;
  const total     = filtered.length;

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px clamp(16px, 4vw, 48px)' }}>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 28 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, color: 'var(--c-text-primary)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>
              {activeView === 'all' ? 'All Tasks' : activeView === 'completed' ? 'Completed Tasks' : 'My Workspace'}
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--c-text-secondary)', fontSize: 14 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {activeView !== 'completed' && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Btn18
                type="button"
                onClick={() => setAiOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, padding: '9px 16px' }}
              >
                <Sparkles size={14} strokeWidth={2} /> AI Generate
              </Btn18>
              <Btn18 onClick={() => { setPanelForm({ title: '', description: '', priority: 'medium', category: activeCategory, dueDate: today, dueTime: '' }); setPanelMode('add'); setPanelOpen(true); }} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, padding: '9px 18px' }}>
                <Plus size={14} strokeWidth={2.5} /> Add Task
              </Btn18>
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Unified View Tabs ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        style={{ marginBottom: 24 }}
      >
        <div style={{
          display: 'flex', gap: 2, padding: '4px',
          background: 'var(--c-surface)', borderRadius: 14,
          border: '1px solid var(--c-border)',
          width: isMobile ? '100%' : 'fit-content',
          overflowX: isMobile ? 'auto' : 'visible',
          position: 'relative',
        }}>
          {([
            ...CATEGORIES,
            { key: 'all', label: 'All Tasks' },
            { key: 'completed', label: 'Completed' },
          ] as { key: string; label: string }[]).map(tab => {
            const active = activeView === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => { setActiveView(tab.key as 'all' | 'completed' | Category); setPanelOpen(false); setEditingId(null); onViewChange?.(tab.key); }}
                aria-selected={active}
                role="tab"
                style={{
                  position: 'relative', padding: '7px 20px', borderRadius: 10,
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 13, fontWeight: 700,
                  background: 'transparent',
                  color: active ? '#fff' : 'var(--c-text-secondary)',
                  transition: 'color 0.2s ease',
                  zIndex: 1, outline: 'none',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.color = 'var(--c-accent)'; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.color = 'var(--c-text-secondary)'; } }}
              >
                {/* Sliding pill background */}
                {active && (
                  <motion.div
                    layoutId="tab-pill"
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      position: 'absolute', inset: 0, borderRadius: 10,
                      background: 'var(--c-accent)', zIndex: -1,
                      boxShadow: '0 2px 12px var(--c-accent-glow)',
                    }}
                  />
                )}
                {tab.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── Stats row ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}
      >
        {[
          { label: 'Total',   value: total,   color: 'var(--c-accent)',  bg: 'var(--c-accent-bg)',       border: 'var(--c-border-accent)'  },
          { label: 'Pending', value: pending,  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',   border: 'rgba(245,158,11,0.30)'  },
          { label: 'Done',    value: done,     color: 'var(--c-green)', bg: 'var(--c-green-glow)',    border: 'rgba(34,197,94,0.32)'   },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            style={{
              padding: '16px 20px', borderRadius: 12, textAlign: 'center',
              background: s.bg, border: `1px solid ${s.border}`,
            }}
          >
            <div style={{ color: s.color, fontWeight: 800, fontSize: 28, lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: 'var(--c-text-secondary)', fontSize: 11, fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Task List ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--c-text-secondary)', fontSize: 14 }}>
          Loading tasks…
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <EmptyState key="empty" category={activeCategory} />
          ) : (
            <motion.div
              key="list"
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={i}
                    onToggle={handleToggle}
                    onDeleteClick={id => setDeleteId(id)}
                    onEditOpen={openEdit}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── Delete dialog ── */}
      <AnimatePresence>
        {deleteId && (
          <DeleteDialog
            key="del-dialog"
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteId(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Add / Edit Task Drawer ── */}
      <AnimatePresence>
        {panelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="panel-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => { setPanelOpen(false); setEditingId(null); }}
              style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
            />
            {/* Drawer */}
            <motion.div
              key="panel-drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 1000,
                width: isMobile ? '100vw' : 460,
                background: 'var(--c-bg-card)',
                borderLeft: '1px solid var(--c-border-accent)',
                borderRadius: isMobile ? 0 : '20px 0 0 20px',
                boxShadow: '-12px 0 48px rgba(0,0,0,0.35)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px 24px', borderBottom: '1px solid var(--c-border)', flexShrink: 0,
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--c-accent)', fontSize: 16, fontWeight: 700 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--c-accent-bg-hover)' }}>
                    <Plus size={15} color="#c4b5fd" strokeWidth={2.5} />
                  </span>
                  {panelMode === 'edit' ? 'Edit Task' : 'Add Task'}
                </span>
                <button
                  type="button"
                  onClick={() => { setPanelOpen(false); setEditingId(null); }}
                  style={{ width: 32, height: 32, borderRadius: 8, cursor: 'pointer', border: '1px solid var(--c-border-strong)', background: 'var(--c-surface)', color: 'var(--c-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--c-accent)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--c-text-primary)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--c-border-strong)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--c-text-secondary)'; }}
                >
                  <X size={14} />
                </button>
              </div>
              {/* Form */}
              <form onSubmit={handlePanelSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <TaskFormFields
                    form={panelForm}
                    onChange={handlePanelChange}
                    isMobile={isMobile}
                    minDate={today}
                    overlayStyle={isMobile ? undefined : { left: 'auto', right: 0, width: 460 }}
                  />
                  {panelError && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderRadius: 9, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)' }}>
                      <X size={13} color="#f87171" />
                      <p style={{ margin: 0, color: '#f87171', fontSize: 13 }}>{panelError}</p>
                    </div>
                  )}
                </div>
                <div style={{ flexShrink: 0, borderTop: '1px solid var(--c-border)', padding: '16px 24px', display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center', background: 'var(--c-bg-card)' }}>
                  <button
                    type="button"
                    onClick={() => { setPanelOpen(false); setEditingId(null); }}
                    style={{
                      padding: '9px 20px', borderRadius: 10, cursor: 'pointer',
                      fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                      border: '1px solid var(--c-border-strong)',
                      background: 'var(--c-surface)',
                      color: 'var(--c-text-secondary)',
                      lineHeight: 1.5, transition: 'all 0.15s',
                      boxSizing: 'border-box',
                    }}
                    onMouseEnter={e => {
                      const b = e.currentTarget as HTMLButtonElement;
                      b.style.background = 'rgba(239,68,68,0.1)';
                      b.style.borderColor = 'rgba(239,68,68,0.5)';
                      b.style.color = '#f87171';
                    }}
                    onMouseLeave={e => {
                      const b = e.currentTarget as HTMLButtonElement;
                      b.style.background = 'var(--c-surface)';
                      b.style.borderColor = 'var(--c-border-strong)';
                      b.style.color = 'var(--c-text-secondary)';
                    }}
                  >
                    Cancel
                  </button>
                  <Btn18
                    type="submit"
                    disabled={!panelForm.title.trim()}
                    style={{ padding: '9px 20px', fontSize: 13, fontWeight: 700, textTransform: 'none', letterSpacing: 0, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Plus size={13} strokeWidth={2.5} /> {panelMode === 'edit' ? 'Save Changes' : 'Add Task'}
                  </Btn18>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── AI Generate Drawer ── */}
      <AITaskPanel
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        onAddTasks={handleAIAddTasks}
      />
    </div>
  );
};

export default Workspace;
