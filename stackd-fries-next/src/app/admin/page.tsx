import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import styles from './dashboard.module.css'

export const dynamic = 'force-dynamic'

function relativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHrs = Math.floor(diffMin / 60)
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 30) return `${diffDays}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

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
  const { data: recentEmails } = await supabase
    .from('email_signups')
    .select('email, signed_up_at')
    .order('signed_up_at', { ascending: false })
    .limit(5)

  // Fetch active drop
  const { data: activeDrop } = await supabase
    .from('current_drop')
    .select('id, name')
    .eq('is_active', true)
    .limit(1)
    .single()

  // Page view stats (wrapped in try/catch in case table doesn't exist)
  let todayViews = 0
  let weekViews = 0
  let totalViews = 0
  let topPages: { page: string; count: number }[] = []

  try {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [todayRes, weekRes, totalRes, recentPagesRes] = await Promise.all([
      supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayStart),
      supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo),
      supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('page_views')
        .select('page')
        .order('created_at', { ascending: false })
        .limit(1000),
    ])

    todayViews = todayRes.count ?? 0
    weekViews = weekRes.count ?? 0
    totalViews = totalRes.count ?? 0

    // Group pages client-side
    if (recentPagesRes.data) {
      const counts: Record<string, number> = {}
      for (const row of recentPagesRes.data) {
        counts[row.page] = (counts[row.page] || 0) + 1
      }
      topPages = Object.entries(counts)
        .map(([page, count]) => ({ page, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    }
  } catch {
    // page_views table may not exist yet — dashboard still works
  }

  const isLive = tracker?.is_live ?? false
  const hasActiveDrop = !!activeDrop
  const maxPageCount = topPages.length > 0 ? topPages[0].count : 1

  return (
    <div>
      <p className={styles.greeting}>Welcome back.</p>

      {/* Quick Actions */}
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

      {/* Core stat cards */}
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

      {/* Page view stats */}
      <div className={styles.viewsGrid}>
        <div className={styles.viewCard}>
          <div className={styles.statLabel}>Today&apos;s Views</div>
          <div className={styles.statValue}>{todayViews}</div>
        </div>
        <div className={styles.viewCard}>
          <div className={styles.statLabel}>This Week</div>
          <div className={styles.statValue}>{weekViews}</div>
        </div>
        <div className={styles.viewCard}>
          <div className={styles.statLabel}>Total Views</div>
          <div className={`${styles.statValue} ${styles.statValueLarge}`}>{totalViews}</div>
        </div>
      </div>

      {/* Two-column layout: Recent Activity + Top Pages */}
      <div className={styles.analyticsRow}>
        {/* Recent Activity */}
        <div className={styles.recentSection}>
          <div className={styles.recentTitle}>Recent Signups</div>
          {recentEmails && recentEmails.length > 0 ? (
            recentEmails.map((signup: { email: string; signed_up_at: string }, i: number) => (
              <div key={i} className={styles.recentItem}>
                <span className={styles.recentEmail}>{signup.email}</span>
                <span className={styles.recentDate}>
                  {relativeTime(signup.signed_up_at)}
                </span>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>No signups yet</div>
          )}
        </div>

        {/* Top Pages */}
        <div className={styles.recentSection}>
          <div className={styles.recentTitle}>Top Pages</div>
          {topPages.length > 0 ? (
            topPages.map((entry, i) => (
              <div key={i} className={styles.topPageItem}>
                <div className={styles.topPageInfo}>
                  <span className={styles.topPageName}>{entry.page}</span>
                  <span className={styles.topPageCount}>{entry.count}</span>
                </div>
                <div className={styles.topPageBarTrack}>
                  <div
                    className={styles.topPageBar}
                    style={{ width: `${(entry.count / maxPageCount) * 100}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>No page view data yet</div>
          )}
        </div>
      </div>

    </div>
  )
}
