import Image from 'next/image';
import { createClient } from '@/lib/supabase-server';
import type { CurrentDrop } from '@/types/database';
import styles from './TheDrop.module.css';

export default async function TheDrop() {
  let data: CurrentDrop | null = null;

  try {
    const supabase = await createClient();
    const { data: rows } = await supabase
      .from('current_drop')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1);

    data = rows?.[0] ?? null;
  } catch {
    // If fetch fails, hide the section
  }

  if (!data) return null;

  return (
    <section className={`${styles.section} reveal`}>
      <div className="container">
        <div className={styles.label}>THE DROP</div>
        <h2 className={styles.name}>{data.name}</h2>
        {data.teaser_text && <p className={styles.teaser}>{data.teaser_text}</p>}
        {data.image_url && (
          <div className={styles.image}>
            <Image src={data.image_url} alt={data.name} fill sizes="(max-width: 767px) 100vw, 500px" style={{ objectFit: 'cover' }} />
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
