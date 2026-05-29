import { cache } from 'react';
import { createClient } from '@/lib/supabase-server';

export type BannerSetting = {
  enabled: boolean;
  text: string;
};

const EMPTY_BANNER: BannerSetting = { enabled: false, text: '' };

/**
 * Reads the site-wide announcement banner from the `site_settings` key/value
 * table (key = "banner"). Wrapped in React `cache` so the layout and the
 * <OpeningBanner /> component share a single fetch per request.
 */
export const getBanner = cache(async (): Promise<BannerSetting> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'banner')
      .limit(1)
      .single();

    const value = data?.value as Partial<BannerSetting> | undefined;
    if (value && typeof value.text === 'string') {
      return { enabled: Boolean(value.enabled), text: value.text };
    }
  } catch {
    // Table/row missing or read failed — fall back to "off".
  }
  return EMPTY_BANNER;
});

/** The banner only shows when it is enabled AND has non-whitespace text. */
export function bannerActive(banner: BannerSetting): boolean {
  return banner.enabled && banner.text.trim().length > 0;
}
