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
              with flavor, no shortcuts, no compromises. We started with a simple idea: fries should
              be a main event, not a side dish.
            </p>
            <p className={styles.body}>
              From our trailer to your hands — fresh-cut, loaded, and worth the wait.
            </p>
          </div>

          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <div className={styles.highlightNumber}>100%</div>
              <div className={styles.highlightLabel}>Fresh Cut Daily</div>
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
