import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <div className={styles.number}>404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.subtitle}>
          Looks like this page got lost on the way to the trailer.
        </p>
        <div className={styles.ctas}>
          <a href="/" className="btn btn-primary">Back to Home</a>
          <a href="/#menu" className="btn btn-outline">See the Menu</a>
        </div>
      </div>
    </main>
  );
}
