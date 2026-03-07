import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import { C, fadeIn, fadeInUp, staggerContainer } from './tokens';
import { GradientText, PrimaryButton, SectionBadge } from './shared';

interface CTASectionProps {
  onGetStarted: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => (
  <section
    style={{
      background: C.bgDarker,
      padding: '96px 40px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Animated blobs */}
    <motion.div
      animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute', top: '50%', left: '20%',
        transform: 'translate(-50%,-50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }}
    />
    <motion.div
      animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      style={{
        position: 'absolute', top: '50%', right: '20%',
        transform: 'translate(50%,-50%)',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,197,94,0.3) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }}
    />

    <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div variants={fadeInUp}>
          <SectionBadge><Flame size={13} /> Get Started Today</SectionBadge>
        </motion.div>
        <motion.h2
          variants={fadeInUp}
          style={{
            fontSize: 'clamp(32px,5vw,56px)', fontWeight: 800,
            color: '#fff', margin: '0 0 20px', letterSpacing: '-0.03em', lineHeight: 1.1,
          }}
        >
          Start Organizing{' '}
          <GradientText>Your Life Today</GradientText>
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          style={{ color: C.textSecondary, fontSize: 18, lineHeight: 1.7, margin: '0 0 40px' }}
        >
          Join thousands of people building productive habits with TaskMaster. It's free and takes 30 seconds to set up.
        </motion.p>
        <motion.div variants={fadeInUp} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <PrimaryButton onClick={onGetStarted} large>
            Create Free Account <ArrowRight size={18} />
          </PrimaryButton>
        </motion.div>
        <motion.div variants={fadeIn} style={{ marginTop: 28, color: C.textSecondary, fontSize: 13 }}>
          No credit card required · Free forever plan · Cancel anytime
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
