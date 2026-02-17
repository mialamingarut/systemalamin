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

export default async function Home() {
  const teachers = await getTeachersForLanding();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <TrustSection />
      <AboutSection />
      <ProgramSection />
      <TeachersSection teachers={teachers} />
      <GallerySection />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </main>
  );
}
