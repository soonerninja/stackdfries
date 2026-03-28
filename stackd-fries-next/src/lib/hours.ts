import { siteConfig } from "./config";

type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
interface HoursRange {
  open: string;
  close: string;
}

const DAY_KEYS: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function getHoursForDate(date: Date): HoursRange | null {
  const dayIndex = date.getDay();
  const dayKey = DAY_KEYS[dayIndex];
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

export function isOpenNow(now: Date = new Date()): boolean {
  const hours = getHoursForDate(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();

  // Check if we're in today's open window
  if (hours) {
    const openMin = timeToMinutes(hours.open);
    const closeMin = timeToMinutes(hours.close);

    if (closeMin > openMin) {
      // Same-day hours (e.g. 12:00 - 23:00)
      if (nowMin >= openMin && nowMin < closeMin) return true;
    } else if (closeMin < openMin) {
      // Cross-midnight: only the "after open" part applies today
      // e.g. open 12:00, close 02:00 — after 12:00 today counts
      if (nowMin >= openMin) return true;
    }
  }

  // Check if yesterday's hours spill past midnight into now
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayHours = getHoursForDate(yesterday);
  if (yesterdayHours) {
    const yOpenMin = timeToMinutes(yesterdayHours.open);
    const yCloseMin = timeToMinutes(yesterdayHours.close);
    // Only applies if yesterday had cross-midnight hours
    if (yCloseMin < yOpenMin && nowMin < yCloseMin) {
      return true;
    }
  }

  return false;
}

export function getNextOpenTime(now: Date = new Date()): string {
  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(now);
    checkDate.setDate(checkDate.getDate() + i);
    const hours = getHoursForDate(checkDate);

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

export function getStatusText(now: Date = new Date()): { isOpen: boolean; text: string } {
  if (isOpenNow(now)) {
    return { isOpen: true, text: "Open Now" };
  }
  return { isOpen: false, text: getNextOpenTime(now) };
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
