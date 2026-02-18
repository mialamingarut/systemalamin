import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import TrustSection from "@/components/sections/TrustSection";
import AboutSection from "@/components/sections/AboutSection";
import ProgramSection from "@/components/sections/ProgramSection";
import TeachersSection from "@/components/sections/TeachersSection";
import GallerySection from "@/components/sections/GallerySection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";
import { getTeachersForLanding } from "@/app/actions/teachers";
import { getLandingData, getSystemConfig } from "@/app/actions/landing";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [teachers, landingData, systemConfig] = await Promise.all([
    getTeachersForLanding(),
    getLandingData(),
    getSystemConfig(),
  ]);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection hero={landingData.hero} stats={landingData.stats} />
      <TrustSection stats={landingData.stats} />
      <AboutSection about={landingData.about} features={landingData.features} />
      <ProgramSection programs={landingData.programs} />
      <TeachersSection teachers={teachers} />
      <GallerySection gallery={landingData.gallery} />
      <TestimonialSection testimonials={landingData.testimonials} />
      <CTASection cta={landingData.cta} config={systemConfig} />
      <Footer config={systemConfig} />
    </main>
  );
}
