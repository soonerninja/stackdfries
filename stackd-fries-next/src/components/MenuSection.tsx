import { createClient } from '@/lib/supabase-server';
import { siteConfig } from '@/lib/config';
import type { MenuItem } from '@/types/database';
import MenuCard from './MenuCard';
import styles from './MenuSection.module.css';

const CATEGORY_LABELS: Record<string, string> = {
  loaded_fries: 'LOADED FRIES',
  sides_drinks: 'SIDES & DRINKS',
};

export default async function MenuSection() {
  let items: MenuItem[] | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .returns<MenuItem[]>();
    items = data;
  } catch {
    // If Supabase fails, hide the section
  }

  if (!items || items.length === 0) return null;

  const grouped: Record<string, MenuItem[]> = {};
  for (const item of items) {
    const cat = item.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  }

  const categoryOrder = ['loaded_fries', 'sides_drinks'];
  const sortedCategories = categoryOrder.filter((c) => grouped[c]);

  return (
    <section className={`${styles.section} reveal`} id="menu">
      <div className="container">
        <h2 className="section-title">THE MENU</h2>

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

        <div className={styles.orderWrap}>
          <a
            href={siteConfig.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Order Now
          </a>
        </div>
      </div>
    </section>
  );
}
