import { useEffect, useReducer, useRef } from 'react';
import type { SceneCatalogue } from '../contracts/integration.ts';
import { createSession, persistSessionRecords, reduceSession, selectPracticeView, type PracticeAction } from './coordinator.ts';
import { loadRecords, readBrowserStorage } from '../records/localRecords.ts';

/** The sole owner of language, answer state, navigation and local persistence. */
export function usePracticeCoordinator(scenes: SceneCatalogue) {
  const storage = useRef(readBrowserStorage());
  const [session, dispatch] = useReducer(
    (state: ReturnType<typeof createSession>, action: PracticeAction) => reduceSession(state, action, scenes),
    undefined,
    () => createSession(scenes, loadRecords(storage.current), Math.random())
  );
  const handledRevision = useRef(0);
  useEffect(() => {
    if (session.saveRevision <= handledRevision.current) return;
    handledRevision.current = session.saveRevision;
    // Corrupt storage is preserved; no write until explicit recovery in a future scope.
    const result = persistSessionRecords(session, storage.current);
    if (!result.saved) dispatch({ type: 'storage-result', revision: session.saveRevision, status: result.status });
  }, [session.saveRevision, session.records, session.storageStatus]);

  const view = selectPracticeView(session, scenes);
  const sceneId = view?.scene.id ?? '';
  return { session, dispatch, view, sceneId };
}
