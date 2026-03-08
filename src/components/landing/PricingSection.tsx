import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import Btn18 from '../ui/Btn18';
import { C, fadeInUp, scaleIn, staggerContainer } from './tokens';
import { GradientText, SectionBadge } from './shared';

interface PricingSectionProps {
  onGetStarted: () => void;
}

const freePlan = ['Unlimited tasks', 'Priority levels', 'Basic streak tracking', 'Mobile app'];
const proPlan = ['Everything in Free', 'Advanced analytics', 'AI task suggestions', 'Productivity insights', 'Cloud backup', 'Priority support'];

const PricingSection: React.FC<PricingSectionProps> = ({ onGetStarted }) => (
  <section id="pricing" className="pricing-section" style={{ background: C.bgDarker, padding: '96px 40px' }}>
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
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, alignItems: 'stretch' }}
        className="pricing-grid"
      >
        {/* Free */}
        <motion.div
          variants={scaleIn}
          className="pricing-card"
          style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 20, padding: 36, display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ marginBottom: 16 }}>
            <div className="price-label" style={{ color: C.textSecondary, fontSize: 14, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Free</div>
            <div className="price-val" style={{ fontSize: 48, fontWeight: 800, color: '#fff', lineHeight: 1 }}>₹0</div>
            <div className="price-sub" style={{ color: C.textSecondary, fontSize: 14, marginTop: 6 }}>Forever free</div>
          </div>
          <div style={{ flex: 1 }}>
            {freePlan.map((f) => (
              <div key={f} className="feature-row" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <CheckCircle size={14} color={C.green} />
                <span style={{ color: '#D1D5DB', fontSize: 13 }}>{f}</span>
              </div>
            ))}
          </div>
          <Btn18 onClick={onGetStarted} className="cta-btn" style={{ width: '100%', marginTop: 20, justifyContent: 'center', fontSize: 13, letterSpacing: '0.06em' }}>
            Get Started Free
          </Btn18>
        </motion.div>

        {/* Pro */}
        <motion.div
          variants={scaleIn}
          whileHover={{ boxShadow: '0 30px 80px rgba(99,102,241,0.35)' }}
          className="pricing-card"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(17,24,39,0.95) 100%)',
            border: `2px solid ${C.accent}`,
            borderRadius: 20, padding: 36,
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(99,102,241,0.2)',
            transition: 'box-shadow 0.3s',
            display: 'flex', flexDirection: 'column',
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
          <div style={{ marginBottom: 16 }}>
            <div className="price-label" style={{ color: '#818CF8', fontSize: 14, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pro</div>
            <div className="price-val" style={{ fontSize: 48, fontWeight: 800, color: '#fff', lineHeight: 1 }}>₹749</div>
            <div className="price-sub" style={{ color: C.textSecondary, fontSize: 14, marginTop: 6 }}>per month</div>
          </div>
          <div style={{ flex: 1 }}>
            {proPlan.map((f) => (
              <div key={f} className="feature-row" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <CheckCircle size={14} color={C.accent} />
                <span style={{ color: '#D1D5DB', fontSize: 13 }}>{f}</span>
              </div>
            ))}
          </div>
          <Btn18 onClick={onGetStarted} className="cta-btn" style={{ width: '100%', marginTop: 20, justifyContent: 'center', fontSize: 13, letterSpacing: '0.06em' }}>
            Start Pro Free <ArrowRight size={14} />
          </Btn18>
        </motion.div>
      </motion.div>
    </div>

    <style>{`
      @media (max-width: 640px) {
        .pricing-section { padding: 48px 12px !important; }
        .pricing-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; align-items: stretch !important; }
        .pricing-card { padding: 14px 10px !important; border-radius: 14px !important; }
        .price-val { font-size: 28px !important; }
        .price-label { font-size: 10px !important; margin-bottom: 4px !important; }
        .price-sub { font-size: 10px !important; margin-top: 3px !important; }
        .feature-row { gap: 5px !important; margin-bottom: 6px !important; }
        .feature-row span { font-size: 11px !important; }
        .feature-row svg { width: 11px !important; height: 11px !important; flex-shrink: 0; }
        .cta-btn { margin-top: 10px !important; font-size: 11px !important; border-radius: 8px !important; height: auto !important; padding: 8px 10px !important; }
        .pricing-card > div:nth-child(2) { margin-bottom: 10px !important; }
      }
    `}</style>
  </section>
);

export default PricingSection;
