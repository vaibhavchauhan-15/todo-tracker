import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { C, fadeInUp, scaleIn, staggerContainer } from './tokens';
import { GradientText, SectionBadge } from './shared';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    avatar: 'SC',
    text: 'TaskMaster completely transformed how I manage my daily work. The streak tracking keeps me accountable every single day.',
    color: '#818CF8',
  },
  {
    name: 'Marcus Williams',
    role: 'Software Engineer',
    avatar: 'MW',
    text: 'The priority system is exactly what I needed. I never miss important deadlines anymore and my productivity has doubled.',
    color: '#34D399',
  },
  {
    name: 'Priya Patel',
    role: 'Startup Founder',
    avatar: 'PP',
    text: "Clean, fast, beautiful. It's the only todo app I've stuck with for more than a week. My whole team uses it now.",
    color: '#FB923C',
  },
];

const stats = [
  { value: '10,000+', label: 'Tasks Managed' },
  { value: '5,000+', label: 'Productive Users' },
  { value: '98%', label: 'User Satisfaction' },
];

const SocialProof: React.FC = () => (
  <section style={{ background: C.bg, padding: '96px 40px' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap', marginBottom: 80 }}
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeInUp} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(36px,5vw,52px)', fontWeight: 800, lineHeight: 1 }}>
              <GradientText>{s.value}</GradientText>
            </div>
            <div style={{ color: C.textSecondary, fontSize: 15, marginTop: 8, fontWeight: 500 }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Header */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 48 }}
      >
        <motion.div variants={fadeInUp}>
          <SectionBadge><Star size={13} /> Testimonials</SectionBadge>
        </motion.div>
        <motion.h2
          variants={fadeInUp}
          style={{ fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.03em' }}
        >
          Loved by <GradientText>Productive People</GradientText>
        </motion.h2>
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}
      >
        {testimonials.map((t) => (
          <motion.div
            key={t.name}
            variants={scaleIn}
            whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
            style={{
              background: 'rgba(17,24,39,0.8)',
              border: `1px solid ${C.border}`,
              borderRadius: 16, padding: 28,
              backdropFilter: 'blur(20px)',
            }}
          >
            <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} fill="#FBBF24" color="#FBBF24" />
              ))}
            </div>
            <p style={{ color: '#E5E7EB', fontSize: 15, lineHeight: 1.7, margin: '0 0 20px', fontStyle: 'italic' }}>
              "{t.text}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: `${t.color}22`, border: `2px solid ${t.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: t.color, fontWeight: 700, fontSize: 13,
                }}
              >
                {t.avatar}
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                <div style={{ color: C.textSecondary, fontSize: 12 }}>{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default SocialProof;
