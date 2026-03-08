import React from 'react';
import { motion } from 'framer-motion';
import { Flame, ListTodo, Target, Zap } from 'lucide-react';
import { C, fadeInUp, staggerContainer } from './tokens';
import { GradientText, SectionBadge } from './shared';

const steps = [
  {
    step: '01',
    icon: <ListTodo size={26} />,
    title: 'Create Tasks',
    desc: 'Add tasks in seconds. Set priorities, categories, and due dates with a beautiful minimal interface.',
  },
  {
    step: '02',
    icon: <Target size={26} />,
    title: 'Organize by Priority & Category',
    desc: 'Sort your work into Daily, Weekly, and Monthly goals. Color-coded priorities keep focus sharp.',
  },
  {
    step: '03',
    icon: <Flame size={26} />,
    title: 'Stay Consistent with Streak Tracking',
    desc: 'Build powerful habits by logging completions daily. Watch your streak grow 🔥 and momentum build.',
  },
];

const HowItWorks: React.FC = () => (
  <section id="how-it-works" style={{ background: C.bg, padding: '96px 40px' }}>
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        style={{ textAlign: 'center', marginBottom: 72 }}
      >
        <motion.div variants={fadeInUp}>
          <SectionBadge><Zap size={13} /> Simple Process</SectionBadge>
        </motion.div>
        <motion.h2
          variants={fadeInUp}
          style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.03em' }}
        >
          How <GradientText>TaskMaster Works</GradientText>
        </motion.h2>
      </motion.div>

      <div style={{ position: 'relative' }}>
        {/* Connecting line */}
        <div
          style={{
            position: 'absolute', top: 36,
            left: 'calc(16.66% + 36px)', right: 'calc(16.66% + 36px)',
            height: 2,
            background: `linear-gradient(90deg, ${C.accent}, ${C.green})`,
            opacity: 0.3, zIndex: 0,
          }}
          className="steps-line"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32, position: 'relative', zIndex: 1 }}
          className="steps-grid"
        >
          {steps.map((s) => (
            <motion.div
              key={s.step}
              variants={fadeInUp}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20 }}
              className="step-item"
            >
              <motion.div
                whileHover={{ scale: 1.1, boxShadow: `0 0 40px ${C.accentGlow}` }}
                style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${C.accent}22, ${C.accentDark}22)`,
                  border: `2px solid ${C.borderAccent}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: C.accent, flexShrink: 0, transition: 'box-shadow 0.3s',
                }}
                className="step-circle"
              >
                {s.icon}
              </motion.div>
              <div>
                <div style={{ color: C.accent, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }} className="step-label">
                  STEP {s.step}
                </div>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 18, margin: '0 0 10px' }} className="step-title">{s.title}</h3>
                <p style={{ color: C.textSecondary, fontSize: 14, lineHeight: 1.65, margin: 0 }} className="step-desc">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>

    <style>{`
      @media (max-width: 640px) {
        .steps-grid { gap: 4px !important; }
        .steps-line { top: 24px !important; }
        .step-circle { width: 48px !important; height: 48px !important; }
        .step-label { font-size: 9px !important; margin-bottom: 3px !important; }
        .step-title { font-size: 11px !important; margin-bottom: 0 !important; }
        .step-desc { display: none !important; }
        .step-item { gap: 10px !important; }
      }
    `}</style>
  </section>
);

export default HowItWorks;
