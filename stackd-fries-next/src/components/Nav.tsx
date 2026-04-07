'use client';

import { useState, useEffect } from 'react';
import { siteConfig } from '@/lib/config';
import LiveStatusBadge from './LiveStatusBadge';
import DropBadge from './DropBadge';
import styles from './Nav.module.css';

export default function Nav() {
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
          <a href="#top" className={styles.logo}>
            STACK&apos;D <span className={styles.logoGold}>FRIES</span>
          </a>

          <div className={styles.desktopLinks}>
            <a href="#menu" className={styles.desktopLink}>Menu</a>
            <a href="#tracker" className={styles.desktopLink}>Find Us</a>
            <a href="#catering" className={styles.desktopLink}>Catering</a>
            <DropBadge className={styles.desktopLink} />
            <LiveStatusBadge />
            <a
              href={siteConfig.orderUrl}
              target="_blank"
              rel="noopener noreferrer"
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
        <a href="#menu" className={styles.overlayLink} onClick={closeMenu}>Menu</a>
        <a href="#tracker" className={styles.overlayLink} onClick={closeMenu}>Find Us</a>
        <a href="#catering" className={styles.overlayLink} onClick={closeMenu}>Catering</a>
        <DropBadge onClick={closeMenu} className={styles.overlayLink} />
        <a
          href={siteConfig.orderUrl}
          target="_blank"
          rel="noopener noreferrer"
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
