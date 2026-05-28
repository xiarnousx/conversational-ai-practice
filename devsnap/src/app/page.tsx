import MarketingNav from '@/components/marketing/MarketingNav';
import HeroSection from '@/components/marketing/HeroSection';
import FeaturesSection from '@/components/marketing/FeaturesSection';
import AISection from '@/components/marketing/AISection';
import PricingSection from '@/components/marketing/PricingSection';
import CTASection from '@/components/marketing/CTASection';
import MarketingFooter from '@/components/marketing/MarketingFooter';

export default function Home() {
  return (
    <div className="bg-[#0a0c14] text-[#e2e8f0] min-h-screen overflow-x-hidden">
      <MarketingNav />
      <HeroSection />
      <FeaturesSection />
      <AISection />
      <PricingSection />
      <CTASection />
      <MarketingFooter />
    </div>
  );
}
