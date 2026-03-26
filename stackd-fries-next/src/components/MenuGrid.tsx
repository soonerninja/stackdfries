'use client';

import { useState } from 'react';
import type { MenuItem } from '@/types/database';
import MenuCard from './MenuCard';
import MenuModal from './MenuModal';
import styles from './MenuSection.module.css';

const CATEGORY_LABELS: Record<string, string> = {
  entrees: 'ENTR\u00C9ES',
  sides: 'SIDES',
  drinks: 'DRINKS',
  desserts: 'DESSERTS',
  loaded_fries: 'LOADED FRIES',
  sides_drinks: 'SIDES & DRINKS',
};

const categoryOrder = ['entrees', 'sides', 'drinks', 'desserts', 'loaded_fries', 'sides_drinks'];

interface MenuGridProps {
  items: MenuItem[];
}

export default function MenuGrid({ items }: MenuGridProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

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
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedItem(item);
                  }
                }}
              >
                <MenuCard
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  imageUrl={item.image_url}
                  isSpecial={item.category === 'rotating_special'}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedItem && (
        <MenuModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </>
  );
}
