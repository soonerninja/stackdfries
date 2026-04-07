import type { MenuItem } from '@/types/database';
import MenuCard from './MenuCard';
import styles from './MenuSection.module.css';

const CATEGORY_LABELS: Record<string, string> = {
  entrees: 'ENTR\u00C9ES',
  sides: 'SIDES',
  drinks: 'DRINKS',
  desserts: 'DESSERTS',
  loaded_fries: 'LOADED FRIES',
  sides_drinks: 'SIDES & DRINKS',
};

// Categories that should always render BEFORE drinks, in this order.
const priorityOrder = ['entrees', 'entree', 'loaded_fries', 'sides', 'desserts', 'sides_drinks'];

function normalizeCategory(c: string): string {
  return (c || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
}

interface MenuGridProps {
  items: MenuItem[];
}

export default function MenuGrid({ items }: MenuGridProps) {
  const grouped: Record<string, MenuItem[]> = {};
  for (const item of items) {
    const cat = normalizeCategory(item.category);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  }

  // Render order: priority categories (entrees first) → unknown/extra categories → drinks last.
  // Drinks always render last so the menu leads with food.
  const priorityKnown = priorityOrder.filter((c) => grouped[c]);
  const extraCategories = Object.keys(grouped).filter(
    (c) => !priorityOrder.includes(c) && c !== 'drinks'
  );
  const trailing = grouped['drinks'] ? ['drinks'] : [];
  const sortedCategories = [...priorityKnown, ...extraCategories, ...trailing];

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
                sharePrice={item.share_price}
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
