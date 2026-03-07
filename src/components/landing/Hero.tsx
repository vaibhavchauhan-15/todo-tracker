import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Play, Sparkles, Star, Users } from 'lucide-react';
import GlowButton from '../ui/GlowButton';
import { C, fadeInUp, staggerContainer } from './tokens';
import { GradientText, SectionBadge, SecondaryButton } from './shared';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => (
  <section
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '120px 40px 80px',
    }}
  >
    {/* Full-bleed background video */}
    <video
      src="/video/hero.mp4"
      autoPlay
      loop
      muted
      playsInline
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center',
        zIndex: 0,
      }}
    />

    {/* Dark overlay for legibility */}
    <div
      style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(11,15,25,0.70) 0%, rgba(11,15,25,0.48) 50%, rgba(11,15,25,0.85) 100%)',
        zIndex: 1,
      }}
    />

    {/* Indigo glow pulse */}
    <motion.div
      animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.28, 0.15] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translateX(-50%)',
        width: 700, height: 380, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.38) 0%, transparent 70%)',
        filter: 'blur(70px)', pointerEvents: 'none', zIndex: 2,
      }}
    />

    {/* Content */}
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      style={{
        position: 'relative', zIndex: 3,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center',
        gap: 28, maxWidth: 800, width: '100%',
      }}
    >
      <motion.div variants={fadeInUp}>
        <SectionBadge><Sparkles size={13} /> AI-Powered Productivity</SectionBadge>
      </motion.div>

      <motion.h1
        variants={fadeInUp}
        style={{
          fontSize: 'clamp(38px, 6vw, 68px)', fontWeight: 800,
          lineHeight: 1.08, color: '#FFFFFF', margin: 0,
          letterSpacing: '-0.03em', textShadow: '0 2px 40px rgba(0,0,0,0.65)',
        }}
      >
        AI-Powered Task Management for{' '}
        <GradientText>Modern Productivity</GradientText>
      </motion.h1>

      <motion.p
        variants={fadeInUp}
        style={{
          fontSize: 19, color: 'rgba(255,255,255,0.82)',
          lineHeight: 1.7, margin: 0, maxWidth: 560,
          textShadow: '0 1px 20px rgba(0,0,0,0.55)',
        }}
      >
        Organize tasks, track streaks, and build unstoppable productivity habits with TaskMaster.
      </motion.p>

      <motion.div variants={fadeInUp} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        <GlowButton onClick={onGetStarted} style={{ fontSize: 17, height: 52, padding: '0 36px', gap: 10 }}>
          Get Started Free <ArrowRight size={18} />
        </GlowButton>
        <SecondaryButton onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
          <Play size={16} /> View Demo
        </SecondaryButton>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}
      >
        {[
          { icon: <Users size={15} />, label: '5,000+ users' },
          { icon: <Star size={15} />, label: '98% satisfaction' },
          { icon: <CheckCircle size={15} />, label: 'Free forever plan' },
        ].map(({ icon, label }) => (
          <div
            key={label}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: 500,
            }}
          >
            <span style={{ color: C.green }}>{icon}</span>
            {label}
          </div>
        ))}
      </motion.div>
    </motion.div>
  </section>
);

export default Hero;
