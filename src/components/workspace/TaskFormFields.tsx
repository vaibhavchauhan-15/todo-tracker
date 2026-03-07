import React from 'react';
import { CalendarDays, Clock, Flag, Tag } from 'lucide-react';
import { DatePicker } from '../ui/date-picker';
import { ClockTimePicker } from '../ui/clock-time-picker';
import PriorityPills from './PriorityPills';
import CategoryPills from './CategoryPills';
import { Priority, Category } from './types';

const inputBase: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  padding: '11px 14px', borderRadius: 10,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#ede9fe', fontSize: 14, fontFamily: 'inherit',
  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
  letterSpacing: '0.01em',
};

const textareaBase: React.CSSProperties = {
  ...inputBase, resize: 'vertical', minHeight: 88, lineHeight: 1.55,
};

const FL: React.FC<{ children: React.ReactNode; icon?: React.ReactNode }> = ({ children, icon }) => (
  <label style={{
    display: 'flex', alignItems: 'center', gap: 6,
    marginBottom: 8, color: 'rgba(255,255,255,0.45)',
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
}

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({ form, onChange, isMobile, minDate }) => (
  <>
    {/* Title */}
    <div>
      <FL>Title *</FL>
      <input
        style={inputBase} value={form.title} required autoFocus
        placeholder="What do you need to do?"
        onChange={e => onChange('title', e.target.value)}
        onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; e.target.style.background = 'rgba(124,58,237,0.06)'; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
      />
    </div>

    {/* Description */}
    <div>
      <FL>Description</FL>
      <textarea
        style={textareaBase} value={form.description}
        placeholder="Add details or notes (optional)"
        onChange={e => onChange('description', e.target.value)}
        onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'; e.target.style.background = 'rgba(124,58,237,0.06)'; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
      />
    </div>

    {/* Priority + Schedule row */}
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
      {/* Priority */}
      <div>
        <FL icon={<Flag size={11} />}>Priority</FL>
        <PriorityPills value={form.priority} onChange={p => onChange('priority', p)} />
      </div>

      {/* Schedule */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {form.category !== 'daily' && (
          <div>
            <FL icon={<CalendarDays size={11} />}>Due Date</FL>
            <DatePicker
              value={form.dueDate}
              onChange={v => onChange('dueDate', v)}
              minDate={minDate}
              placeholder="Pick a due date"
            />
          </div>
        )}
        <div>
          <FL icon={<Clock size={11} />}>Due Time</FL>
          <ClockTimePicker
            value={form.dueTime}
            onChange={v => onChange('dueTime', v)}
          />
        </div>
      </div>
    </div>

    {/* Category */}
    <div>
      <FL icon={<Tag size={11} />}>Category</FL>
      <CategoryPills value={form.category} onChange={c => onChange('category', c)} />
    </div>
  </>
);

export default TaskFormFields;
