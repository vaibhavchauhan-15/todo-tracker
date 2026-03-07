import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import ProblemSection from '../components/landing/ProblemSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import ProductPreview from '../components/landing/ProductPreview';
import HowItWorks from '../components/landing/HowItWorks';
import BenefitsSection from '../components/landing/BenefitsSection';
import SocialProof from '../components/landing/SocialProof';
import PricingSection from '../components/landing/PricingSection';
import FAQSection from '../components/landing/FAQSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';
import { C } from '../components/landing/tokens';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/signup');
  const handleLogin = () => navigate('/login');

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: C.bg,
        color: C.textPrimary,
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <Navbar onGetStarted={handleGetStarted} onLogin={handleLogin} />
      <main>
        <Hero onGetStarted={handleGetStarted} />
        <ProblemSection />
        <FeaturesSection />
        <ProductPreview />
        <HowItWorks />
        <BenefitsSection />
        <SocialProof />
        <PricingSection onGetStarted={handleGetStarted} />
        <FAQSection />
        <CTASection onGetStarted={handleGetStarted} />
      </main>
      <Footer onLogin={handleLogin} onGetStarted={handleGetStarted} />

      <style>{`
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        a { font-family: inherit; }
      `}</style>
    </div>
  );
};

export default LandingPage;
