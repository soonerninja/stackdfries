import { createClient } from '@/lib/supabase-server'
import { headers } from 'next/headers'
import Link from 'next/link'
import { logout } from './actions'
import styles from './layout.module.css'
import Toast from '@/components/admin/Toast'
import SessionCheck from '@/components/admin/SessionCheck'

const navLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/tracker', label: 'Tracker' },
  { href: '/admin/drops', label: 'Drops' },
  { href: '/admin/menu', label: 'Menu' },
  { href: '/admin/emails', label: 'Emails' },
  { href: '/admin/catering', label: 'Catering' },
  { href: '/admin/settings', label: 'Settings' },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerList = await headers()
  const pathname = headerList.get('x-next-pathname') || headerList.get('x-invoke-path') || ''

  // On the login page, just render children without the admin shell
  const isLoginPage = pathname.startsWith('/admin/login')

  if (isLoginPage) {
    return <>{children}</>
  }

  // Check auth for the admin shell
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If somehow no user (middleware should catch this, but safety check)
  if (!user) {
    return <>{children}</>
  }

  return (
    <div className={styles.shell}>
      <SessionCheck />
      <Toast />
      <div className={styles.topBar}>
        <Link href="/admin" className={styles.brand}>Stack&apos;d Admin</Link>
        <div className={styles.topBarActions}>
          <a href="/" target="_blank" rel="noopener noreferrer" className={styles.viewSiteLink}>
            View Site &rarr;
          </a>
          <form action={logout}>
            <button type="submit" className={styles.logoutBtn}>
              Logout
            </button>
          </form>
        </div>
      </div>
      <nav className={styles.nav}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  )
}
