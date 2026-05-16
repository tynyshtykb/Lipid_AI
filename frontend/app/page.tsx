import { HeroSection } from '@/components/sections/hero-section';
import { ProblemSection } from '@/components/sections/problem-section';
import { CalculatorSection } from '@/components/sections/calculator-section';
import { TGExplorerSection } from '@/components/sections/tg-explorer-section';
import { WhyMLSection } from '@/components/sections/why-ml-section';
import { Footer } from '@/components/sections/footer';

export default function LipidAIPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <CalculatorSection />
      <TGExplorerSection />
      <WhyMLSection />
      <Footer />
    </main>
  );
}
