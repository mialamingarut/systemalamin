import HeroSection from "@/components/landing/HeroSection";
import ProfileSection from "@/components/landing/ProfileSection";
import ProgramSection from "@/components/landing/ProgramSection";
import StatsSection from "@/components/landing/StatsSection";
import GallerySection from "@/components/landing/GallerySection";
import TeachersSection from "@/components/landing/TeachersSection";
import SPMBSection from "@/components/landing/SPMBSection";
import TestimonialSection from "@/components/landing/TestimonialSection";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { getTeachersForLanding } from "@/app/actions/teachers";

export default async function Home() {
  const teachers = await getTeachersForLanding();

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProfileSection />
      <ProgramSection />
      <StatsSection />
      <GallerySection />
      <TeachersSection teachers={teachers} />
      <SPMBSection />
      <TestimonialSection />
      <Footer />
    </main>
  );
}
