import type { Metadata } from 'next';
import OpeningBanner from '@/components/OpeningBanner';
import { siteConfig } from '@/lib/config';
import styles from './order.module.css';

export const metadata: Metadata = {
  title: "Online Ordering — Coming May 2nd — Stack'd Fries",
  description:
    "Online ordering from Stack'd Fries opens on our Grand Opening, May 2nd. Follow along so you don't miss the drop.",
  alternates: { canonical: 'https://stackdfries.com/order' },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://stackdfries.com' },
    { '@type': 'ListItem', position: 2, name: 'Order', item: 'https://stackdfries.com/order' },
  ],
};

export default function OrderPage() {
  return (
    <>
      <OpeningBanner />
      <main className={styles.page}>
        <div className={styles.content}>
          <div className={styles.badge}>Coming Soon</div>
          <h1 className={styles.title}>
            ONLINE ORDERING<br />
            <span className={styles.titleGold}>DROPS MAY 2ND</span>
          </h1>
          <div className={styles.dateRow}>
            <span className={styles.dateRowDot} />
            Grand Opening · May 2nd
          </div>
          <p className={styles.subtitle}>
            We&apos;re firing up the fryer and getting everything dialed in.
            Online ordering goes live the day we do.
          </p>
          <div className={styles.divider} />
          <p className={styles.followText}>
            Follow us so you don&apos;t miss the drop.
          </p>
          <div className={styles.socials}>
            <a
              href={siteConfig.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              TikTok
            </a>
            <span className={styles.dot}>&middot;</span>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              Instagram
            </a>
            <span className={styles.dot}>&middot;</span>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              Facebook
            </a>
          </div>
          <div className={styles.backWrap}>
            <a href="/" className={styles.backLink}>&larr; Back to Stack&apos;d Fries</a>
          </div>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
