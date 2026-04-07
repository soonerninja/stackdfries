import { siteConfig } from '@/lib/config';
import { createClient } from '@/lib/supabase-server';
import { getFormattedHours, type HoursMap } from '@/lib/hours';
import styles from './Footer.module.css';

async function loadHours(): Promise<HoursMap | undefined> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'hours')
      .maybeSingle();
    return (data?.value as HoursMap | undefined) ?? undefined;
  } catch {
    return undefined;
  }
}

export default async function Footer() {
  const dynamicHours = await loadHours();
  const formatted = getFormattedHours(dynamicHours).filter((h) => h.hours !== 'Closed');
  const hoursLine = formatted.length
    ? formatted.map((h) => `${h.day.slice(0, 3)} ${h.hours}`).join(' · ')
    : 'Hours vary — check Find Us for schedule';
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
              <a href="#catering" className={styles.footerLink}>Catering</a>
              <a href={siteConfig.orderUrl} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Order Now</a>
            </div>
            <div className={styles.linkGroup}>
              <div className={styles.linkGroupTitle}>Connect</div>
              <a href={siteConfig.social.tiktok} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>TikTok</a>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Instagram</a>
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Facebook</a>
              {/* Add Google Business Profile link once set up */}
            </div>
            <div className={styles.linkGroup}>
              <div className={styles.linkGroupTitle}>Contact</div>
              <a href={'mailto:' + siteConfig.contact.email} className={styles.footerLink}>{siteConfig.contact.email}</a>
              <a href={'tel:' + siteConfig.contact.phone.replace(/[^\d+]/g, '')} className={styles.footerLink}>{siteConfig.contact.phone}</a>
              <span className={styles.footerLink}>Oklahoma</span>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.hours}>
            {hoursLine} &middot; <a href="#tracker" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Find Us</a>
          </p>
          <div className={styles.legal}>
            <span>&copy; {new Date().getFullYear()} Stack&apos;d Fries&trade; &mdash; All rights reserved.</span>
            <span className={styles.legalDivider}>|</span>
            <span>Oklahoma</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
