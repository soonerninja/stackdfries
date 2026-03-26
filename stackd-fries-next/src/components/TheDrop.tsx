import { createClient } from '@/lib/supabase-server';
import type { CurrentDrop } from '@/types/database';
import styles from './TheDrop.module.css';

export default async function TheDrop() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('current_drop')
    .select('*')
    .eq('is_active', true)
    .limit(1)
    .single<CurrentDrop>();

  if (!data) return null;

  return (
    <section className={`${styles.section} reveal`}>
      <div className="container">
        <div className={styles.label}>THE DROP</div>
        <h2 className={styles.name}>{data.name}</h2>
        {data.teaser_text && <p className={styles.teaser}>{data.teaser_text}</p>}
        {data.image_url && (
          <div className={styles.image}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.image_url} alt={data.name} />
          </div>
        )}
        {data.available_date && (
          <div className={styles.date}>Available {data.available_date}</div>
        )}
        <div className={styles.tagline}>Don&apos;t sleep.</div>
      </div>
    </section>
  );
}
