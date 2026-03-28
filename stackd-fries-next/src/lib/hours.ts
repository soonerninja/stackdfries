import { siteConfig } from "./config";

type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
interface HoursRange {
  open: string;
  close: string;
}
export type HoursMap = Partial<Record<DayKey, HoursRange>>;

const DAY_KEYS: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function getHoursForDate(date: Date, dynamicHours?: HoursMap): HoursRange | null {
  const dayIndex = date.getDay();
  const dayKey = DAY_KEYS[dayIndex];

  // If dynamic hours from Supabase are provided, use those
  if (dynamicHours) {
    return dynamicHours[dayKey] || null;
  }

  // Fall back to config with seasonal overrides
  const month = date.getMonth() + 1;
  for (const override of siteConfig.hours.seasonalOverrides) {
    if (override.months.includes(month)) {
      const overrideHours = (override.overrides as Record<string, HoursRange>)[dayKey];
      if (overrideHours) return overrideHours;
    }
  }

  const defaultHours = (siteConfig.hours.default as Record<string, HoursRange>)[dayKey];
  return defaultHours || null;
}

function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return { hours, minutes };
}

function timeToMinutes(timeStr: string): number {
  const { hours, minutes } = parseTime(timeStr);
  return hours * 60 + minutes;
}

export function isOpenNow(now: Date = new Date(), dynamicHours?: HoursMap): boolean {
  const hours = getHoursForDate(now, dynamicHours);
  const nowMin = now.getHours() * 60 + now.getMinutes();

  if (hours) {
    const openMin = timeToMinutes(hours.open);
    const closeMin = timeToMinutes(hours.close);

    if (closeMin > openMin) {
      if (nowMin >= openMin && nowMin < closeMin) return true;
    } else if (closeMin < openMin) {
      if (nowMin >= openMin) return true;
    }
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayHours = getHoursForDate(yesterday, dynamicHours);
  if (yesterdayHours) {
    const yOpenMin = timeToMinutes(yesterdayHours.open);
    const yCloseMin = timeToMinutes(yesterdayHours.close);
    if (yCloseMin < yOpenMin && nowMin < yCloseMin) {
      return true;
    }
  }

  return false;
}

export function getNextOpenTime(now: Date = new Date(), dynamicHours?: HoursMap): string {
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(checkDate.getDate() + i);
    const hours = getHoursForDate(checkDate, dynamicHours);

    if (!hours) continue;

    const openMin = timeToMinutes(hours.open);
    const nowMin = now.getHours() * 60 + now.getMinutes();

    if (i === 0 && nowMin < openMin) {
      const { hours: h, minutes: m } = parseTime(hours.open);
      const period = h >= 12 ? "pm" : "am";
      const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const displayMin = m > 0 ? `:${String(m).padStart(2, "0")}` : "";
      const dayName = DAY_KEYS[checkDate.getDay()];
      const dayLabel = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      return `Opens ${dayLabel} ${displayHour}${displayMin}${period}`;
    }

    if (i > 0) {
      const { hours: h, minutes: m } = parseTime(hours.open);
      const period = h >= 12 ? "pm" : "am";
      const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const displayMin = m > 0 ? `:${String(m).padStart(2, "0")}` : "";
      const dayName = DAY_KEYS[checkDate.getDay()];
      const dayLabel = dayName.charAt(0).toUpperCase() + dayName.slice(1);
      return `Opens ${dayLabel} ${displayHour}${displayMin}${period}`;
    }
  }

  return "Check back soon";
}

export function getStatusText(now: Date = new Date(), dynamicHours?: HoursMap): { isOpen: boolean; text: string } {
  if (isOpenNow(now, dynamicHours)) {
    return { isOpen: true, text: "Open Now" };
  }
  return { isOpen: false, text: getNextOpenTime(now, dynamicHours) };
}

export function getFormattedHours(): { day: string; hours: string }[] {
  const displayDays: { key: DayKey; label: string }[] = [
    { key: "thu", label: "Thursday" },
    { key: "fri", label: "Friday" },
    { key: "sat", label: "Saturday" },
    { key: "sun", label: "Sunday" },
  ];

  return displayDays.map(({ key, label }) => {
    const range = (siteConfig.hours.default as Record<string, HoursRange>)[key];
    if (!range) return { day: label, hours: "Closed" };

    const format = (t: string) => {
      const { hours: h, minutes: m } = parseTime(t);
      const period = h >= 12 ? "pm" : "am";
      const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const displayMin = m > 0 ? `:${String(m).padStart(2, "0")}` : "";
      return `${displayHour}${displayMin}${period}`;
    };

    return { day: label, hours: `${format(range.open)} – ${format(range.close)}` };
  });
}
