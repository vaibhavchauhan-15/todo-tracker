// ─────────────────────────────────────────────────────────────────────────────
// Design tokens shared across all landing page sections
// ─────────────────────────────────────────────────────────────────────────────
export const C = {
  bg: '#0B0F19',
  bgCard: '#111827',
  bgDarker: '#080C14',
  bgSection: '#0D1220',
  accent: '#6366F1',
  accentDark: '#4F46E5',
  accentGlow: 'rgba(99,102,241,0.25)',
  green: '#22C55E',
  greenGlow: 'rgba(34,197,94,0.2)',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  border: 'rgba(255,255,255,0.08)',
  borderAccent: 'rgba(99,102,241,0.5)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Animation helpers
// ─────────────────────────────────────────────────────────────────────────────
export const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_OUT } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: EASE_OUT } },
};
