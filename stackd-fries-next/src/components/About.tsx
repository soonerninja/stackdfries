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
              Founded in Norman. Now Oklahoma&apos;s go-to for loaded fries.
            </p>
            <p className={styles.body}>
              Stack&apos;d Fries is what happens when street food meets obsession. Every order stacked
              high with flavor — no half-measures, no boring fries. We started with a simple idea:
              fries should be the main event, not a side dish. Check out our{' '}
              <a href="#menu" className={styles.inlineLink}>full menu</a> to see what we mean.
            </p>
            <p className={styles.body}>
              From our trailer to your hands — loaded, stacked, and worth the wait.{' '}
              <a href="#tracker" className={styles.inlineLink}>Find us</a> at our next stop.
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
