import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Repeat, Target, TrendingUp } from 'lucide-react';
import { C, fadeInUp, scaleIn, staggerContainer } from './tokens';
import { GradientText, SectionBadge } from './shared';

const benefits = [
  { icon: <Target size={24} />, title: 'Focus on What Matters', desc: 'Priority-first design ensures you always work on the highest-impact tasks.', color: '#818CF8' },
  { icon: <TrendingUp size={24} />, title: 'Reduce Procrastination', desc: 'Streak mechanics and visual progress create powerful daily momentum.', color: '#F87171' },
  { icon: <BarChart2 size={24} />, title: 'Track Consistency', desc: 'Visualize your productivity data over days, weeks, and months at a glance.', color: '#34D399' },
  { icon: <Repeat size={24} />, title: 'Build Productive Habits', desc: 'Habit-forming features turn good intentions into lasting daily routines.', color: '#FBBF24' },
];

const BenefitsSection: React.FC = () => (
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
          <SectionBadge><TrendingUp size={13} /> Why TaskMaster</SectionBadge>
        </motion.div>
        <motion.h2
          variants={fadeInUp}
          style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.03em' }}
        >
          Built to Make You{' '}
          <GradientText>More Productive</GradientText>
        </motion.h2>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 20 }}
      >
        {benefits.map((b) => (
          <motion.div
            key={b.title}
            variants={scaleIn}
            whileHover={{ y: -6 }}
            style={{
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 16, padding: 28,
            }}
          >
            <div
              style={{
                width: 52, height: 52, borderRadius: 14,
                background: `${b.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: b.color, marginBottom: 16,
              }}
            >
              {b.icon}
            </div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 17, margin: '0 0 10px' }}>{b.title}</h3>
            <p style={{ color: C.textSecondary, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{b.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default BenefitsSection;
