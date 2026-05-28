import { auth } from '@/auth';
import MarketingNav from '@/components/marketing/MarketingNav';
import HeroSection from '@/components/marketing/HeroSection';
import FeaturesSection from '@/components/marketing/FeaturesSection';
import AISection from '@/components/marketing/AISection';
import PricingSection from '@/components/marketing/PricingSection';
import CTASection from '@/components/marketing/CTASection';
import MarketingFooter from '@/components/marketing/MarketingFooter';

export default async function Home() {
  const session = await auth();
  const isSignedIn = !!session?.user;

  return (
    <div className="bg-[#0a0c14] text-[#e2e8f0] min-h-screen overflow-x-hidden">
      <MarketingNav isSignedIn={isSignedIn} />
      <HeroSection isSignedIn={isSignedIn} />
      <FeaturesSection />
      <AISection />
      <PricingSection />
      <CTASection isSignedIn={isSignedIn} />
      <MarketingFooter />
    </div>
  );
}
