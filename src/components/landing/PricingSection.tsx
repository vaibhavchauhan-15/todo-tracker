import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import GlowButton from '../ui/GlowButton';
import { C, fadeInUp, scaleIn, staggerContainer } from './tokens';
import { GradientText, PrimaryButton, SectionBadge } from './shared';

interface PricingSectionProps {
  onGetStarted: () => void;
}

const freePlan = ['Unlimited tasks', 'Priority levels', 'Basic streak tracking', 'Mobile app'];
const proPlan = ['Everything in Free', 'Advanced analytics', 'AI task suggestions', 'Productivity insights', 'Cloud backup', 'Priority support'];

const PricingSection: React.FC<PricingSectionProps> = ({ onGetStarted }) => (
  <section id="pricing" style={{ background: C.bgDarker, padding: '96px 40px' }}>
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 60 }}
      >
        <motion.div variants={fadeInUp}>
          <SectionBadge><Sparkles size={13} /> Pricing</SectionBadge>
        </motion.div>
        <motion.h2
          variants={fadeInUp}
          style={{ fontSize: 'clamp(28px,4vw,46px)', fontWeight: 800, color: '#fff', margin: '0 0 16px', letterSpacing: '-0.03em' }}
        >
          Simple, <GradientText>Transparent Pricing</GradientText>
        </motion.h2>
        <motion.p variants={fadeInUp} style={{ color: C.textSecondary, fontSize: 18, margin: 0 }}>
          Start free. Upgrade when you need more power.
        </motion.p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, alignItems: 'start' }}
      >
        {/* Free */}
        <motion.div
          variants={scaleIn}
          style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, padding: 36 }}
        >
          <div style={{ marginBottom: 24 }}>
            <div style={{ color: C.textSecondary, fontSize: 14, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Free</div>
            <div style={{ fontSize: 48, fontWeight: 800, color: '#fff', lineHeight: 1 }}>$0</div>
            <div style={{ color: C.textSecondary, fontSize: 14, marginTop: 6 }}>Forever free</div>
          </div>
          {freePlan.map((f) => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <CheckCircle size={16} color={C.green} />
              <span style={{ color: '#D1D5DB', fontSize: 14 }}>{f}</span>
            </div>
          ))}
          <GlowButton onClick={onGetStarted} style={{ width: '100%', marginTop: 24 }}>
            Get Started Free
          </GlowButton>
        </motion.div>

        {/* Pro */}
        <motion.div
          variants={scaleIn}
          whileHover={{ boxShadow: '0 30px 80px rgba(99,102,241,0.35)' }}
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(17,24,39,0.95) 100%)',
            border: `2px solid ${C.accent}`,
            borderRadius: 20, padding: 36,
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(99,102,241,0.2)',
            transition: 'box-shadow 0.3s',
          }}
        >
          <div
            style={{
              position: 'absolute', top: -60, right: -60,
              width: 180, height: 180, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute', top: 16, right: 16,
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
              color: '#fff', fontSize: 11, fontWeight: 700,
              padding: '4px 12px', borderRadius: 100, letterSpacing: '0.08em',
            }}
          >
            POPULAR
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ color: '#818CF8', fontSize: 14, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pro</div>
            <div style={{ fontSize: 48, fontWeight: 800, color: '#fff', lineHeight: 1 }}>$9</div>
            <div style={{ color: C.textSecondary, fontSize: 14, marginTop: 6 }}>per month</div>
          </div>
          {proPlan.map((f) => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <CheckCircle size={16} color={C.accent} />
              <span style={{ color: '#D1D5DB', fontSize: 14 }}>{f}</span>
            </div>
          ))}
          <PrimaryButton onClick={onGetStarted} style={{ width: '100%', justifyContent: 'center', marginTop: 24 }}>
            Start Pro Free <ArrowRight size={16} />
          </PrimaryButton>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default PricingSection;
