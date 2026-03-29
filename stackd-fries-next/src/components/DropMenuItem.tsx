'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-browser';
import type { CurrentDrop } from '@/types/database';
import styles from './DropMenuItem.module.css';

export default function DropMenuItem() {
  const [drop, setDrop] = useState<CurrentDrop | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('current_drop')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setDrop(data as CurrentDrop);
      });
  }, []);

  if (!drop) return null;

  return (
    <div className={styles.wrapper} id="drop">
      <div className={styles.badge}>THE DROP</div>
      <div className={styles.card}>
        <div className={styles.inner}>
          {drop.image_url ? (
            <div className={styles.imageWrap}>
              <Image
                src={drop.image_url}
                alt={drop.name}
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div className={`${styles.imageWrap} ${styles.placeholder}`}>
              <span className={styles.placeholderText}>SF</span>
            </div>
          )}
          <div className={styles.body}>
            <div className={styles.name}>{drop.name}</div>
            {drop.teaser_text && (
              <p className={styles.description}>{drop.teaser_text}</p>
            )}
            {drop.available_date && (
              <div className={styles.date}>Available {new Date(drop.available_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
