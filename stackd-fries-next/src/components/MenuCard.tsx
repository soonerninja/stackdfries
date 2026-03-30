import Image from 'next/image';
import styles from './MenuCard.module.css';

interface MenuCardProps {
  name: string;
  price: number;
  sharePrice: number | null;
  description: string | null;
  imageUrl: string | null;
  isSpecial?: boolean;
}

export default function MenuCard({ name, price, sharePrice, description, imageUrl, isSpecial }: MenuCardProps) {
  return (
    <div className={`${styles.card} ${isSpecial ? styles.special : ''}`}>
      {imageUrl ? (
        <div className={styles.imageWrap}>
          <Image src={imageUrl} alt={`${name} - Stack'd Fries loaded fries`} fill sizes="(max-width: 767px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
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
          {sharePrice ? (
            <div className={styles.priceGroup}>
              <div className={styles.priceRow}>
                <span className={styles.price}>${price.toFixed(2)}</span>
                <span className={styles.priceDivider}>/</span>
                <span className={styles.price}>${sharePrice.toFixed(2)}</span>
              </div>
              <div className={styles.priceLabels}>
                <span className={styles.priceLabel}>full stack</span>
                <span className={styles.priceLabelSpacer} />
                <span className={styles.priceLabel}>share stack</span>
              </div>
            </div>
          ) : (
            <div className={styles.price}>${price.toFixed(2)}</div>
          )}
        </div>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );
}
