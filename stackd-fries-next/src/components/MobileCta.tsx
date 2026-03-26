import { siteConfig } from '@/lib/config';
import styles from './MobileCta.module.css';

export default function MobileCta() {
  return (
    <div className={styles.bar}>
      <a
        href={siteConfig.orderUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        Order Now
      </a>
    </div>
  );
}
