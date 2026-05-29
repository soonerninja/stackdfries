import { cache } from 'react';
import { createClient } from '@/lib/supabase-server';

export type PopupSetting = {
  enabled: boolean;
  title: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
};

const EMPTY_POPUP: PopupSetting = {
  enabled: false,
  title: '',
  body: '',
  ctaLabel: '',
  ctaUrl: '',
};

function asString(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

/**
 * Reads the homepage promo popup from the `site_settings` key/value table
 * (key = "popup"). Request-cached so layout/page share a single fetch.
 */
export const getPopup = cache(async (): Promise<PopupSetting> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'popup')
      .limit(1)
      .single();

    const value = data?.value as Partial<PopupSetting> | undefined;
    if (value) {
      return {
        enabled: Boolean(value.enabled),
        title: asString(value.title),
        body: asString(value.body),
        ctaLabel: asString(value.ctaLabel),
        ctaUrl: asString(value.ctaUrl),
      };
    }
  } catch {
    // Table/row missing or read failed — fall back to "off".
  }
  return EMPTY_POPUP;
});

/** The popup only shows when enabled AND it has a title or body. */
export function popupActive(popup: PopupSetting): boolean {
  return popup.enabled && (popup.title.trim().length > 0 || popup.body.trim().length > 0);
}

/**
 * A stable id derived from the popup's content. When the admin edits the
 * popup, this changes, so a visitor who already dismissed the old promo
 * will see the new one once (matches "once per visitor, re-show on change").
 */
export function popupVersion(popup: PopupSetting): string {
  const raw = [popup.title, popup.body, popup.ctaLabel, popup.ctaUrl].join('').trim();
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash + raw.charCodeAt(i)) & 0xffffffff;
  }
  return (hash >>> 0).toString(36);
}
