'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-browser';
import styles from './DropBadge.module.css';

interface DropBadgeProps {
  onClick?: () => void;
  className?: string;
}

export default function DropBadge({ onClick, className }: DropBadgeProps) {
  const [hasActiveDrop, setHasActiveDrop] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function fetchDrop() {
      try {
        const { data } = await supabase
          .from('current_drop')
          .select('*')
          .eq('is_active', true)
          .limit(1)
          .single();

        setHasActiveDrop(!!data);
      } catch {
        setHasActiveDrop(false);
      }
    }

    fetchDrop();
  }, []);

  if (!hasActiveDrop) return null;

  return (
    <a
      href="#drop"
      className={`${styles.dropLink} ${className ?? ''}`}
      onClick={onClick}
    >
      THE DROP
    </a>
  );
}
