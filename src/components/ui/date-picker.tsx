import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar, formatDateDisplay } from './calendar'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DatePickerProps {
  /** 'YYYY-MM-DD' string or empty string */
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  /** Disable dates before this 'YYYY-MM-DD' string */
  minDate?: string
  /** Override the fixed overlay container style (e.g. to constrain to a drawer) */
  overlayStyle?: React.CSSProperties
}

// ─── DatePicker ───────────────────────────────────────────────────────────────

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  className = '',
  minDate,
  overlayStyle,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [triggerHover, setTriggerHover] = useState(false)
  const [clearHover, setClearHover] = useState(false)

  const handleChange = (v: string) => {
    onChange(v)
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative' }} className={className}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setTriggerHover(true)}
        onMouseLeave={() => setTriggerHover(false)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 12px', borderRadius: 8, background: 'var(--c-input-bg)',
          border: `1px solid ${(triggerHover || open) ? 'var(--c-border-accent)' : 'var(--c-input-border)'}`,
          fontSize: 14, fontFamily: 'inherit', cursor: 'pointer',
          outline: 'none', transition: 'border-color 0.2s',
        }}
      >
        <CalendarIcon size={15} style={{ color: 'var(--c-accent)', flexShrink: 0 }} />
        {value ? (
          <span style={{ color: 'var(--c-text-primary)', fontWeight: 500 }}>{formatDateDisplay(value)}</span>
        ) : (
          <span style={{ color: 'var(--c-text-secondary)' }}>{placeholder}</span>
        )}
        {value && (
          <span
            role="button"
            tabIndex={0}
            onClick={e => { e.stopPropagation(); onChange('') }}
            onKeyDown={e => e.key === 'Enter' && (e.stopPropagation(), onChange(''))}
            onMouseEnter={() => setClearHover(true)}
            onMouseLeave={() => setClearHover(false)}
            style={{
              marginLeft: 'auto', fontSize: 12, cursor: 'pointer',
              color: clearHover ? 'var(--c-text-primary)' : 'var(--c-text-secondary)',
              transition: 'color 0.15s',
            }}
            aria-label="Clear date"
          >
            ✕
          </span>
        )}
      </button>

      {/* Calendar popover — centred fixed overlay */}
      <AnimatePresence>
        {open && (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)',
              padding: 16,
              ...overlayStyle,
            }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.93 }}
              transition={{ type: 'spring', damping: 24, stiffness: 340 }}
              style={{
                width: 280, maxWidth: 'calc(100vw - 32px)',
                borderRadius: 16, background: 'var(--c-bg-card)',
                border: '1px solid var(--c-border)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
                overflow: 'hidden',
              }}
              onClick={e => e.stopPropagation()}
            >
              <Calendar value={value} onChange={handleChange} minDate={minDate} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
