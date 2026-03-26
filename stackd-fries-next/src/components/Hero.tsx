import { siteConfig } from '@/lib/config';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.glow} />
      <div className={styles.content}>
        <h1 className={styles.logoText}>
          STACK&apos;D <span className={styles.logoGold}>FRIES</span>
        </h1>
        <div className={styles.tagline}>
          <div>LOADED.</div>
          <div className={styles.taglineGold}>ALWAYS.</div>
        </div>
        <p className={styles.subtitle}>{siteConfig.subtitle}</p>
        <div className={styles.ctas}>
          <a
            href={siteConfig.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            ORDER NOW
          </a>
          <a href="#menu" className="btn btn-outline">
            See the Menu
          </a>
        </div>
        <div className={styles.socialRow}>
          <a
            href={siteConfig.social.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            TikTok
          </a>
          <span className={styles.socialDot}>·</span>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            Instagram
          </a>
          <span className={styles.socialDot}>·</span>
          <a
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            Facebook
          </a>
        </div>
      </div>
    </section>
  );
}
