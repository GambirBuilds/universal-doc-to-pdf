import { HistoryRecord } from '../types';

const STORAGE_KEY = 'universal_pdf_converter_history_v1';
const MAX_HISTORY_ITEMS = 50;

/**
 * Loads conversion history records from localStorage
 */
export function getHistoryRecords(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Adds a new conversion record to local storage (metadata only)
 */
export function addHistoryRecord(record: HistoryRecord): void {
  try {
    const current = getHistoryRecords();
    const updated = [record, ...current.filter((item) => item.id !== record.id)].slice(
      0,
      MAX_HISTORY_ITEMS
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Non-blocking in incognito or private storage limits
  }
}

/**
 * Deletes a single history record by ID
 */
export function deleteHistoryRecord(id: string): void {
  try {
    const current = getHistoryRecords();
    const filtered = current.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // Non-blocking
  }
}

/**
 * Clears all local history records
 */
export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Non-blocking
  }
}
