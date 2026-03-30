import styles from './HowItWorks.module.css';

const steps = [
  {
    number: '1',
    title: 'FOLLOW',
    description: 'Follow us on socials for updates and drop alerts.',
  },
  {
    number: '2',
    title: 'FIND',
    description: 'Check Find Us for today\u2019s live location and hours.',
  },
  {
    number: '3',
    title: 'ORDER',
    description: 'Pull up, order, and get your fries stacked.',
  },
];

export default function HowItWorks() {
  return (
    <section className={`${styles.section} reveal`} id="how-it-works">
      <div className="container">
        <h2 className="section-title">HOW IT WORKS</h2>

        <div className={styles.steps}>
          {steps.map((step, i) => (
            <>
              <div key={step.number} className={styles.card}>
                <span className={styles.number}>{step.number}</span>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.description}>{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div key={`c-${i}`} className={styles.connector} aria-hidden="true" />
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  );
}
