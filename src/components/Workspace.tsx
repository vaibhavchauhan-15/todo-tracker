import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, Task, StreakData, CATEGORIES } from './workspace/types';
import { useIsMobile } from './workspace/useIsMobile';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../services/todoService';
import StreakBadge from './workspace/StreakBadge';
import EmptyState from './workspace/EmptyState';
import DeleteDialog from './workspace/DeleteDialog';
import TaskCard from './workspace/TaskCard';
import AddTaskPanel from './workspace/AddTaskPanel';
import { TaskFormData } from './workspace/TaskFormFields';

interface WorkspaceProps {
  user: any;
  externalCategory?: Category;
  navView?: string;
  triggerAdd?: boolean;
  onAddHandled?: () => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ user, externalCategory, navView, triggerAdd, onAddHandled }) => {
  const [tasks, setTasks]               = useState<Task[]>([]);
  const [loading, setLoading]           = useState(true);
  const [activeCategory, setCategory]   = useState<Category>(externalCategory ?? 'daily');
  const [addOpen, setAddOpen]           = useState(false);
  const [deleteId, setDeleteId]         = useState<string | null>(null);
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [streak, setStreak]             = useState<StreakData>({ count: 0, lastDate: '' });
  const streakRef                       = useRef<StreakData>({ count: 0, lastDate: '' });
  const isMobile                        = useIsMobile();

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
    } else if (!anyDone) {
      setStreak(prev);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  /* ── Sync external category / view from sidebar ── */
  useEffect(() => {
    if (navView === 'all' || navView === 'completed') {
      setAddOpen(false);
      setEditingId(null);
    } else if (externalCategory && externalCategory !== activeCategory) {
      setCategory(externalCategory);
      setAddOpen(false);
      setEditingId(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalCategory, navView]);

  /* ── Handle sidebar "Create Task" trigger ── */
  useEffect(() => {
    if (triggerAdd) {
      setAddOpen(true);
      onAddHandled?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerAdd]);

  /* ── Keyboard shortcut: "N" to open add panel ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === 'n' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        setAddOpen(o => !o);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  /* ── Add form ── */
  const [addForm, setAddForm] = useState<TaskFormData>({
    title: '', description: '', priority: 'medium',
    category: 'daily', dueDate: today, dueTime: '',
  });
  const [addError, setAddError] = useState<string | null>(null);

  /* ── Edit form ── */
  const [editForm, setEditForm] = useState<TaskFormData>({
    title: '', description: '', priority: 'medium',
    category: 'daily', dueDate: today, dueTime: '',
  });

  /* ── Sync add-form category to active tab ── */
  useEffect(() => {
    if (!addOpen) setAddForm(f => ({ ...f, category: activeCategory, dueDate: today, dueTime: '' }));
  }, [activeCategory, addOpen, today]);

  /* ── Handlers ── */
  const handleAddChange = useCallback((key: string, val: string) => {
    setAddForm(f => ({ ...f, [key]: val }));
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.title.trim()) return;
    setAddError(null);
    const snapshot = { ...addForm };
    setAddForm({ title: '', description: '', priority: 'medium', category: activeCategory, dueDate: today, dueTime: '' });
    setAddOpen(false);
    const optimisticId = crypto.randomUUID();
    const newTask: Task = {
      id: optimisticId,
      userId:      user.uid,
      title:       snapshot.title.trim(),
      description: snapshot.description.trim(),
      priority:    snapshot.priority,
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
    // Optimistic update — replace with real DB row when available
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
        setAddError('Failed to save task. Please try again.');
        setTasks(prev => prev.filter(t => t.id !== optimisticId));
      });
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
    setEditForm({
      title:       task.title,
      description: task.description ?? '',
      priority:    task.priority ?? 'medium',
      category:    (task.category ?? 'daily') as Category,
      dueDate:     task.dueDate ?? today,
      dueTime:     task.dueTime ?? '',
    });
  };

  const handleEditChange = useCallback((key: string, val: string) => {
    setEditForm(f => ({ ...f, [key]: val }));
  }, []);

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editForm.title.trim()) return;
    const snapshot = { ...editForm };
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
    updateTodo(id, patch).catch(err => {
      console.error('Failed to update task:', err);
    });
  };

  /* ── Derived data ── */
  const filtered = navView === 'all'
    ? tasks
    : navView === 'completed'
    ? tasks.filter(t => t.status === 'completed')
    : tasks.filter(t => (t.category ?? 'daily') === activeCategory);
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
              {navView === 'all' ? 'All Tasks' : navView === 'completed' ? 'Completed Tasks' : 'My Workspace'}
            </h1>
            <p style={{ margin: '4px 0 0', color: 'var(--c-text-secondary)', fontSize: 14 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {activeCategory === 'daily' && <StreakBadge count={streak.count} />}
        </div>
      </motion.div>

      {/* ── Category Tabs — hidden on 'all' and 'completed' views ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        style={{ marginBottom: 24, display: navView === 'all' || navView === 'completed' ? 'none' : undefined }}
      >
        <div style={{
          display: 'flex', gap: 2, padding: '4px',
          background: 'var(--c-surface)', borderRadius: 14,
          border: '1px solid var(--c-border)',
          width: isMobile ? '100%' : 'fit-content',
          overflowX: isMobile ? 'auto' : 'visible',
          position: 'relative',
        }}>
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => { setCategory(cat.key); setAddOpen(false); setEditingId(null); }}
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
                {cat.label}
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
          { label: 'Pending', value: pending,  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',   border: 'rgba(245,158,11,0.18)'  },
          { label: 'Done',    value: done,     color: 'var(--c-green)', bg: 'var(--c-green-glow)',    border: 'rgba(34,197,94,0.22)'   },
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

      {/* ── Add Task Panel ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        style={{ marginBottom: 24 }}
      >
        <AddTaskPanel
          isOpen={addOpen}
          onToggle={() => setAddOpen(o => !o)}
          form={addForm}
          onChange={handleAddChange}
          onSubmit={handleAddSubmit}
          error={addError}
        />
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
                    editingId={editingId}
                    editForm={editForm}
                    isSaving={false}
                    onToggle={handleToggle}
                    onDeleteClick={id => setDeleteId(id)}
                    onEditOpen={openEdit}
                    onEditChange={handleEditChange}
                    onEditSave={handleEditSave}
                    onEditCancel={() => setEditingId(null)}
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
    </div>
  );
};

export default Workspace;
