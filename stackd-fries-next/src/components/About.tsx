import styles from './About.module.css';

export default function About() {
  return (
    <section className={`${styles.section} reveal`}>
      <div className="container">
        <h2 className="section-title">THE STORY</h2>
        <p className={styles.text}>
          Born in Norman. Built on loaded fries and late nights. Stack&apos;d Fries is what happens
          when street food meets obsession &mdash; every order stacked with flavor, no shortcuts,
          no compromises.
        </p>
      </div>
    </section>
  );
}
