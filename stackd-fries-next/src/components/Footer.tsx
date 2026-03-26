import { siteConfig } from '@/lib/config';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.logo}>
          STACK&apos;D <span className={styles.logoGold}>FRIES</span>
        </div>

        <div className={styles.socials}>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            Instagram
          </a>
          <a
            href={siteConfig.social.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            TikTok
          </a>
          <a
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            Facebook
          </a>
        </div>

        <p className={styles.hours}>
          Thu&ndash;Fri 5pm&ndash;11pm &nbsp;|&nbsp; Sat 5pm&ndash;2am (OU szn) &nbsp;|&nbsp; Sun 5pm&ndash;10pm
        </p>

        <p className={styles.location}>Norman, Oklahoma</p>

        <p className={styles.copyright}>&copy; 2026 Stack&apos;d Fries</p>
      </div>
    </footer>
  );
}
