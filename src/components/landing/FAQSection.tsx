import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lightbulb } from 'lucide-react';
import { C, fadeInUp, staggerContainer } from './tokens';
import { GradientText, SectionBadge } from './shared';

const faqData = [
  {
    q: 'Is TaskMaster free?',
    a: 'Yes! TaskMaster offers a generous free plan with unlimited tasks, priority levels, and basic streak tracking. No credit card required.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. All data is encrypted in transit and at rest. We use industry-standard security practices and your data is never sold to third parties.',
  },
  {
    q: 'Can I use it on mobile?',
    a: 'Yes! TaskMaster is fully responsive and works seamlessly on phones and tablets. A native mobile app is also in development.',
  },
  {
    q: 'Do tasks sync across devices?',
    a: 'With the Pro plan, your tasks sync instantly across all your devices in real time. Free plan users can access their data from any browser.',
  },
];

const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" style={{ background: C.bg, padding: '96px 40px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <motion.div variants={fadeInUp}>
            <SectionBadge><Lightbulb size={13} /> FAQ</SectionBadge>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.03em' }}
          >
            Frequently Asked <GradientText>Questions</GradientText>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          {faqData.map((item, i) => (
            <motion.div
              key={item.q}
              variants={fadeInUp}
              style={{
                background: C.bgCard,
                border: `1px solid ${openIdx === i ? C.borderAccent : C.border}`,
                borderRadius: 14, overflow: 'hidden',
                transition: 'border-color 0.3s',
              }}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{
                  width: '100%', background: 'none', border: 'none',
                  padding: '20px 24px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  color: '#fff', fontSize: 16, fontWeight: 600,
                  cursor: 'pointer', textAlign: 'left', gap: 16,
                }}
              >
                <span>{item.q}</span>
                <motion.div
                  animate={{ rotate: openIdx === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ flexShrink: 0, color: openIdx === i ? C.accent : C.textSecondary }}
                >
                  <ChevronDown size={18} />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIdx === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] as [number, number, number, number] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        padding: '16px 24px 20px',
                        color: C.textSecondary, fontSize: 15, lineHeight: 1.7,
                        borderTop: `1px solid ${C.border}`,
                      }}
                    >
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
