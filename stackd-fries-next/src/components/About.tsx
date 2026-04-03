import { siteConfig } from '@/lib/config';
import styles from './About.module.css';

export default function About() {
  return (
    <section className={`${styles.section} reveal`} id="about">
      <div className="container">
        <h2 className="section-title">THE STORY</h2>

        <div className={styles.grid}>
          <div className={styles.mainText}>
            <p className={styles.lead}>
              Norman&apos;s original loaded fries food trailer — now serving all of Oklahoma.
            </p>
            <p className={styles.body}>
              Stack&apos;d Fries is what happens when street food meets obsession. Fresh-cut fries loaded
              high with buffalo chicken, carne asada, street corn, and more — no half-measures, no
              boring fries. We started with a simple idea: fries should be the main event.
            </p>
            <p className={styles.body}>
              Find our trailer in Norman and around the OKC metro. Follow us on TikTok and Instagram
              to track our location — or check the live tracker above.
            </p>
          </div>

          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <div className={styles.highlightNumber}>100%</div>
              <div className={styles.highlightLabel}>Loaded Every Time</div>
            </div>
            <div className={styles.highlight}>
              <div className={styles.highlightNumber}>Oklahoma</div>
              <div className={styles.highlightLabel}>Born in Norman</div>
            </div>
            <div className={styles.highlight}>
              <div className={styles.highlightNumber}>0</div>
              <div className={styles.highlightLabel}>Shortcuts Taken</div>
            </div>
          </div>
        </div>

        <div className={styles.followUs}>
          <span className={styles.followLabel}>Follow the trailer</span>
          <div className={styles.followLinks}>
            <a href={siteConfig.social.tiktok} target="_blank" rel="noopener noreferrer" className={styles.followLink}>TikTok</a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className={styles.followLink}>Instagram</a>
            <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className={styles.followLink}>Facebook</a>
          </div>
        </div>
      </div>
    </section>
  );
}
