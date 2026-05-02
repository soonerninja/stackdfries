import styles from './OpeningBanner.module.css';

export default function OpeningBanner() {
  return (
    <div className={styles.banner}>
      <p className={styles.text}>
        <span className={styles.full}>
          🔥 LAUNCHING AT NORMAN ARTS FESTIVAL — MAY 16 & 17 🔥
        </span>
        <span className={styles.compact}>
          🔥 NORMAN ARTS FEST · MAY 16–17 🔥
        </span>
      </p>
    </div>
  );
}
