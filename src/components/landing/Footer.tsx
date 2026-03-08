import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { C } from './tokens';
import { GradientText } from './shared';

interface FooterProps {
  onLogin: () => void;
  onGetStarted: () => void;
}

const productLinks: { label: string; href: string }[] = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
];

const socialIcons = [
  { icon: <Twitter size={16} />, href: 'https://x.com/VaibhavCh_15', label: 'Twitter' },
  { icon: <Github size={16} />, href: 'https://github.com/vaibhavchauhan-15/todo-tracker', label: 'GitHub' },
  { icon: <Linkedin size={16} />, href: 'https://www.linkedin.com/in/vaibhavchauhan15/', label: 'LinkedIn' },
];

const FooterLink: React.FC<{ label: string; href: string }> = ({ label, href }) => (
  <div style={{ marginBottom: 10 }}>
    <a
      href={href}
      style={{ color: C.textSecondary, fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
      onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = '#fff')}
      onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = C.textSecondary)}
    >
      {label}
    </a>
  </div>
);

const Footer: React.FC<FooterProps> = () => (
  <footer style={{ background: C.bgDarker, borderTop: `1px solid ${C.border}`, padding: '64px 40px 32px' }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div
        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40, marginBottom: 56 }}
        className="footer-grid"
      >
        {/* Brand */}
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <img src="/logo.png" alt="TaskMaster" style={{ width: 32, height: 32, borderRadius: 9, objectFit: 'contain' }} />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>
              Task<GradientText>Master</GradientText>
            </span>
          </div>
          <p style={{ color: C.textSecondary, fontSize: 14, lineHeight: 1.7, margin: '0 0 20px', maxWidth: 260 }}>
            AI-powered task management for modern productivity. Build habits, track streaks, and get things done.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {socialIcons.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: C.textSecondary, textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = C.accent;
                  (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = C.border;
                  (e.currentTarget as HTMLAnchorElement).style.color = C.textSecondary;
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Product column */}
        <div className="footer-col">
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 16, letterSpacing: '0.04em' }} className="footer-col-title">Product</div>
          {productLinks.map((l) => <FooterLink key={l.label} label={l.label} href={l.href} />)}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="footer-bottom"
        style={{
          borderTop: `1px solid ${C.border}`, paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}
      >
        <span style={{ color: C.textSecondary, fontSize: 13 }}>© 2026 TaskMaster by <a href="https://www.linkedin.com/in/vaibhavchauhan15/" target="_blank" rel="noopener noreferrer" style={{ color: '#818CF8', textDecoration: 'none' }}>Vaibhav Chauhan</a>. All rights reserved.</span>
        <span style={{ color: C.textSecondary, fontSize: 13 }}>Made with ❤️ in India</span>
      </div>
    </div>

    <style>{`
      @media (max-width: 640px) {
        footer { padding: 40px 16px 24px !important; }
        .footer-grid {
          grid-template-columns: 1fr 1fr !important;
          gap: 24px 12px !important;
        }
        .footer-brand { grid-column: 1 / -1; }
        .footer-brand p { display: none; }
        .footer-brand > div:last-child { margin-top: 8px; }
        .footer-col-title { font-size: 12px !important; margin-bottom: 10px !important; }
        .footer-col a { font-size: 12px !important; }
        .footer-bottom { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
        .footer-bottom span { font-size: 11px !important; }
      }
    `}</style>
  </footer>
);

export default Footer;
