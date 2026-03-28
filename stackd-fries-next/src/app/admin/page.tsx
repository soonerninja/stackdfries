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

  // Fetch recent email signups
  const { data: recentEmails, error: recentError } = await supabase
    .from('email_signups')
    .select('email, signed_up_at')
    .order('signed_up_at', { ascending: false })
    .limit(5)

  console.log('recentEmails:', recentEmails, 'error:', recentError)

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
          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.actionLinkSecondary}>
            View Public Site
          </a>
        </div>
      </div>

      <div className={styles.recentSection}>
        <div className={styles.recentTitle}>Recent Signups</div>
        {recentEmails && recentEmails.length > 0 ? (
          recentEmails.map((signup: { email: string; signed_up_at: string }, i: number) => (
            <div key={i} className={styles.recentItem}>
              <span className={styles.recentEmail}>{signup.email}</span>
              <span className={styles.recentDate}>
                {new Date(signup.signed_up_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            {recentError ? `Error: ${recentError.message}` : 'No signups yet'}
          </div>
        )}
      </div>
    </div>
  )
}
