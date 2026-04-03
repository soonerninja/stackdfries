import Image from 'next/image';
import styles from './MenuCard.module.css';

interface MenuCardProps {
  name: string;
  price: number | null;
  sharePrice: number | null;
  description: string | null;
  imageUrl: string | null;
  isSpecial?: boolean;
}

export default function MenuCard({ name, price, sharePrice, description, imageUrl, isSpecial }: MenuCardProps) {
  const hasSharePrice = sharePrice != null && sharePrice > 0;
  const hasFullPrice = price != null && price > 0;

  return (
    <div className={`${styles.card} ${isSpecial ? styles.special : ''}`}>
      {imageUrl ? (
        <div className={styles.imageWrap}>
          <Image src={imageUrl} alt={name} fill sizes="(max-width: 767px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
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
          {(hasSharePrice || hasFullPrice) && (
            <div className={styles.priceGroup}>
              {hasSharePrice && (
                <div className={styles.priceItem}>
                  <span className={styles.priceLabel}>SHARE</span>
                  <span className={styles.price}>${sharePrice.toFixed(2)}</span>
                </div>
              )}
              {hasFullPrice && (
                <div className={styles.priceItem}>
                  {hasSharePrice && <span className={styles.priceLabel}>FULL</span>}
                  <span className={styles.price}>${price.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );
}
