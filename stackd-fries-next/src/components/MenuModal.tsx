'use client';

import { useState, useEffect, useCallback } from 'react';
import { siteConfig } from '@/lib/config';
import type { MenuItem } from '@/types/database';
import styles from './MenuModal.module.css';

interface MenuModalProps {
  item: MenuItem;
  onClose: () => void;
}

export default function MenuModal({ item, onClose }: MenuModalProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const allImages: string[] = [];
  if (item.images && item.images.length > 0) {
    allImages.push(...item.images);
  } else if (item.image_url) {
    allImages.push(item.image_url);
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function prevImage() {
    setCurrentImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }

  function nextImage() {
    setCurrentImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          &#x2715;
        </button>

        {allImages.length > 0 && (
          <div className={styles.carousel}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={allImages[currentImage]}
              alt={item.name}
              className={styles.carouselImg}
            />
            {allImages.length > 1 && (
              <>
                <button
                  className={`${styles.arrow} ${styles.arrowLeft}`}
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  &#8249;
                </button>
                <button
                  className={`${styles.arrow} ${styles.arrowRight}`}
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  &#8250;
                </button>
              </>
            )}
          </div>
        )}

        {allImages.length > 1 && (
          <div className={styles.dots}>
            {allImages.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === currentImage ? styles.dotActive : ''}`}
                onClick={() => setCurrentImage(i)}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}

        {item.video_url && (
          <video
            className={styles.video}
            src={item.video_url}
            autoPlay
            muted
            loop
            playsInline
          />
        )}

        <div className={styles.body}>
          <div className={styles.name}>{item.name}</div>
          <div className={styles.price}>${item.price.toFixed(2)}</div>
          {item.description && (
            <p className={styles.description}>{item.description}</p>
          )}
          <a
            href={siteConfig.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.orderBtn}
          >
            Order Now
          </a>
        </div>
      </div>
    </div>
  );
}
