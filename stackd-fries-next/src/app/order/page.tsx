import styles from './order.module.css';

export default function OrderPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.badge}>COMING SOON</div>
        <h1 className={styles.title}>
          ONLINE ORDERING<br />
          <span className={styles.titleGold}>DROPS MAY 2ND</span>
        </h1>
        <p className={styles.subtitle}>
          We&apos;re firing up the fryer and getting everything dialed in.
          Online ordering goes live when we do.
        </p>
        <div className={styles.divider} />
        <p className={styles.followText}>
          Follow us so you don&apos;t miss the drop.
        </p>
        <div className={styles.socials}>
          <a
            href="https://www.tiktok.com/@stackdfries"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            TikTok
          </a>
          <span className={styles.dot}>&middot;</span>
          <a
            href="https://instagram.com/stackdfries"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            Instagram
          </a>
          <span className={styles.dot}>&middot;</span>
          <a
            href="https://www.facebook.com/stackdfries"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            Facebook
          </a>
        </div>
        <div className={styles.backWrap}>
          <a href="/" className={styles.backLink}>&larr; Back to Stack&apos;d Fries</a>
        </div>
      </div>
    </main>
  );
}
