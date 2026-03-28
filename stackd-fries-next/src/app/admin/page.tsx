import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import styles from './dashboard.module.css'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch tracker status
  const { data: tracker } = await supabase
    .from('tracker_status')
    .select('is_live')
    .limit(1)
    .single()

  // Fetch active menu items count
  const { count: menuCount } = await supabase
    .from('menu_items')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  // Fetch email signups count
  const { count: emailCount } = await supabase
    .from('email_signups')
    .select('*', { count: 'exact', head: true })

  // Fetch active drop
  const { data: activeDrop } = await supabase
    .from('current_drop')
    .select('id, name')
    .eq('is_active', true)
    .limit(1)
    .single()

  const isLive = tracker?.is_live ?? false
  const hasActiveDrop = !!activeDrop

  return (
    <div>
      <p className={styles.greeting}>Welcome back.</p>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${isLive ? styles.statCardLive : styles.statCardOffline}`}>
          <div className={styles.statLabel}>Truck Status</div>
          <div className={`${styles.statValue} ${isLive ? styles.statValueLive : styles.statValueOffline}`}>
            {isLive ? 'LIVE' : 'OFFLINE'}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Active Menu Items</div>
          <div className={styles.statValue}>{menuCount ?? 0}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statLabel}>Email Signups</div>
          <div className={`${styles.statValue} ${styles.statValueLarge}`}>{emailCount ?? 0}</div>
        </div>

        <div className={`${styles.statCard} ${hasActiveDrop ? styles.statCardDrop : ''}`}>
          <div className={styles.statLabel}>Active Drop</div>
          <div className={styles.statValue}>
            {hasActiveDrop ? activeDrop.name : 'None'}
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <div className={styles.quickActionsTitle}>Quick Actions</div>
        <div className={styles.actionLinks}>
          <Link href="/admin/tracker" className={styles.actionLink}>
            {isLive ? 'Go Offline' : 'Go Live'}
          </Link>
          <Link href="/admin/drops" className={styles.actionLink}>
            Manage Drops
          </Link>
          <Link href="/admin/menu" className={styles.actionLink}>
            Edit Menu
          </Link>
          <Link href="/admin/emails" className={styles.actionLink}>
            View Emails
          </Link>
          <Link href="/admin/settings" className={styles.actionLink}>
            Settings
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.actionLinkSecondary}>
            View Public Site
          </a>
        </div>
      </div>
    </div>
  )
}
