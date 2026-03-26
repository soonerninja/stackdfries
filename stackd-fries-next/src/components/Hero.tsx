import { siteConfig } from '@/lib/config';
import LiveStatusBadge from './LiveStatusBadge';
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
        <div className={styles.badgeWrap}>
          <LiveStatusBadge />
        </div>
      </div>
    </section>
  );
}
