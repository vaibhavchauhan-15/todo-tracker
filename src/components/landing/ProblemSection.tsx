import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Clock, Layers, Target, Zap } from 'lucide-react';
import { C, fadeInUp, scaleIn, staggerContainer } from './tokens';
import { GradientText, SectionBadge } from './shared';

const problems = [
  {
    icon: <Clock size={24} />,
    title: 'Forgetting Important Tasks',
    desc: 'People lose track of critical work and deadlines, causing stress and missed goals.',
    color: '#F87171',
  },
  {
    icon: <Layers size={24} />,
    title: 'Messy Notes & Lists',
    desc: 'Tasks scattered across apps, notebooks, and sticky notes create chaos.',
    color: '#FBBF24',
  },
  {
    icon: <Target size={24} />,
    title: 'No Prioritization',
    desc: "Without clear priorities it's impossible to know what truly matters right now.",
    color: '#FB923C',
  },
  {
    icon: <BarChart2 size={24} />,
    title: 'No Productivity Tracking',
    desc: "You can't improve what you can't measure. Most apps don't track your consistency.",
    color: '#C084FC',
  },
];

const ProblemSection: React.FC = () => (
  <section id="how-it-works" style={{ background: C.bgDarker, padding: '96px 40px' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        style={{ textAlign: 'center', marginBottom: 60 }}
      >
        <motion.div variants={fadeInUp}>
          <SectionBadge><Zap size={13} /> The Problem</SectionBadge>
        </motion.div>
        <motion.h2
          variants={fadeInUp}
          style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, color: '#fff', margin: '0 0 16px', letterSpacing: '-0.03em' }}
        >
          Why Most <GradientText>Todo Apps Fail</GradientText>
        </motion.h2>
        <motion.p variants={fadeInUp} style={{ color: C.textSecondary, fontSize: 18, maxWidth: 560, margin: '0 auto' }}>
          Traditional productivity tools leave you overwhelmed. TaskMaster was built to solve these real problems.
        </motion.p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}
      >
        {problems.map((p) => (
          <motion.div
            key={p.title}
            variants={scaleIn}
            whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
            style={{
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 16, padding: 28,
              transition: 'box-shadow 0.3s',
            }}
          >
            <div
              style={{
                width: 52, height: 52, borderRadius: 14,
                background: `${p.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: p.color, marginBottom: 18,
              }}
            >
              {p.icon}
            </div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 17, margin: '0 0 10px' }}>{p.title}</h3>
            <p style={{ color: C.textSecondary, fontSize: 14, lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default ProblemSection;
