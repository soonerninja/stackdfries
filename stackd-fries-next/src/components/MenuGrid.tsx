import type { MenuItem } from '@/types/database';
import MenuCard from './MenuCard';
import styles from './MenuSection.module.css';

const CATEGORY_LABELS: Record<string, string> = {
  stackd_fries: "STACK'D FRIES",
  sides: 'SIDES',
  drinks: 'DRINKS',
  desserts: 'DESSERTS',
};

const categoryOrder = ['stackd_fries', 'sides', 'drinks', 'desserts'];

interface MenuGridProps {
  items: MenuItem[];
}

export default function MenuGrid({ items }: MenuGridProps) {
  const grouped: Record<string, MenuItem[]> = {};
  for (const item of items) {
    const cat = item.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  }

  const sortedCategories = categoryOrder.filter((c) => grouped[c]);

  return (
    <>
      {sortedCategories.map((cat) => (
        <div key={cat} className={styles.category}>
          <h3 className={styles.categoryTitle}>{CATEGORY_LABELS[cat] || cat}</h3>
          <div className={styles.grid}>
            {grouped[cat].map((item) => (
              <MenuCard
                key={item.id}
                name={item.name}
                price={item.price}
                description={item.description}
                imageUrl={item.image_url}
                isSpecial={item.category === 'rotating_special'}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
