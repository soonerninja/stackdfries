import type { Metadata } from 'next';
import OpeningBanner from '@/components/OpeningBanner';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CateringForm from '@/components/CateringForm';
import styles from './catering.module.css';

export const metadata: Metadata = {
  title: 'Catering & Events — Loaded Fries in Oklahoma',
  description:
    "Book Stack'd Fries for your OU game day, corporate event, wedding, or private party. Loaded fries catering across Oklahoma. 25 guest minimum, 24-hour response.",
  alternates: { canonical: 'https://stackdfries.com/catering' },
  openGraph: {
    title: "Catering & Events — Stack'd Fries",
    description:
      "Oklahoma's loaded fries, brought to your event. Corporate, game day, weddings, private parties.",
    url: 'https://stackdfries.com/catering',
    type: 'website',
  },
};

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Do you travel outside Norman?',
    a: "Yes. We serve events across Oklahoma. A travel fee may apply for venues outside the OKC metro — we'll include it in your quote.",
  },
  {
    q: "What's the minimum headcount?",
    a: 'Our catering minimum is 25 guests. There is no hard maximum — we scale to the event.',
  },
  {
    q: 'How far in advance should I book?',
    a: 'Two or more weeks is ideal. OU game-day weekends, holidays, and graduation weekends fill fastest, so reach out early for those dates.',
  },
  {
    q: 'What do you need from us on-site?',
    a: 'A 10x16 ft flat spot for the trailer and access to a 30-amp outlet. If power is not available we can bring a generator — just let us know in your inquiry.',
  },
  {
    q: 'Can you accommodate dietary restrictions?',
    a: 'We can offer gluten-free and vegetarian options. Note any restrictions in the inquiry form and we will confirm what we can do for your event.',
  },
  {
    q: 'How do we reserve a date?',
    a: 'Submit the inquiry form below. We respond within 24 hours with a quote and a deposit link — your date is held once the deposit is received.',
  },
];

export default function CateringPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <>
      <OpeningBanner />
      <Nav />
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className="container">
            <h1 className={styles.title}>CATERING &amp; EVENTS</h1>
            <p className={styles.lede}>
              OU game days, corporate events, weddings, private parties — we bring the stack.
              Serving all of Oklahoma, 25 guest minimum, 24-hour response.
            </p>
          </div>
        </section>

        <section id="faq" className={styles.faqSection}>
          <div className="container">
            <h2 className="section-title">FREQUENTLY ASKED</h2>
            <div className={styles.faqList}>
              {FAQS.map(({ q, a }) => (
                <details key={q} className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>{q}</summary>
                  <p className={styles.faqAnswer}>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <div id="inquiry">
          <CateringForm />
        </div>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
