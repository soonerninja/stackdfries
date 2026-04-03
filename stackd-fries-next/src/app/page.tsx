import OpeningBanner from '@/components/OpeningBanner';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import LiveTracker from '@/components/LiveTracker';
import TheDrop from '@/components/TheDrop';
import MenuSection from '@/components/MenuSection';
import About from '@/components/About';
import Catering from '@/components/Catering';
import EmailSignup from '@/components/EmailSignup';
import Footer from '@/components/Footer';
import MobileCta from '@/components/MobileCta';
import ScrollReveal from '@/components/ScrollReveal';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <OpeningBanner />
      <Nav />
      <main>
        <Hero />
        <LiveTracker />
        <TheDrop />
        <MenuSection />
        <About />
        <Catering />
        <EmailSignup />
      </main>
      <Footer />
      <MobileCta />
      <ScrollReveal />
    </>
  );
}
