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
  const pathname =
    headerList.get('x-pathname') ||
    headerList.get('x-next-pathname') ||
    headerList.get('x-invoke-path') ||
    ''

  // The login page renders without the admin shell. Every other /admin route
  // is auth-protected by the middleware (it redirects unauthenticated users
  // to /admin/login), so by the time we render here the user is signed in and
  // the shell should always show — no fragile server-side session re-check.
  if (pathname.startsWith('/admin/login')) {
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
