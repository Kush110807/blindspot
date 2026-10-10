import type { LockedAttempt } from '../engine/attempt.ts';

export const STORAGE_KEY = 'blindspot.records.v1';
export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export type StorageStatus = 'available' | 'unavailable' | 'corrupt';
export interface LoadedRecords {
  readonly records: readonly LockedAttempt[];
  readonly status: StorageStatus;
}
export interface SaveResult { readonly saved: boolean; readonly status: StorageStatus }

function recordValid(r: unknown): r is LockedAttempt {
  if (!r || typeof r !== 'object') return false;
  const p = r as Record<string, unknown>;
  const selection = p.regionSelection;
  const selectionValid = !!selection && typeof selection === 'object' && (
    (selection as Record<string,unknown>).kind === 'none' ||
    ((selection as Record<string,unknown>).kind === 'region' &&
      typeof (selection as Record<string,unknown>).regionId === 'string')
  );
  const order = p.displayedOrder as Record<string, unknown> | undefined;
  return p.recordVersion === 1 && p.schemaVersion === 1 &&
    typeof p.sceneId === 'string' && typeof p.sceneVersion === 'string' &&
    (p.purpose === 'training' || p.purpose === 'assessment') &&
    typeof p.responseId === 'string' && typeof p.reasonId === 'string' &&
    typeof p.lockedAt === 'string' && selectionValid && !!order &&
    Array.isArray(order.responses) && order.responses.every(x => typeof x === 'string') &&
    Array.isArray(order.reasons) && order.reasons.every(x => typeof x === 'string') &&
    order.responses.includes(p.responseId) && order.reasons.includes(p.reasonId);
}
export function loadRecords(storage: KeyValueStorage | null): LoadedRecords {
  if (!storage) return { records: [], status: 'unavailable' };
  let raw: string | null;
  try { raw = storage.getItem(STORAGE_KEY); }
  catch { return { records: [], status: 'unavailable' }; }
  if (raw === null) return { records: [], status: 'available' };
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object' || (data as Record<string, unknown>).formatVersion !== 1 ||
        !Array.isArray((data as Record<string, unknown>).attempts) ||
        !(data as { attempts: unknown[] }).attempts.every(recordValid)) return { records: [], status: 'corrupt' };
    return { records: (data as { attempts: LockedAttempt[] }).attempts, status: 'available' };
  } catch { return { records: [], status: 'corrupt' }; }
}
export function saveRecords(storage: KeyValueStorage | null, records: readonly LockedAttempt[]): SaveResult {
  if (!storage) return { saved: false, status: 'unavailable' };
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify({ formatVersion: 1, attempts: records }));
    return { saved: true, status: 'available' };
  } catch { return { saved: false, status: 'unavailable' }; }
}
export function readBrowserStorage(): KeyValueStorage | null {
  try { return typeof window !== 'undefined' ? window.localStorage : null; }
  catch { return null; }
}
