import type { Metadata } from 'next';
import styles from './privacy.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: "Stack'd Fries privacy policy — how we collect and use your information.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <a href="/" className={styles.back}>← Back to Stack'd Fries</a>

        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: April 2025</p>

        <section className={styles.section}>
          <h2>1. Who We Are</h2>
          <p>
            Stack&apos;d Fries (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website{' '}
            <a href="https://stackdfries.com">stackdfries.com</a>. We are a mobile food trailer
            based in Norman, Oklahoma. Questions? Email us at{' '}
            <a href="mailto:stackfries@gmail.com">stackfries@gmail.com</a>.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. Information We Collect</h2>
          <p>We collect only the minimum information needed to run our business:</p>
          <ul>
            <li>
              <strong>Email address</strong> — if you sign up for our newsletter or drop alerts.
              We use this only to send you updates about Stack&apos;d Fries.
            </li>
            <li>
              <strong>Usage data</strong> — anonymized analytics data (pages visited, browser type,
              general location) collected via Vercel Analytics or similar tools. This data cannot
              identify you personally.
            </li>
            <li>
              <strong>IP address</strong> — logged briefly by our servers for rate-limiting purposes
              (e.g., preventing spam signups). Not stored long-term.
            </li>
          </ul>
          <p>We do <strong>not</strong> collect payment information — all orders are processed through
          Square on their secure platform.</p>
        </section>

        <section className={styles.section}>
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To send you email updates about drops, new locations, and specials (only if you opted in)</li>
            <li>To operate and improve the website</li>
            <li>To prevent abuse of our public-facing forms</li>
          </ul>
          <p>We do not sell, rent, or share your personal information with third parties for marketing.</p>
        </section>

        <section className={styles.section}>
          <h2>4. Email Communications</h2>
          <p>
            If you signed up for our email list, you can unsubscribe at any time by emailing us at{' '}
            <a href="mailto:stackfries@gmail.com">stackfries@gmail.com</a> with &quot;Unsubscribe&quot;
            in the subject line. We will remove you promptly.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Cookies</h2>
          <p>
            Our website may use cookies for session management and analytics. We do not use
            advertising or tracking cookies. You can disable cookies in your browser settings,
            though some features may not work correctly.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Third-Party Services</h2>
          <p>We use the following third-party services that may process your data:</p>
          <ul>
            <li><strong>Vercel</strong> — website hosting. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
            <li><strong>Supabase</strong> — database for email signups and site content. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
            <li><strong>Square</strong> — order processing. We do not receive your payment info. <a href="https://squareup.com/us/en/legal/general/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
            <li><strong>Google Maps</strong> — embedded map for location tracking. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>7. Data Retention</h2>
          <p>
            Email addresses are retained until you request removal. Anonymous analytics data is
            retained per the third-party provider&apos;s policy (typically 26 months).
          </p>
        </section>

        <section className={styles.section}>
          <h2>8. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Request a copy of the data we hold about you</li>
            <li>Request deletion of your data</li>
            <li>Opt out of email communications at any time</li>
          </ul>
          <p>To exercise any of these rights, contact us at <a href="mailto:stackfries@gmail.com">stackfries@gmail.com</a>.</p>
        </section>

        <section className={styles.section}>
          <h2>9. Children&apos;s Privacy</h2>
          <p>
            Our website is not directed at children under 13. We do not knowingly collect personal
            information from children under 13. If you believe we have inadvertently collected such
            information, please contact us immediately.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. When we do, we will update the
            &quot;Last updated&quot; date at the top. Continued use of the site after changes constitutes
            acceptance of the updated policy.
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. Contact</h2>
          <p>
            Questions about this privacy policy? Contact us:<br />
            <strong>Stack&apos;d Fries</strong><br />
            Norman, Oklahoma<br />
            <a href="mailto:stackfries@gmail.com">stackfries@gmail.com</a><br />
            <a href="tel:+14054351002">(405) 310-9971</a>
          </p>
        </section>
      </div>
    </main>
  );
}
