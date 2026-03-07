import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { C } from './tokens';
import { GradientText } from './shared';

interface FooterProps {
  onLogin: () => void;
  onGetStarted: () => void;
}

const productLinks = ['Features', 'Pricing', 'Updates', 'Changelog'];
const resourceLinks = ['Blog', 'Documentation', 'Help Center', 'Community'];
const companyLinks = ['About', 'Privacy', 'Terms', 'Contact'];
const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy'];

const socialIcons = [
  { icon: <Twitter size={16} />, href: '#' },
  { icon: <Github size={16} />, href: '#' },
  { icon: <Linkedin size={16} />, href: '#' },
];

const FooterLink: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ marginBottom: 10 }}>
    <a
      href="#"
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
        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 56 }}
        className="footer-grid"
      >
        {/* Brand */}
        <div>
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
            {socialIcons.map(({ icon, href }, i) => (
              <a
                key={i}
                href={href}
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

        {/* Columns */}
        <div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 16, letterSpacing: '0.04em' }}>Product</div>
          {productLinks.map((l) => <FooterLink key={l} label={l} />)}
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 16, letterSpacing: '0.04em' }}>Resources</div>
          {resourceLinks.map((l) => <FooterLink key={l} label={l} />)}
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, marginBottom: 16, letterSpacing: '0.04em' }}>Company</div>
          {companyLinks.map((l) => <FooterLink key={l} label={l} />)}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: `1px solid ${C.border}`, paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12,
        }}
      >
        <span style={{ color: C.textSecondary, fontSize: 13 }}>© 2026 TaskMaster. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 20 }}>
          {legalLinks.map((l) => (
            <a
              key={l}
              href="#"
              style={{ color: C.textSecondary, fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = '#fff')}
              onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = C.textSecondary)}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </div>

    <style>{`
      @media (max-width: 768px) {
        .footer-grid { grid-template-columns: 1fr 1fr !important; }
      }
      @media (max-width: 480px) {
        .footer-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  </footer>
);

export default Footer;
