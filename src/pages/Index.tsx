import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import LogoBanner from "@/components/LogoBanner";
import { ValueStats } from "@/components/ValueStats";
import { Solutions } from "@/components/Solutions";
import { HowItWorks } from "@/components/HowItWorks";
import { OnboardingDetails } from "@/components/OnboardingDetails";
import { Contact } from "@/components/Contact";
import Footer from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import ClientResources from "@/components/ClientResources";
import VampBlogBanner from "@/components/VampBlogBanner";
import { Reveal } from "@/components/Reveal";
import { PricingSection } from "@/components/PricingSection";
import { PageSEO } from "@/components/PageSEO";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <PageSEO
        title="Plug In, Play and Process"
        description="Card, ACH and pay-link payments for U.S. small and mid-size businesses. Accept payments online, in-store or on the go, and go live in about a week."
        path="/"
      />
      <Header />
      {/* Sections with their own staggered reveals sit bare; the rest fade up whole. */}
      <main className="relative z-1">
        <Hero />
        <LogoBanner />
        <HowItWorks />
        <OnboardingDetails />
        <Reveal direction="up" delay={100}>
          <ValueStats />
        </Reveal>
        <Solutions />
        <Reveal direction="up" delay={100}>
          <VampBlogBanner />
        </Reveal>
        <PricingSection />
        <Reveal direction="up" delay={100}>
          <ClientResources />
        </Reveal>
        <Contact />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default Index;
