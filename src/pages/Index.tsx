import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhySection from "@/components/WhySection";
import ContactSection from "@/components/ContactSection";
import HelpSection from "@/components/HelpSection";
import Footer from "@/components/Footer";


const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-geo-pattern relative">
        <Navbar />
        <HeroSection />
      </div>

      <WhySection />
      <HelpSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
