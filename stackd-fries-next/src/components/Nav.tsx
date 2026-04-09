'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/lib/config';
import LiveStatusBadge from './LiveStatusBadge';
import DropBadge from './DropBadge';
import styles from './Nav.module.css';

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const linkPrefix = isHome ? '' : '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  // Smooth-scroll to an in-page section even when the URL hash is already set
  // (browser no-ops a second hash click otherwise). Falls through to default
  // navigation when we're on a different route.
  const handleHashClick = (hash: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return; // let the browser navigate to /#hash normally
    const id = hash.replace(/^#/, '');
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeMenu();
  };

  // Close on Escape key
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.inner}>
          <a
            href={isHome ? '#top' : '/'}
            onClick={(e) => {
              if (isHome) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className={styles.logo}
          >
            STACK&apos;D <span className={styles.logoGold}>FRIES</span>
          </a>

          <div className={styles.desktopLinks}>
            <a href={`${linkPrefix}#menu`} onClick={handleHashClick('#menu')} className={styles.desktopLink}>Menu</a>
            <a href={`${linkPrefix}#tracker`} onClick={handleHashClick('#tracker')} className={styles.desktopLink}>Find Us</a>
            <a href="/catering" className={styles.desktopLink}>Catering</a>
            <DropBadge className={styles.desktopLink} />
            <LiveStatusBadge />
            <a
              href={siteConfig.orderUrl}
              {...(siteConfig.orderUrl.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={`${styles.desktopLink} ${styles.orderLink}`}
            >
              Order
            </a>
          </div>

          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </nav>

      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`}
        role="dialog"
        aria-modal="true"
        onKeyDown={(e) => { if (e.key === 'Escape') closeMenu(); }}
      >
        <a
          href={`${linkPrefix}#menu`}
          className={styles.overlayLink}
          onClick={(e) => { handleHashClick('#menu')(e); closeMenu(); }}
        >
          Menu
        </a>
        <a
          href={`${linkPrefix}#tracker`}
          className={styles.overlayLink}
          onClick={(e) => { handleHashClick('#tracker')(e); closeMenu(); }}
        >
          Find Us
        </a>
        <a href="/catering" className={styles.overlayLink} onClick={closeMenu}>Catering</a>
        <DropBadge onClick={closeMenu} className={styles.overlayLink} />
        <a
          href={siteConfig.orderUrl}
          {...(siteConfig.orderUrl.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={styles.overlayLink}
          onClick={closeMenu}
        >
          Order
        </a>
        <div className={styles.overlaySocials}>
          <a
            href={siteConfig.social.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.overlaySocialLink}
            onClick={closeMenu}
          >
            TikTok
          </a>
          <span className={styles.overlaySocialDot}>·</span>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.overlaySocialLink}
            onClick={closeMenu}
          >
            Instagram
          </a>
          <span className={styles.overlaySocialDot}>·</span>
          <a
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.overlaySocialLink}
            onClick={closeMenu}
          >
            Facebook
          </a>
        </div>
      </div>
    </>
  );
}
