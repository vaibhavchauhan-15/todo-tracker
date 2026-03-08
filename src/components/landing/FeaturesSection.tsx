import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Flame, ListTodo, Repeat, Sparkles, Target, Zap } from 'lucide-react';
import { C, fadeInUp, scaleIn, staggerContainer } from './tokens';
import { GradientText, SectionBadge } from './shared';

const features = [
  { icon: <ListTodo size={24} />, title: 'Smart Task Management', desc: 'Organize tasks effortlessly with drag-and-drop, labels, and smart sorting.', color: '#818CF8' },
  { icon: <Target size={24} />, title: 'Priority Levels', desc: 'Color-coded priorities keep your most important work front and center.', color: '#F87171' },
  { icon: <Flame size={24} />, title: 'Daily Streak Tracking 🔥', desc: 'Build consistent habits with streak tracking that motivates you every day.', color: '#FB923C' },
  { icon: <Repeat size={24} />, title: 'Category Based Tasks', desc: 'Sort tasks into Daily, Weekly, Monthly, and Yearly goals seamlessly.', color: '#34D399' },
  { icon: <Cloud size={24} />, title: 'Cloud Sync', desc: 'Access and sync your tasks across all your devices in real time.', color: '#60A5FA' },
  { icon: <Zap size={24} />, title: 'Fast Minimal UI', desc: 'Zero-clutter interface designed for deep focus and maximum productivity.', color: '#FBBF24' },
];

const FeaturesSection: React.FC = () => (
  <section id="features" className="features-section" style={{ background: C.bg, padding: '96px 40px' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        style={{ textAlign: 'center', marginBottom: 60 }}
      >
        <motion.div variants={fadeInUp}>
          <SectionBadge><Sparkles size={13} /> Features</SectionBadge>
        </motion.div>
        <motion.h2
          variants={fadeInUp}
          style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, color: '#fff', margin: '0 0 16px', letterSpacing: '-0.03em' }}
        >
          Everything You Need to{' '}
          <GradientText>Stay Productive</GradientText>
        </motion.h2>
        <motion.p variants={fadeInUp} style={{ color: C.textSecondary, fontSize: 18, maxWidth: 560, margin: '0 auto' }}>
          TaskMaster brings together the most powerful productivity tools in one beautiful, minimal interface.
        </motion.p>
      </motion.div>

      {/* Two-column: 6 cards LEFT | video RIGHT */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'stretch' }}
        className="features-layout"
      >
        {/* LEFT — 2×3 grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: 'repeat(3, 1fr)',
            gap: 14,
          }}
          className="feature-cards-grid"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeInUp}
              whileHover={{ y: -4, boxShadow: `0 0 0 2px ${f.color}55, 0 16px 48px rgba(0,0,0,0.4)` }}
              style={{
                background: 'rgba(17,24,39,0.85)',
                border: `1px solid ${C.border}`,
                borderRadius: 14, padding: '16px',
                backdropFilter: 'blur(20px)',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                cursor: 'default',
                display: 'flex', flexDirection: 'column',
                aspectRatio: '1 / 1',
                overflow: 'hidden',
              }}
              className="feature-card"
            >
              <div
                style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: `${f.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.color, marginBottom: 12, flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: '0 0 6px' }}>{f.title}</h3>
              <p style={{ color: C.textSecondary, fontSize: 12, lineHeight: 1.55, margin: 0 }}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* RIGHT — video */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="features-video-wrap"
          style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}
        >
          <div
            style={{
              position: 'absolute', inset: -2, borderRadius: 22,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.6), rgba(34,197,94,0.4))',
              zIndex: 0,
            }}
          />
          <div
            className="features-video-inner"
            style={{
              position: 'relative', zIndex: 1, flex: 1,
              borderRadius: 20, overflow: 'hidden',
              background: C.bgCard,
              boxShadow: '0 24px 70px rgba(0,0,0,0.6), 0 0 50px rgba(99,102,241,0.18)',
              minHeight: 0,
            }}
          >
            <video
              src="/video/feature.mp4"
              autoPlay muted loop playsInline
              preload="auto"
              disablePictureInPicture
              style={{
                width: '100%', height: '100%',
                display: 'block', objectFit: 'cover',
                position: 'absolute', inset: 0,
                transform: 'translateZ(0)',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute', inset: -40, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
              filter: 'blur(30px)', zIndex: -1, pointerEvents: 'none',
            }}
          />
        </motion.div>
      </div>
    </div>

    <style>{`
      @media (max-width: 900px) {
        .features-layout { grid-template-columns: 1fr !important; }
        .features-video-wrap { order: -1; }
        /* Square video on tablet/mobile */
        .features-video-wrap { aspect-ratio: 1 / 1; width: 100%; }
        .features-video-inner { position: absolute !important; inset: 0 !important; flex: unset !important; border-radius: 20px; }
        .features-video-wrap > div:first-child { border-radius: 22px; }
      }
      @media (max-width: 640px) {
        .features-section { padding: 56px 16px !important; }
        .features-layout { gap: 14px !important; }
        /* Strictly square on small phones */
        .features-video-wrap { aspect-ratio: 1 / 1 !important; width: 100% !important; }
        .feature-cards-grid { grid-template-columns: 1fr 1fr !important; }
        .feature-card { padding: 12px !important; }
        .feature-card h3 { font-size: 11px !important; margin-bottom: 2px !important; }
        .feature-card p { font-size: 10px !important; }
        .feature-card > div:first-child { width: 30px !important; height: 30px !important; border-radius: 8px !important; margin-bottom: 8px !important; }
      }
      @keyframes feature-border-spin {
        0%   { box-shadow: 2px 0 12px 0 var(--fc, rgba(99,102,241,0.5)), 0 0 0 1px rgba(99,102,241,0.15); }
        25%  { box-shadow: 0 2px 12px 0 var(--fc, rgba(99,102,241,0.5)), 0 0 0 1px rgba(99,102,241,0.15); }
        50%  { box-shadow: -2px 0 12px 0 var(--fc, rgba(99,102,241,0.5)), 0 0 0 1px rgba(99,102,241,0.15); }
        75%  { box-shadow: 0 -2px 12px 0 var(--fc, rgba(99,102,241,0.5)), 0 0 0 1px rgba(99,102,241,0.15); }
        100% { box-shadow: 2px 0 12px 0 var(--fc, rgba(99,102,241,0.5)), 0 0 0 1px rgba(99,102,241,0.15); }
      }
      .feature-card {
        animation: feature-border-spin 4s linear infinite;
      }
    `}</style>
  </section>
);

export default FeaturesSection;
