'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { siteConfig } from '@/lib/config';
import { getFormattedHours } from '@/lib/hours';
import type { TrackerStatus } from '@/types/database';
import styles from './LiveTracker.module.css';

type DayKey = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
interface HoursRange { open: string; close: string; }
type HoursMap = Partial<Record<DayKey, HoursRange>>;

const ALL_DAYS: { key: DayKey; label: string }[] = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
];

function formatTime(t: string) {
  const [hours, minutes] = t.split(':').map(Number);
  const period = hours >= 12 ? 'pm' : 'am';
  const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  const displayMin = minutes > 0 ? `:${String(minutes).padStart(2, '0')}` : '';
  return `${displayHour}${displayMin}${period}`;
}

function buildHoursDisplay(hoursMap: HoursMap): { day: string; hours: string }[] {
  const result: { day: string; hours: string }[] = [];
  let closedStart: string | null = null;
  let closedEnd: string | null = null;

  for (const { key, label } of ALL_DAYS) {
    const range = hoursMap[key];
    if (!range) {
      if (!closedStart) closedStart = label;
      closedEnd = label;
    } else {
      // Flush any pending closed range
      if (closedStart) {
        const closedLabel = closedStart === closedEnd ? closedStart : `${closedStart.slice(0, 3)}–${closedEnd!.slice(0, 3)}`;
        result.push({ day: closedLabel, hours: 'Closed' });
        closedStart = null;
        closedEnd = null;
      }
      result.push({ day: label, hours: `${formatTime(range.open)} – ${formatTime(range.close)}` });
    }
  }
  // Flush trailing closed
  if (closedStart) {
    const closedLabel = closedStart === closedEnd ? closedStart : `${closedStart.slice(0, 3)}–${closedEnd!.slice(0, 3)}`;
    result.push({ day: closedLabel, hours: 'Closed' });
  }
  return result;
}

export default function LiveTracker() {
  const [tracker, setTracker] = useState<TrackerStatus | null>(null);
  const [hours, setHours] = useState<{ day: string; hours: string }[]>(getFormattedHours());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      try {
        const [trackerRes, hoursRes] = await Promise.all([
          supabase
            .from('tracker_status')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1)
            .single<TrackerStatus>(),
          supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'hours')
            .single(),
        ]);

        setTracker(trackerRes.data ?? null);

        if (hoursRes.data?.value) {
          const savedHours = hoursRes.data.value as HoursMap;
          setHours(buildHoursDisplay(savedHours));
        }
      } catch {
        setTracker(null);
      }
      setLoaded(true);
    }

    fetchData();
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!loaded) return null;

  const isLive = tracker?.is_live ?? false;
  const isTempClosed = !isLive && tracker?.location_name === 'TEMPORARILY CLOSED';

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
                    src={`https://maps.google.com/maps?q=${tracker.latitude},${tracker.longitude}&z=15&output=embed`}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
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
        ) : isTempClosed ? (
          <div className={styles.closedContent}>
            <p className={styles.closedMessage}>We&apos;re taking a break! Check back soon.</p>
            <div className={styles.contactInfo}>
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
              </tbody>
            </table>
            <p className={styles.seasonNote}>Late-night Saturdays (until 2am) during OU football &amp; spring sessions.</p>
            <div className={styles.contactInfo}>
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
