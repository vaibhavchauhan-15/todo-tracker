'use client'

/**
 * ClockTimePicker
 *
 * A circular analog-style clock picker with AM/PM toggle.
 * - Step 1: tap/click on the clock face to select the hour (1-12).
 * - Step 2: clock automatically switches to minute selection (0-59).
 * - AM/PM toggle is always visible.
 * - Emits value as "HH:mm" in 24-hour format so existing API routes are unchanged.
 * - Fully keyboard-accessible and reduced-motion-safe.
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock } from 'lucide-react'

// ─── AM/PM Button (needs hover state) ────────────────────────────────────────

function AmPmButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 36, height: 28, borderRadius: 6, border: 'none',
        fontSize: 11, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
        background: active ? '#7C3AED' : (hover ? '#2d2a3e' : 'transparent'),
        color: active ? '#ffffff' : (hover ? '#ffffff' : '#8b86a8'),
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = 'hour' | 'minute'
type Period = 'AM' | 'PM'

interface ClockTimePickerProps {
  /** Current value as "HH:mm" (24-h) or empty string */
  value: string
  onChange: (value: string) => void
  /** Optional label override */
  label?: string
  className?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Parse "HH:mm" string → { hour12, minute, period } */
function parse24h(val: string): { hour12: number; minute: number; period: Period } {
  const [hStr, mStr] = val.split(':')
  const h24 = parseInt(hStr, 10)
  const m = parseInt(mStr ?? '0', 10)
  const period: Period = h24 < 12 ? 'AM' : 'PM'
  const hour12 = h24 % 12 === 0 ? 12 : h24 % 12
  return { hour12, minute: isNaN(m) ? 0 : m, period }
}

/** Convert hour12 + period → 24-hour number */
function to24h(hour12: number, period: Period): number {
  if (period === 'AM') return hour12 === 12 ? 0 : hour12
  return hour12 === 12 ? 12 : hour12 + 12
}

/** Get (x, y) position on a circle given angle (degrees from 12 o'clock) and radius */
function polarToXY(angleDeg: number, radius: number, cx: number, cy: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
}

/** Get the angle (0-360) from centre to pointer position */
function xyToAngle(px: number, py: number, cx: number, cy: number): number {
  const dx = px - cx
  const dy = py - cy
  const rad = Math.atan2(dy, dx)
  let deg = (rad * 180) / Math.PI + 90
  if (deg < 0) deg += 360
  return deg % 360
}

// ─── Sub-component: Clock Face ────────────────────────────────────────────────

const CLOCK_SIZE = 230
const CENTER = CLOCK_SIZE / 2
const HOUR_RADIUS = 86
const MINUTE_RADIUS = 86
const HAND_RADIUS = 72

interface FaceProps {
  mode: Mode
  hour12: number
  minute: number
  onSelect: (value: number) => void
}

function ClockFace({ mode, hour12, minute, onSelect }: FaceProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const isDragging = useRef(false)

  const selected = mode === 'hour' ? hour12 : minute

  // Hand angle
  const handAngle =
    mode === 'hour'
      ? (hour12 % 12) * 30          // 360/12 = 30° per hour
      : minute * 6                  // 360/60 = 6° per minute

  // Numbers on the clock face
  const numbers =
    mode === 'hour'
      ? Array.from({ length: 12 }, (_, i) => i + 1)      // 1-12
      : Array.from({ length: 12 }, (_, i) => i * 5)      // 0,5,10,…55

  function angleFromEvent(e: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent) {
    if (!svgRef.current) return 0
    const rect = svgRef.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    let clientX: number, clientY: number
    if ('touches' in e) {
      clientX = e.touches[0]?.clientX ?? (e as any).changedTouches[0]?.clientX
      clientY = e.touches[0]?.clientY ?? (e as any).changedTouches[0]?.clientY
    } else {
      clientX = (e as MouseEvent).clientX
      clientY = (e as MouseEvent).clientY
    }
    return xyToAngle(clientX, clientY, cx, cy)
  }

  function angleToValue(angle: number): number {
    if (mode === 'hour') {
      const h = Math.round(angle / 30) % 12
      return h === 0 ? 12 : h
    } else {
      return Math.round(angle / 6) % 60
    }
  }

  const handleInteract = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      const angle = angleFromEvent(e)
      const val = mode === 'hour'
        ? (() => { const h = Math.round(angle / 30) % 12; return h === 0 ? 12 : h })()
        : Math.round(angle / 6) % 60
      onSelect(val)
    },
    [mode, onSelect],
  )

  // Also handle drag/move to allow smooth sweeping
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    handleInteract(e)
    const move = (mv: MouseEvent) => {
      if (!isDragging.current) return
      const angle = angleFromEvent(mv)
      onSelect(angleToValue(angle))
    }
    const up = () => { isDragging.current = false; window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  const { x: hx, y: hy } = polarToXY(handAngle, HAND_RADIUS, CENTER, CENTER)

  return (
    <svg
      ref={svgRef}
      width={CLOCK_SIZE}
      height={CLOCK_SIZE}
      viewBox={`0 0 ${CLOCK_SIZE} ${CLOCK_SIZE}`}
      style={{ userSelect: 'none', touchAction: 'none', cursor: 'pointer', width: '100%', maxWidth: 230 }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleInteract}
      onTouchMove={handleInteract}
    >
      {/* Outer ring */}
      <circle cx={CENTER} cy={CENTER} r={CENTER - 4} fill="#1e1b2e" stroke="#2d2a3e" strokeWidth={2} />

      {/* Hand */}
      <line
        x1={CENTER}
        y1={CENTER}
        x2={hx}
        y2={hy}
        stroke="#7C3AED"
        strokeWidth={2.5}
        strokeLinecap="round"
        style={{ transition: 'x2 0.18s ease, y2 0.18s ease' }}
      />

      {/* Centre dot */}
      <circle cx={CENTER} cy={CENTER} r={4} fill="#7C3AED" />

      {/* Dot at hand tip */}
      <circle cx={hx} cy={hy} r={18} fill="#7C3AED" opacity={0.18} />
      <circle cx={hx} cy={hy} r={10} fill="#7C3AED" />

      {/* Numbers */}
      {numbers.map((num, i) => {
        const angle = mode === 'hour' ? num * 30 : num * 6
        const { x, y } = polarToXY(angle, mode === 'hour' ? HOUR_RADIUS : MINUTE_RADIUS, CENTER, CENTER)
        const isSelected = num === selected
        return (
          <g key={num}>
            {isSelected && <circle cx={x} cy={y} r={16} fill="#7C3AED" />}
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={isSelected ? 14 : 13}
              fontWeight={isSelected ? 700 : 400}
              fill={isSelected ? '#ffffff' : '#8b86a8'}
            >
              {mode === 'minute' ? String(num).padStart(2, '0') : num}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ClockTimePicker({ value, onChange, label, className = '' }: ClockTimePickerProps) {
  // Parse controlled value; fallback to 12:00 AM
  const parsed = value ? parse24h(value) : { hour12: 12, minute: 0, period: 'AM' as Period }

  const [hour12, setHour12] = useState(parsed.hour12)
  const [minute, setMinute] = useState(parsed.minute)
  const [period, setPeriod] = useState<Period>(parsed.period)
  const [mode, setMode] = useState<Mode>('hour')
  const [open, setOpen] = useState(false)

  // Sync from external value
  useEffect(() => {
    if (value) {
      const p = parse24h(value)
      setHour12(p.hour12)
      setMinute(p.minute)
      setPeriod(p.period)
    }
  }, [value])

  // Emit every time internal state changes
  const emit = useCallback(
    (h: number, m: number, p: Period) => {
      const h24 = to24h(h, p)
      const str = `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      onChange(str)
    },
    [onChange],
  )

  const handleHourSelect = useCallback(
    (h: number) => {
      setHour12(h)
      emit(h, minute, period)
      // Auto-advance to minute picking after a short delay
      setTimeout(() => setMode('minute'), 160)
    },
    [minute, period, emit],
  )

  const handleMinuteSelect = useCallback(
    (m: number) => {
      setMinute(m)
      emit(hour12, m, period)
    },
    [hour12, period, emit],
  )

  const handlePeriod = useCallback(
    (p: Period) => {
      setPeriod(p)
      emit(hour12, minute, p)
    },
    [hour12, minute, emit],
  )

  const handleClear = () => {
    onChange('')
    setOpen(false)
  }

  const handleDone = () => setOpen(false)

  const displayTime = value
    ? `${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`
    : null

  const [triggerHover, setTriggerHover] = useState(false)
  const [clearHover, setClearHover] = useState(false)
  const [hourHover, setHourHover] = useState(false)
  const [minHover, setMinHover] = useState(false)
  const [clearBtnHover, setClearBtnHover] = useState(false)
  const [doneBtnHover, setDoneBtnHover] = useState(false)

  return (
    <div style={{ position: 'relative' }} className={className}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setTriggerHover(true)}
        onMouseLeave={() => setTriggerHover(false)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 12px', borderRadius: 8, background: '#1e1b2e',
          border: `1px solid ${(triggerHover || open) ? 'rgba(124,58,237,0.5)' : '#2d2a3e'}`,
          fontSize: 14, fontFamily: 'inherit', cursor: 'pointer',
          outline: 'none', transition: 'border-color 0.2s',
        }}
      >
        <Clock size={15} style={{ color: '#7C3AED', flexShrink: 0 }} />
        {displayTime ? (
          <span style={{ color: '#ffffff', fontWeight: 500 }}>{displayTime}</span>
        ) : (
          <span style={{ color: '#8b86a8' }}>Set reminder time…</span>
        )}
        {displayTime && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); handleClear() }}
            onKeyDown={(e) => e.key === 'Enter' && (e.stopPropagation(), handleClear())}
            onMouseEnter={() => setClearHover(true)}
            onMouseLeave={() => setClearHover(false)}
            style={{
              marginLeft: 'auto', fontSize: 12, cursor: 'pointer',
              color: clearHover ? '#ffffff' : '#8b86a8',
              transition: 'color 0.15s',
            }}
            aria-label="Clear time"
          >
            ✕
          </span>
        )}
      </button>

      {/* Popover — centred fixed overlay */}
      <AnimatePresence>
        {open && (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)',
              padding: 16,
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
              borderRadius: 16, background: '#13111e',
              border: '1px solid #2d2a3e',
              boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
              overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Digital readout + mode tabs */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 4, padding: '16px 20px 8px',
            }}>
              <button
                type="button"
                onClick={() => setMode('hour')}
                onMouseEnter={() => setHourHover(true)}
                onMouseLeave={() => setHourHover(false)}
                style={{
                  fontSize: 36, fontWeight: 700, letterSpacing: -0.5, background: 'transparent',
                  border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: 4,
                  fontFamily: 'inherit', transition: 'color 0.15s',
                  color: mode === 'hour' ? '#7C3AED' : (hourHover ? '#ffffff' : '#8b86a8'),
                }}
              >
                {String(hour12).padStart(2, '0')}
              </button>
              <span style={{ fontSize: 28, fontWeight: 700, color: '#4b4664', marginBottom: 2 }}>:</span>
              <button
                type="button"
                onClick={() => setMode('minute')}
                onMouseEnter={() => setMinHover(true)}
                onMouseLeave={() => setMinHover(false)}
                style={{
                  fontSize: 36, fontWeight: 700, letterSpacing: -0.5, background: 'transparent',
                  border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: 4,
                  fontFamily: 'inherit', transition: 'color 0.15s',
                  color: mode === 'minute' ? '#7C3AED' : (minHover ? '#ffffff' : '#8b86a8'),
                }}
              >
                {String(minute).padStart(2, '0')}
              </button>

              {/* AM / PM */}
              <div style={{ marginLeft: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {(['AM', 'PM'] as const).map((p) => (
                  <AmPmButton
                    key={p}
                    label={p}
                    active={period === p}
                    onClick={() => handlePeriod(p)}
                  />
                ))}
              </div>
            </div>

            {/* Mode label */}
            <p style={{
              textAlign: 'center', fontSize: 10, fontWeight: 500,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: '#4b4664', margin: '0 0 4px',
            }}>
              {mode === 'hour' ? 'Select Hour' : 'Select Minute'}
            </p>

            {/* Clock face */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '0 12px 12px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                >
                  <ClockFace
                    mode={mode}
                    hour12={hour12}
                    minute={minute}
                    onSelect={mode === 'hour' ? handleHourSelect : handleMinuteSelect}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer actions */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 16px 16px', gap: 8,
            }}>
              <button
                type="button"
                onClick={handleClear}
                onMouseEnter={() => setClearBtnHover(true)}
                onMouseLeave={() => setClearBtnHover(false)}
                style={{
                  fontSize: 12, fontFamily: 'inherit', cursor: 'pointer', border: 'none',
                  color: clearBtnHover ? '#ffffff' : '#8b86a8',
                  background: clearBtnHover ? '#2d2a3e' : 'transparent',
                  borderRadius: 6, padding: '4px 8px', transition: 'all 0.15s',
                }}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleDone}
                onMouseEnter={() => setDoneBtnHover(true)}
                onMouseLeave={() => setDoneBtnHover(false)}
                style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, border: 'none',
                  background: doneBtnHover ? '#6d35d4' : '#7C3AED',
                  color: '#ffffff', fontSize: 14, fontWeight: 600,
                  fontFamily: 'inherit', cursor: 'pointer', transition: 'background 0.15s',
                }}
              >
                Done
              </button>
            </div>
          </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
