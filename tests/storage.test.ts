import test from 'node:test';
import assert from 'node:assert/strict';
import { loadRecords, saveRecords, STORAGE_KEY } from '../src/records/localRecords.ts';
import { beginAnswering, chooseReason, chooseRegion, chooseResponse, createAttempt, lockAttempt } from '../src/engine/attempt.ts';
import { fixture } from './fixture.ts';

test('local record round-trip preserves locked order and IDs', () => {
  const items = new Map<string, string>();
  const store = { getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => { items.set(key, value); } };
  const scene = fixture();
  let s = beginAnswering(createAttempt(scene, () => 0.1));
  s = chooseReason(chooseResponse(chooseRegion(s, { kind: 'region', regionId: 'left-edge' }, scene), 'wait', scene), 'limited-view', scene);
  const record = lockAttempt(s, scene).locked;
  assert.ok(record);
  assert.deepEqual(saveRecords(store, [record]), { saved: true, status: 'available' });
  assert.deepEqual(loadRecords(store), { status: 'available', records: [record] });
});
test('corrupt records and storage exceptions return a safe fallback', () => {
  const corrupt = { getItem: () => '{not-json', setItem: () => {} };
  assert.deepEqual(loadRecords(corrupt), { records: [], status: 'corrupt' });
  const fail = { getItem: (): string => { throw new Error('blocked'); },
    setItem: (): void => { throw new Error('blocked'); } };
  assert.deepEqual(loadRecords(fail), { records: [], status: 'unavailable' });
  assert.deepEqual(saveRecords(fail, []), { saved: false, status: 'unavailable' });
  assert.deepEqual(loadRecords(null), { records: [], status: 'unavailable' });
  assert.deepEqual(saveRecords(null, []), { saved: false, status: 'unavailable' });
});
test('unsupported record format does not silently appear as valid data', () => {
  const store = { getItem: (key: string) => key === STORAGE_KEY ? JSON.stringify({ formatVersion: 2, attempts: [] }) : null,
    setItem: () => {} };
  assert.equal(loadRecords(store).status, 'corrupt');
});
