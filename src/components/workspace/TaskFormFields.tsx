import React from 'react';
import { CalendarDays, Clock, Flag, Tag } from 'lucide-react';
import { DatePicker } from '../ui/date-picker';
import { ClockTimePicker } from '../ui/clock-time-picker';
import PriorityPills from './PriorityPills';
import CategoryPills from './CategoryPills';
import { Priority, Category } from './types';

const inputBase: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  padding: '12px 14px', borderRadius: 10,
  background: 'var(--c-input-bg)',
  border: '1px solid var(--c-input-border)',
  color: 'var(--c-input-text)', fontSize: 14, fontFamily: 'inherit',
  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
  letterSpacing: '0.01em',
};

const textareaBase: React.CSSProperties = {
  ...inputBase, resize: 'vertical', minHeight: 100, lineHeight: 1.6,
};

const FL: React.FC<{ children: React.ReactNode; icon?: React.ReactNode }> = ({ children, icon }) => (
  <label style={{
    display: 'flex', alignItems: 'center', gap: 6,
    marginBottom: 10, color: 'var(--c-text-secondary)',
    fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
  }}>
    {icon && <span style={{ opacity: 0.7, display: 'flex', alignItems: 'center' }}>{icon}</span>}
    {children}
  </label>
);

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  dueDate: string;
  dueTime: string;
}

interface TaskFormFieldsProps {
  form: TaskFormData;
  onChange: (key: string, val: string) => void;
  isMobile: boolean;
  minDate?: string;
  overlayStyle?: React.CSSProperties;
}

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({ form, onChange, isMobile, minDate, overlayStyle }) => (
  <>
    {/* Category */}
    <div>
      <FL icon={<Tag size={11} />}>Category</FL>
      <CategoryPills value={form.category} onChange={c => onChange('category', c)} />
    </div>

    {/* Priority */}
    <div>
      <FL icon={<Flag size={11} />}>Priority</FL>
      <PriorityPills value={form.priority} onChange={p => onChange('priority', p)} />
    </div>

    {/* Title */}
    <div>
      <FL>Title <span style={{ color: '#f87171' }}>*</span></FL>
      <input
        style={inputBase} value={form.title} required autoFocus
        placeholder="What do you need to do?"
        onChange={e => onChange('title', e.target.value)}
        onFocus={e => { e.target.style.borderColor = 'var(--c-input-border-focus)'; e.target.style.boxShadow = '0 0 0 3px var(--c-accent-glow-sm)'; e.target.style.background = 'var(--c-input-bg-focus)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--c-input-border)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--c-input-bg)'; }}
      />
    </div>

    {/* Description */}
    <div>
      <FL>Description</FL>
      <textarea
        style={textareaBase} value={form.description}
        placeholder="Add details or notes (optional)"
        onChange={e => onChange('description', e.target.value)}
        onFocus={e => { e.target.style.borderColor = 'var(--c-input-border-focus)'; e.target.style.boxShadow = '0 0 0 3px var(--c-accent-glow-sm)'; e.target.style.background = 'var(--c-input-bg-focus)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--c-input-border)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'var(--c-input-bg)'; }}
      />
    </div>

    {/* Due Date + Due Time — horizontal row */}
    <div style={{ display: 'grid', gridTemplateColumns: form.category !== 'daily' ? '1fr 1fr' : '1fr', gap: 12 }}>
      {form.category !== 'daily' && (
        <div>
          <FL icon={<CalendarDays size={11} />}>Due Date <span style={{ color: '#f87171' }}>*</span></FL>
          <DatePicker
            value={form.dueDate}
            onChange={v => onChange('dueDate', v)}
            minDate={minDate}
            placeholder="Pick date"
            overlayStyle={overlayStyle}
          />
        </div>
      )}
      <div>
        <FL icon={<Clock size={11} />}>Due Time <span style={{ color: '#f87171' }}>*</span></FL>
        <ClockTimePicker
          value={form.dueTime}
          onChange={v => onChange('dueTime', v)}
          overlayStyle={overlayStyle}
        />
      </div>
    </div>
  </>
);

export default TaskFormFields;
