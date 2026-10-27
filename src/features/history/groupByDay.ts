import { format, isToday, isYesterday } from 'date-fns';
import i18n from 'i18next';
import '@/i18n';
import { formatLongDate } from '@/utils/dates';
import type { HistoryEntry } from './types';

export interface HistoryDayGroup {
  key: string; // yyyy-MM-dd (stable, language-independent)
  label: string;
  entries: HistoryEntry[];
}

function labelFor(date: Date): string {
  if (isToday(date)) return i18n.t('history.days.today');
  if (isYesterday(date)) return i18n.t('history.days.yesterday');
  return formatLongDate(date);
}

/** Expects entries already sorted newest-first; keeps that order. */
export function groupByDay(entries: HistoryEntry[]): HistoryDayGroup[] {
  const groups: HistoryDayGroup[] = [];
  for (const entry of entries) {
    const date = new Date(entry.createdAt);
    const key = format(date, 'yyyy-MM-dd');
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.entries.push(entry);
    } else {
      groups.push({ key, label: labelFor(date), entries: [entry] });
    }
  }
  return groups;
}