import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, LayoutDashboard } from 'lucide-react';
import { C, EASE_OUT, fadeInUp, staggerContainer } from './tokens';
import { GradientText, SectionBadge } from './shared';

const taskData = [
  { label: 'Design landing page', priority: 'high', cat: 'Daily', done: false },
  { label: 'Review pull requests', priority: 'medium', cat: 'Daily', done: true },
  { label: 'Write weekly report', priority: 'high', cat: 'Weekly', done: false },
  { label: 'Update documentation', priority: 'low', cat: 'Monthly', done: false },
];

const priorityColor: Record<string, string> = { high: '#F87171', medium: '#FBBF24', low: '#34D399' };

const sidebarItems = ['All Tasks', 'Daily', 'Weekly', 'Monthly', 'Streak'];

const ProductPreview: React.FC = () => (
  <section style={{ background: C.bgDarker, padding: '96px 40px' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        style={{ textAlign: 'center', marginBottom: 60 }}
      >
        <motion.div variants={fadeInUp}>
          <SectionBadge><LayoutDashboard size={13} /> App Preview</SectionBadge>
        </motion.div>
        <motion.h2
          variants={fadeInUp}
          style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, color: '#fff', margin: '0 0 16px', letterSpacing: '-0.03em' }}
        >
          See TaskMaster <GradientText>in Action</GradientText>
        </motion.h2>
      </motion.div>

      {/* App shell */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
        style={{
          background: C.bgCard,
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 60px 120px rgba(0,0,0,0.7)',
          display: 'flex', minHeight: 460,
        }}
        className="preview-shell"
      >
        {/* Sidebar */}
        <div
          style={{
            width: 200, background: '#0D1220',
            borderRight: `1px solid ${C.border}`,
            padding: 20, display: 'flex', flexDirection: 'column',
            gap: 6, flexShrink: 0,
          }}
          className="preview-sidebar"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <img src="/logo.png" alt="TaskMaster" style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'contain' }} />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>TaskMaster</span>
          </div>

          {sidebarItems.map((item, i) => (
            <div
              key={item}
              style={{
                padding: '8px 12px', borderRadius: 8,
                background: i === 0 ? 'rgba(99,102,241,0.15)' : 'none',
                color: i === 0 ? '#818CF8' : C.textSecondary,
                fontSize: 13, fontWeight: i === 0 ? 600 : 400,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              {item === 'Streak' ? '🔥' : <CheckCircle size={13} />} {item}
            </div>
          ))}

          <div style={{ marginTop: 'auto', padding: 12, borderRadius: 10, background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>🔥</div>
            <div style={{ color: '#FB923C', fontSize: 13, fontWeight: 700 }}>7 Day Streak!</div>
            <div style={{ color: C.textSecondary, fontSize: 11 }}>Keep it up!</div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: 28, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 20, margin: '0 0 4px' }}>All Tasks</h3>
              <span style={{ color: C.textSecondary, fontSize: 13 }}>4 tasks today</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}
              style={{
                background: `linear-gradient(135deg,${C.accent},${C.accentDark})`,
                border: 'none', color: '#fff', borderRadius: 10,
                padding: '8px 18px', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              + Add Task
            </motion.button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {taskData.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{ x: 4, background: 'rgba(255,255,255,0.05)' }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${priorityColor[t.priority]}`,
                  borderRadius: 10, padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  transition: 'background 0.2s',
                }}
              >
                <div
                  style={{
                    width: 18, height: 18, borderRadius: 5,
                    border: `2px solid ${t.done ? priorityColor[t.priority] : C.border}`,
                    background: t.done ? `${priorityColor[t.priority]}30` : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {t.done && <CheckCircle size={10} color={priorityColor[t.priority]} />}
                </div>
                <span style={{ color: t.done ? C.textSecondary : '#fff', fontSize: 14, fontWeight: 500, flex: 1, textDecoration: t.done ? 'line-through' : 'none' }}>
                  {t.label}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: priorityColor[t.priority], background: `${priorityColor[t.priority]}18`, padding: '3px 9px', borderRadius: 6 }}>
                  {t.priority}
                </span>
                <span style={{ fontSize: 11, color: C.textSecondary, background: 'rgba(255,255,255,0.05)', padding: '3px 9px', borderRadius: 6 }}>
                  {t.cat}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>

    <style>{`
      @media (max-width: 640px) {
        .preview-sidebar { display: none !important; }
        .preview-shell { min-height: 360px !important; }
      }
    `}</style>
  </section>
);

export default ProductPreview;
