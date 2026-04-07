import styles from './MenuSkeleton.module.css';

export default function MenuSkeleton() {
  return (
    <section className={styles.section} id="menu">
      <div className="container">
        <h2 className="section-title">THE MENU</h2>
        <div className={styles.grid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.card}>
              <div className={styles.imagePlaceholder} />
              <div className={styles.body}>
                <div className={styles.titleBar} />
                <div className={styles.descBar} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
