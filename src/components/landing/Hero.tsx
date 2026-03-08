import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, ChevronDown, Play, Sparkles, Star, Users } from 'lucide-react';
import GlowButton from '../ui/GlowButton';
import { C, fadeInUp, staggerContainer } from './tokens';
import { GradientText, SectionBadge, SecondaryButton } from './shared';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Explicit 30fps-friendly playback rate (1× = native fps)
    video.playbackRate = 1.0;

    // Pause when tab/app goes to background to free GPU resources
    const handleVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {/* autoplay policy – silently ignore */});
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Pause when scrolled off-screen, resume when back in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(video);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
    };
  }, []);

  return (
  <section
    className="hero-section"
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
    {/* Full-bleed background video — GPU-composited for smooth 30fps on mobile */}
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      // @ts-ignore – non-standard but widely supported on iOS/Android
      disableRemotePlayback
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center',
        zIndex: 0,
        // Force GPU compositing layer – eliminates main-thread repaint jank
        transform: 'translateZ(0)',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Mobile-first: load a lighter version when available */}
      <source src="/video/hero-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
      <source src="/video/hero.mp4" type="video/mp4" />
    </video>

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

      <motion.div variants={fadeInUp} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }} className="hero-btns">
        <GlowButton onClick={onGetStarted} style={{ fontSize: 17, height: 52, padding: '0 36px', gap: 10 }}>
          Get Started Free <ArrowRight size={18} />
        </GlowButton>
        <SecondaryButton onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
          <Play size={16} /> View Demo
        </SecondaryButton>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        className="hero-proof"
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

    {/* Scroll indicator */}
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', bottom: 28, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        color: 'rgba(255,255,255,0.45)', pointerEvents: 'none',
      }}
    >
      <span style={{ fontSize: 10, letterSpacing: '0.12em', fontWeight: 600 }}>SCROLL</span>
      <ChevronDown size={18} />
    </motion.div>

    <style>{`
      @media (max-width: 640px) {
        .hero-section { padding: 88px 20px 60px !important; }
        .hero-btns { gap: 8px !important; flex-wrap: nowrap !important; }
        .hero-btns button, .hero-btns a, .hero-btns > div {
          font-size: 13px !important;
          height: 40px !important;
          padding: 0 14px !important;
          gap: 5px !important;
        }
        .hero-proof { gap: 14px !important; flex-wrap: wrap !important; }
        .hero-proof > div { font-size: 12px !important; }
      }
    `}</style>
  </section>
  );
};

export default Hero;
