import styles from './OpeningBanner.module.css';
import { getBanner, bannerActive } from '@/lib/banner';

export default async function OpeningBanner() {
  const banner = await getBanner();
  if (!bannerActive(banner)) return null;

  return (
    <div className={styles.banner}>
      <p className={styles.text}>{banner.text.trim()}</p>
    </div>
  );
}
