import { siteConfig } from '@/lib/config';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              STACK&apos;D <span className={styles.logoGold}>FRIES</span>
            </div>
            <p className={styles.tagline}>Loaded. Always.</p>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <div className={styles.linkGroupTitle}>Quick Links</div>
              <a href="#menu" className={styles.footerLink}>Menu</a>
              <a href="#tracker" className={styles.footerLink}>Find Us</a>
              <a href={siteConfig.orderUrl} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Order Now</a>
            </div>
            <div className={styles.linkGroup}>
              <div className={styles.linkGroupTitle}>Connect</div>
              <a href={siteConfig.social.tiktok} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>TikTok</a>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Instagram</a>
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Facebook</a>
            </div>
            <div className={styles.linkGroup}>
              <div className={styles.linkGroupTitle}>Contact</div>
              <a href={'mailto:' + siteConfig.contact.email} className={styles.footerLink}>{siteConfig.contact.email}</a>
              <a href={'tel:' + siteConfig.contact.phone.replace(/[^\d+]/g, '')} className={styles.footerLink}>{siteConfig.contact.phone}</a>
              <span className={styles.footerLink}>Norman, Oklahoma</span>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.hours}>
            Thu–Sun &nbsp;|&nbsp; Check our schedule for hours
          </p>
          <div className={styles.legal}>
            <span>&copy; {new Date().getFullYear()} Stack&apos;d Fries&trade; &mdash; All rights reserved.</span>
            <span className={styles.legalDivider}>|</span>
            <span>Norman, Oklahoma</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
