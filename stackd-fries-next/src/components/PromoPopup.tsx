import { getPopup, popupActive, popupVersion } from '@/lib/popup';
import PromoPopupClient from './PromoPopupClient';

export default async function PromoPopup() {
  const popup = await getPopup();
  if (!popupActive(popup)) return null;

  return (
    <PromoPopupClient
      title={popup.title}
      body={popup.body}
      ctaLabel={popup.ctaLabel}
      ctaUrl={popup.ctaUrl}
      version={popupVersion(popup)}
    />
  );
}
