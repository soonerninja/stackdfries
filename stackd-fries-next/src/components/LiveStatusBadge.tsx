'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { getStatusText } from '@/lib/hours';
import type { TrackerStatus } from '@/types/database';
import styles from './LiveStatusBadge.module.css';

export default function LiveStatusBadge() {
  const [isLive, setIsLive] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function fetchStatus() {
      const { data } = await supabase
        .from('tracker_status')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single<TrackerStatus>();

      if (data?.is_live) {
        setIsLive(true);
        setStatusText(`LIVE at ${data.location_name || 'our spot'}`);
      } else {
        const schedule = getStatusText();
        setIsLive(schedule.isOpen);
        setStatusText(schedule.text);
      }
      setLoaded(true);
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!loaded) return null;

  return (
    <div className={styles.badge}>
      <span className={`${styles.dot} ${isLive ? styles.dotLive : styles.dotClosed}`} />
      <span className={isLive ? styles.liveText : ''}>{statusText}</span>
    </div>
  );
}
