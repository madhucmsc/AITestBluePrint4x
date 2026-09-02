import { useCallback, useEffect, useState } from 'react';
import {
  getAllJobs,
  getAllResumes,
  getSetting,
  seedJobsIfEmpty,
  seedResumesIfEmpty,
} from '../db';
import { DEFAULT_RESUMES } from '../constants';

// Fallback seed list used only if the resume store is somehow emptied.
const FALLBACK_RESUMES = DEFAULT_RESUMES;

export const VALID_STATUSES = [
  'wishlist',
  'applied',
  'follow-up',
  'interview',
  'offer',
  'rejected',
];

export function statusOrderKey(status) {
  return `order/status/${status}`;
}

// Sorted by the user's column preference; when no explicit sort is set,
// cards fall back to the manual drag-and-drop order (ordered id array).
export function sortCards(cards, pref, statusOrder) {
  const copy = [...cards];
  if (pref === 'newest') {
    copy.sort(
      (a, b) =>
        (b.appliedAt ? new Date(b.appliedAt).getTime() : 0) -
        (a.appliedAt ? new Date(a.appliedAt).getTime() : 0),
    );
  } else if (pref === 'oldest') {
    copy.sort(
      (a, b) =>
        (a.appliedAt ? new Date(a.appliedAt).getTime() : 0) -
        (b.appliedAt ? new Date(b.appliedAt).getTime() : 0),
    );
  } else if (statusOrder && statusOrder.length > 0) {
    const rank = (id) => {
      const i = statusOrder.indexOf(id);
      return i < 0 ? Number.MAX_SAFE_INTEGER : i;
    };
    copy.sort((a, b) => rank(a.id) - rank(b.id));
  }
  return copy;
}

export function useJobData() {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState(FALLBACK_RESUMES);
  const [statusOrder, setStatusOrder] = useState({}); // status -> ordered id[]
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const [jobRows, resumeRows] = await Promise.all([
      getAllJobs(),
      getAllResumes(),
    ]);
    const order = {};
    for (const status of VALID_STATUSES) {
      const ids = await getSetting(statusOrderKey(status));
      if (Array.isArray(ids)) order[status] = ids;
    }
    setJobs(jobRows);
    setResumes(resumeRows.length ? resumeRows : FALLBACK_RESUMES);
    setStatusOrder(order);
    setLoading(false);
  }, []);

  // Initial load + seed defaults on first run.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await Promise.all([seedResumesIfEmpty(), seedJobsIfEmpty()]);
      } catch (err) {
        console.error('Job tracker init failed:', err);
      }
      if (!cancelled) await reload();
    })();
    return () => {
      cancelled = true;
    };
  }, [reload]);

  return {
    jobs,
    resumes,
    statusOrder,
    loading,
    setJobs,
    setResumes,
    setStatusOrder,
    reload,
  };
}
