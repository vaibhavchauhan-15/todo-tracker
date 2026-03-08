import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Flame, ListTodo, Repeat, Sparkles, Target, Zap } from 'lucide-react';
import { C, fadeInUp, scaleIn, staggerContainer } from './tokens';
import { GradientText, SectionBadge } from './shared';

const features = [
  { icon: <ListTodo size={18} />, title: 'Smart Task Management', desc: 'Organize tasks effortlessly with drag-and-drop, labels, and smart sorting.', color: '#818CF8' },
  { icon: <Target size={18} />, title: 'Priority Levels', desc: 'Color-coded priorities keep your most important work front and center.', color: '#F87171' },
  { icon: <Flame size={18} />, title: 'Daily Streak Tracking 🔥', desc: 'Build consistent habits with streak tracking that motivates you every day.', color: '#FB923C' },
  { icon: <Repeat size={18} />, title: 'Category Based Tasks', desc: 'Sort tasks into Daily, Weekly, Monthly, and Yearly goals seamlessly.', color: '#34D399' },
  { icon: <Cloud size={18} />, title: 'Cloud Sync', desc: 'Access and sync your tasks across all your devices in real time.', color: '#60A5FA' },
  { icon: <Zap size={18} />, title: 'Fast Minimal UI', desc: 'Zero-clutter interface designed for deep focus and maximum productivity.', color: '#FBBF24' },
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

      {/* Two-column: 6 cards LEFT | square video RIGHT — fixed 440px height */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 440px', gap: 20, alignItems: 'stretch', height: 440 }}
        className="features-layout"
      >
        {/* LEFT — 2 cols × 3 rows of small cards, fills the 440px height */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: 'repeat(3, 1fr)',
            gap: 12,
            height: '100%',
          }}
          className="feature-cards-grid"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeInUp}
              whileHover={{ y: -3, boxShadow: `0 0 0 2px ${f.color}55, 0 12px 36px rgba(0,0,0,0.4)` }}
              style={{
                background: 'rgba(17,24,39,0.85)',
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: '14px 16px',
                backdropFilter: 'blur(20px)',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                cursor: 'default',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                overflow: 'hidden',
              }}
              className="feature-card"
            >
              <div
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${f.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.color, marginBottom: 10, flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 13, margin: '0 0 5px', lineHeight: 1.3 }}>{f.title}</h3>
              <p style={{ color: C.textSecondary, fontSize: 11.5, lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* RIGHT — perfectly square video box (width = height = 440px) */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="features-video-wrap"
          style={{ position: 'relative', width: 440, height: 440, flexShrink: 0 }}
        >
          {/* gradient border glow */}
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
              position: 'absolute', inset: 0, zIndex: 1,
              borderRadius: 20, overflow: 'hidden',
              background: C.bgCard,
              boxShadow: '0 24px 70px rgba(0,0,0,0.6), 0 0 50px rgba(99,102,241,0.18)',
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
                transform: 'translateZ(0)',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
              }}
            />
          </div>
          {/* ambient glow */}
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
      @media (max-width: 960px) {
        .features-layout {
          grid-template-columns: 1fr !important;
          height: auto !important;
        }
        .features-video-wrap {
          order: -1;
          width: 100% !important;
          height: auto !important;
          aspect-ratio: 1 / 1;
        }
        .features-video-inner { border-radius: 20px; }
        .feature-cards-grid { height: auto !important; }
      }
      @media (max-width: 640px) {
        .features-section { padding: 56px 16px !important; }
        .features-layout { gap: 14px !important; }
        .feature-cards-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
        .feature-card { padding: 10px 12px !important; }
        .feature-card h3 { font-size: 11px !important; margin-bottom: 3px !important; }
        .feature-card p { font-size: 10px !important; }
        .feature-card > div:first-child { width: 28px !important; height: 28px !important; border-radius: 8px !important; margin-bottom: 8px !important; }
      }
      @keyframes feature-border-spin {
        0%   { box-shadow: 2px 0 12px 0 rgba(99,102,241,0.4), 0 0 0 1px rgba(99,102,241,0.12); }
        25%  { box-shadow: 0 2px 12px 0 rgba(99,102,241,0.4), 0 0 0 1px rgba(99,102,241,0.12); }
        50%  { box-shadow: -2px 0 12px 0 rgba(99,102,241,0.4), 0 0 0 1px rgba(99,102,241,0.12); }
        75%  { box-shadow: 0 -2px 12px 0 rgba(99,102,241,0.4), 0 0 0 1px rgba(99,102,241,0.12); }
        100% { box-shadow: 2px 0 12px 0 rgba(99,102,241,0.4), 0 0 0 1px rgba(99,102,241,0.12); }
      }
      .feature-card {
        animation: feature-border-spin 4s linear infinite;
      }
    `}</style>
  </section>
);

export default FeaturesSection;
