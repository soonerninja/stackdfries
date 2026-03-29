import { Suspense } from 'react';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import LiveTracker from '@/components/LiveTracker';
import TheDrop from '@/components/TheDrop';
import MenuSection from '@/components/MenuSection';
import MenuSkeleton from '@/components/MenuSkeleton';
import About from '@/components/About';
import HowItWorks from '@/components/HowItWorks';
import Catering from '@/components/Catering';
import EmailSignup from '@/components/EmailSignup';
import Footer from '@/components/Footer';
import MobileCta from '@/components/MobileCta';
import ScrollReveal from '@/components/ScrollReveal';
import BackToTop from '@/components/BackToTop';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <LiveTracker />
        <TheDrop />
        <Suspense fallback={<MenuSkeleton />}>
          <MenuSection />
        </Suspense>
        <About />
        <HowItWorks />
        <Catering />
        <EmailSignup />
      </main>
      <Footer />
      <MobileCta />
      <ScrollReveal />
      <BackToTop />
    </>
  );
}
