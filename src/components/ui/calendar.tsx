import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CalendarProps {
  value: string
  onChange: (value: string) => void
  minDate?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// ─── Exported helpers (used by date-picker.tsx) ────────────────────────────────

export function toDayStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export function formatDateDisplay(val: string): string {
  const [y, m, d] = val.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function NavButton({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 28, height: 28, border: 'none', borderRadius: 8, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hover ? 'var(--c-surface-hover)' : 'transparent',
        color: hover ? 'var(--c-text-primary)' : 'var(--c-text-secondary)',
        transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {direction === 'left' ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
    </button>
  )
}

function DayCell({ day, selected, today, disabled, onClick }: {
  day: number; selected: boolean; today: boolean; disabled: boolean; onClick: () => void
}) {
  const [hover, setHover] = useState(false)
  const bg = selected ? 'var(--c-accent)' : (hover && !disabled ? 'var(--c-surface-hover)' : 'transparent')
  const color = selected ? '#ffffff'
    : disabled ? 'var(--c-text-dim)'
    : today ? 'var(--c-accent-light)'
    : hover ? 'var(--c-text-primary)'
    : 'var(--c-text-secondary)'
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => !disabled && setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 32, height: 32, borderRadius: '50%',
        border: (!selected && today) ? '1px solid var(--c-border-accent)' : 'none',
        background: bg, color,
        fontWeight: selected ? 700 : today ? 600 : 400,
        fontSize: 12, fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '2px auto', transition: 'all 0.12s', outline: 'none',
      }}
    >
      {day}
    </button>
  )
}

function FooterButton({ label, onClick, hoverColor }: {
  label: string; onClick: () => void; hoverColor: string
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
        color: hover ? hoverColor : 'var(--c-text-secondary)',
        background: hover ? `${hoverColor}18` : 'transparent',
        border: 'none', borderRadius: 6, padding: '4px 10px',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  )
}

// ─── Calendar ──────────────────────────────────────────────────────────────────

export function Calendar({ value, onChange, minDate }: CalendarProps) {
  const now = new Date()
  const todayStr = toDayStr(now.getFullYear(), now.getMonth(), now.getDate())

  const [viewYear, setViewYear] = useState(() =>
    value ? Number(value.split('-')[0]) : now.getFullYear()
  )
  const [viewMonth, setViewMonth] = useState(() =>
    value ? Number(value.split('-')[1]) - 1 : now.getMonth()
  )

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysCount = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysCount }, (_, i) => i + 1),
  ]

  return (
    <div>
      {/* Month / year navigation */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 16px 8px',
      }}>
        <NavButton direction="left" onClick={prevMonth} />
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-text-primary)' }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <NavButton direction="right" onClick={nextMonth} />
      </div>

      {/* Weekday headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 12px 2px' }}>
        {WEEKDAYS.map(d => (
          <div key={d} style={{
            textAlign: 'center', fontSize: 10, fontWeight: 600,
            color: 'var(--c-text-dim)', padding: '2px 0 4px',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 12px 8px' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />
          const str = toDayStr(viewYear, viewMonth, day)
          return (
            <DayCell
              key={day}
              day={day}
              selected={str === value}
              today={str === todayStr}
              disabled={!!minDate && str < minDate}
              onClick={() => { if (!(minDate && str < minDate)) onChange(str) }}
            />
          )
        })}
      </div>

      {/* Footer: Clear / Today */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 16px 16px', borderTop: '1px solid var(--c-border)',
      }}>
        <FooterButton label="Clear" onClick={() => onChange('')} hoverColor="#ef4444" />
        <FooterButton
          label="Today"
          onClick={() => {
            if (minDate && todayStr < minDate) return
            setViewYear(now.getFullYear())
            setViewMonth(now.getMonth())
            onChange(todayStr)
          }}
          hoverColor="#a78bfa"
        />
      </div>
    </div>
  )
}
