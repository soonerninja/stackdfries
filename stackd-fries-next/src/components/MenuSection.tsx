import { createClient } from '@/lib/supabase-server';
import { siteConfig } from '@/lib/config';
import type { MenuItem } from '@/types/database';
import MenuGrid from './MenuGrid';
import styles from './MenuSection.module.css';

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

  return (
    <section className={`${styles.section} reveal`} id="menu">
      <div className="container">
        <h2 className="section-title">THE MENU</h2>

        <MenuGrid items={items} />

        <div className={styles.orderWrap}>
          <a
            href={siteConfig.orderUrl}
            {...(siteConfig.orderUrl.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="btn btn-primary"
          >
            Order Now
          </a>
        </div>
      </div>
    </section>
  );
}
