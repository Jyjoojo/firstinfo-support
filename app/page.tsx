
import ContactSection from "./ui/ContactSection";
import FaqSectionShadcn from "./ui/FaqSection";
import Footer from "./ui/Footer";
import Header from "./ui/Header";
import Hero from "./ui/Hero";
import ServiceCards from "./ui/ServiceCards";
import StatsBanner from "./ui/StatsBanner";

export default function HomePage() {
  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container">
      <Header />
      <main className="pt-16 overflow-x-hidden">
        <Hero />
        <StatsBanner />
        <ServiceCards />
        <FaqSectionShadcn />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
