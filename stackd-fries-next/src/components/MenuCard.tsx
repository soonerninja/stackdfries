import styles from './MenuCard.module.css';

interface MenuCardProps {
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  isSpecial?: boolean;
}

export default function MenuCard({ name, price, description, imageUrl, isSpecial }: MenuCardProps) {
  return (
    <div className={`${styles.card} ${isSpecial ? styles.special : ''}`}>
      {imageUrl ? (
        <div className={styles.imageWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={name} />
        </div>
      ) : (
        <div className={`${styles.imageWrap} ${styles.placeholder}`}>
          <span className={styles.placeholderText}>SF</span>
        </div>
      )}
      <div className={styles.body}>
        {isSpecial && <div className={styles.badge}>THIS WEEK</div>}
        <div className={styles.header}>
          <div className={styles.name}>{name}</div>
          <div className={styles.price}>${price.toFixed(2)}</div>
        </div>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );
}
