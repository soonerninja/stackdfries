import { siteConfig } from '@/lib/config';
import styles from './Catering.module.css';

export default function Catering() {
  return (
    <section className={`${styles.section} reveal`}>
      <div className="container">
        <h2 className="section-title">CATERING</h2>
        <p className={styles.text}>
          Private events. Game days. Parties. Stack&apos;d pulls up.
        </p>
        <div className={styles.ctas}>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="btn btn-outline"
          >
            Hit us up
          </a>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            DM on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
