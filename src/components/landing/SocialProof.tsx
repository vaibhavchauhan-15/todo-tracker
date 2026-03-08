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
  <section className="social-proof-section" style={{ background: C.bg, padding: '96px 40px' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap', marginBottom: 80 }}
        className="stats-row"
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
      <div className="testimonials-wrapper">
        <div className="testimonials-track">
          {[...testimonials, ...testimonials].map((t, idx) => (
            <div
              key={`${t.name}-${idx}`}
              className="testimonial-card"
              style={{
                background: 'rgba(17,24,39,0.8)',
                border: `1px solid ${C.border}`,
                borderRadius: 14, padding: '18px 16px',
                backdropFilter: 'blur(20px)',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} fill="#FBBF24" color="#FBBF24" />
                ))}
              </div>
              <p style={{ color: '#E5E7EB', fontSize: 13, lineHeight: 1.6, margin: '0 0 14px', fontStyle: 'italic' }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: `${t.color}22`, border: `2px solid ${t.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: t.color, fontWeight: 700, fontSize: 12, flexShrink: 0,
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                  <div style={{ color: C.textSecondary, fontSize: 11 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <style>{`
      /* ── Desktop testimonials grid ── */
      .testimonials-wrapper {
        overflow: hidden;
      }
      .testimonials-track {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
      }
      .testimonial-card:nth-child(n+4) { display: none; }
      /* ── Mobile side-scroll auto-swipe ── */
      @media (max-width: 640px) {
        .social-proof-section { padding: 56px 16px !important; }
        .stats-row { gap: 20px !important; margin-bottom: 40px !important; flex-wrap: nowrap !important; justify-content: space-around !important; }
        .stats-row > div > div:first-child { font-size: 26px !important; }
        .stats-row > div > div:last-child { font-size: 11px !important; margin-top: 4px !important; }
        .testimonials-wrapper { overflow: hidden; }
        .testimonials-track {
          display: flex !important;
          gap: 14px !important;
          width: max-content;
          animation: testimonial-scroll 18s linear infinite;
        }
        .testimonials-track:hover { animation-play-state: paused; }
        .testimonial-card:nth-child(n+4) { display: block !important; }
        .testimonial-card {
          width: calc(100vw - 56px) !important;
          max-width: 280px;
          flex-shrink: 0;
        }
      }
      @keyframes testimonial-scroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
  </section>
);

export default SocialProof;
