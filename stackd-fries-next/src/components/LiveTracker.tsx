'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { siteConfig } from '@/lib/config';
import { getFormattedHours } from '@/lib/hours';
import type { TrackerStatus } from '@/types/database';
import styles from './LiveTracker.module.css';

export default function LiveTracker() {
  const [tracker, setTracker] = useState<TrackerStatus | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function fetchStatus() {
      try {
        const { data } = await supabase
          .from('tracker_status')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single<TrackerStatus>();

        setTracker(data ?? null);
      } catch {
        // If fetch fails, show closed state
        setTracker(null);
      }
      setLoaded(true);
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!loaded) return null;

  const isLive = tracker?.is_live ?? false;
  const hours = getFormattedHours();

  return (
    <section className={`${styles.section} reveal`} id="tracker">
      <div className="container">
        <h2 className="section-title">FIND US</h2>

        {isLive && tracker ? (
          <>
            <div className={styles.liveHeader}>
              <div className={styles.liveLabel}>
                <span className={styles.liveDot} />
                LIVE NOW
              </div>
              <div className={styles.locationName}>{tracker.location_name}</div>
            </div>
            {tracker.latitude && tracker.longitude ? (
              <>
                <div className={styles.mapWrap}>
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${tracker.longitude - 0.01},${tracker.latitude - 0.005},${tracker.longitude + 0.01},${tracker.latitude + 0.005}&layer=mapnik&marker=${tracker.latitude},${tracker.longitude}`}
                    allowFullScreen
                    loading="lazy"
                    title="Stack'd Fries location"
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <a
                    className={styles.mapsLink}
                    href={`https://www.google.com/maps/search/?api=1&query=${tracker.latitude},${tracker.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </>
            ) : null}
            <div className={styles.contactInfo}>
              <div>
                <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
                {' · '}
                <a href={`tel:${siteConfig.contact.phone.replace(/[^\d+]/g, '')}`}>
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.closedContent}>
            <p className={styles.closedMessage}>We&apos;re not live right now. Check back during operating hours.</p>
            <table className={styles.scheduleTable}>
              <tbody>
                {hours.map((h) => (
                  <tr key={h.day}>
                    <td>{h.day}</td>
                    <td>{h.hours}</td>
                  </tr>
                ))}
                <tr>
                  <td>Mon–Wed</td>
                  <td>Closed</td>
                </tr>
              </tbody>
            </table>
            <p className={styles.seasonNote}>Late-night Saturdays (until 2am) during OU football &amp; spring sessions.</p>
            <div className={styles.contactInfo}>
              <div>{siteConfig.location.address}</div>
              <div>
                <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
              </div>
              <div>
                <a href={`tel:${siteConfig.contact.phone.replace(/[^\d+]/g, '')}`}>
                  {siteConfig.contact.phone}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
