import { useCallback, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { COLUMNS, STATUS_COLORS } from '../constants';
import { sortCards, useJobData } from '../hooks/useJobData';
import {
  addJob,
  addResume,
  deleteJob,
  getAllResumes,
  putJob,
  replaceAllJobs,
  replaceAllResumes,
  setSetting,
} from '../db';
import JobColumn from './JobColumn';
import JobForm from './JobForm';
import ConfirmDialog from './ConfirmDialog';
import TopBar from './TopBar';

export default function App() {
  const {
    jobs,
    resumes,
    statusOrder,
    loading,
    setJobs,
    setResumes,
    setStatusOrder,
  } = useJobData();

  const [modal, setModal] = useState(null); // { mode: 'add'|'edit', job?, status? }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeDrag, setActiveDrag] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [sortPrefs, setSortPrefs] = useState({}); // status -> 'newest'|'oldest'|undefined
  const fileInputRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const notify = useCallback((msg) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const isColumnId = (id) => COLUMNS.some((c) => c.id === id);

  /* ------------------------------ CRUD --------------------------------- */

  const ensureResumeSaved = useCallback(
    async (name) => {
      if (!name || resumes.includes(name)) return;
      try {
        await addResume(name);
      } catch {
        /* already exists */
      }
      setResumes(await getAllResumes());
    },
    [resumes, setResumes],
  );

  async function handleSaveJob(payload, existing) {
    const job = {
      id: existing?.id ?? crypto.randomUUID(),
      ...payload,
    };
    if (existing) await putJob(job);
    else await addJob(job);
    await ensureResumeSaved(job.resume);
    setJobs((prev) =>
      existing ? prev.map((j) => (j.id === job.id ? job : j)) : [...prev, job],
    );
    setModal(null);
    notify(existing ? 'Job updated' : 'Job added');
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteJob(deleteTarget.id);
    setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
    setDeleteTarget(null);
    notify('Job deleted');
  }

  /* --------------------------- Manual order ---------------------------- */

  // Ids in a column, in render order: persisted manual order when present,
  // otherwise derived from current jobs (oldest first) so drags work on a
  // fresh board too.
  const orderIds = (status) => {
    if (statusOrder[status]?.length) return statusOrder[status];
    return jobs
      .filter((j) => j.status === status)
      .sort((a, b) => {
        const da = a.appliedAt ? new Date(a.appliedAt).getTime() : 0;
        const db = b.appliedAt ? new Date(b.appliedAt).getTime() : 0;
        return da - db;
      })
      .map((j) => j.id);
  };

  // Persist a column's manual ordering, but only when no date sort override
  // is active for that column.
  const persistManualOrder = useCallback(
    (status, ids) => {
      if (sortPrefs[status]) return;
      setSetting(`order/status/${status}`, ids);
    },
    [sortPrefs],
  );

  /* ------------------------------ DnD ---------------------------------- */

  function onDragStart(e) {
    setActiveDrag(jobs.find((j) => j.id === e.active.id) ?? null);
  }

  function onDragEnd({ active, over }) {
    setActiveDrag(null);
    if (!over) return;
    const moved = jobs.find((j) => j.id === active.id);
    if (!moved) return;

    const fromStatus = moved.status;
    let toStatus;
    let insertIndex = null;

    if (isColumnId(over.id)) {
      // Dropped on an empty part of a column: append to the end.
      toStatus = over.id;
    } else {
      const overJob = jobs.find((j) => j.id === over.id);
      if (!overJob) return;
      toStatus = overJob.status;
      const overIdx = orderIds(toStatus).indexOf(overJob.id);
      insertIndex = overIdx >= 0 ? overIdx : orderIds(toStatus).length;
    }
    if (!toStatus || toStatus === fromStatus && insertIndex === null) return;

    const fromIds = orderIds(fromStatus);
    const toIds = orderIds(toStatus);

    if (toStatus === fromStatus) {
      // Pure reorder within the same column.
      const oldIndex = fromIds.indexOf(moved.id);
      const newIndex = insertIndex ?? fromIds.length - 1;
      if (oldIndex < 0) return;
      const next = arrayMove(fromIds, oldIndex, newIndex);
      setStatusOrder((prev) => ({ ...prev, [fromStatus]: next }));
      persistManualOrder(fromStatus, next);
      return;
    }

    // Cross-column move.
    const nextFrom = fromIds.filter((id) => id !== moved.id);
    const nextTo = [...toIds];
    const at = insertIndex ?? nextTo.length;
    nextTo.splice(at, 0, moved.id);
    setJobs((prev) =>
      prev.map((j) => (j.id === moved.id ? { ...j, status: toStatus } : j)),
    );
    setStatusOrder((prev) => ({
      ...prev,
      [fromStatus]: nextFrom,
      [toStatus]: nextTo,
    }));
    persistManualOrder(fromStatus, nextFrom);
    persistManualOrder(toStatus, nextTo);
    putJob({ ...moved, status: toStatus });
    notify(
      `Moved to ${COLUMNS.find((c) => c.id === toStatus)?.label ?? toStatus}`,
    );
  }

  /* ------------------------- Export / Import --------------------------- */

  async function handleExport() {
    const payload = {
      app: 'job-tracker',
      version: 1,
      exportedAt: new Date().toISOString(),
      jobs,
      resumes,
      statusOrder,
      sortPrefs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Backup exported');
  }

  async function handleImportFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const rawJobs = Array.isArray(data.jobs) ? data.jobs : [];
      const rawResumes = Array.isArray(data.resumes) ? data.resumes : [];
      if (rawJobs.length === 0 && rawResumes.length === 0) {
        throw new Error('No jobs or resumes found in file');
      }
      const validStatuses = COLUMNS.map((c) => c.id);
      const normalized = rawJobs.map((job) => ({
        id: String(job.id ?? crypto.randomUUID()),
        company: String(job.company ?? ''),
        role: String(job.role ?? ''),
        url: String(job.url ?? ''),
        resume: String(job.resume ?? ''),
        appliedAt: job.appliedAt ?? '',
        salary: String(job.salary ?? ''),
        notes: String(job.notes ?? ''),
        status: validStatuses.includes(job.status) ? job.status : 'wishlist',
      }));
      await replaceAllJobs(normalized);
      await replaceAllResumes(rawResumes.map((r) => String(r)));
      setJobs(normalized);
      setResumes(rawResumes.map((r) => String(r)));
      if (data.statusOrder && typeof data.statusOrder === 'object') {
        setStatusOrder(data.statusOrder);
      }
      if (data.sortPrefs && typeof data.sortPrefs === 'object') {
        setSortPrefs(data.sortPrefs);
      }
      notify(`Imported ${normalized.length} jobs`);
    } catch (err) {
      console.error(err);
      notify(`Import failed: ${err.message}`);
    }
  }

  function setColumnSort(status, pref) {
    setSortPrefs((prev) => ({ ...prev, [status]: pref }));
  }

  /* ----------------------------- Render -------------------------------- */

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-neutral-400">
        Loading your board…
      </div>
    );
  }

  const grouped = {};
  for (const col of COLUMNS) {
    const columnJobs = jobs.filter((j) => j.status === col.id);
    grouped[col.id] = sortCards(columnJobs, sortPrefs[col.id], orderIds(col.id));
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <TopBar
        search={search}
        onSearchChange={setSearch}
        onAdd={() => setModal({ mode: 'add', status: 'wishlist' })}
        total={jobs.length}
        onExport={handleExport}
        onImport={() => fileInputRef.current?.click()}
      />

      <main className="min-h-0 flex-1 px-4 pb-4 pt-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragCancel={() => setActiveDrag(null)}
        >
          <div className="flex h-full items-stretch gap-4 overflow-x-auto pb-1">
            {COLUMNS.map((col) => (
              <JobColumn
                key={col.id}
                column={col}
                jobs={grouped[col.id]}
                search={search}
                onEdit={(job) => setModal({ mode: 'edit', job })}
                onDelete={setDeleteTarget}
                onAddToColumn={(status) => setModal({ mode: 'add', status })}
                sortPref={sortPrefs[col.id]}
                onSortPrefChange={setColumnSort}
              />
            ))}
          </div>
        </DndContext>

        <DragOverlay>
          {activeDrag && (
            <div className="w-[280px] rotate-2 rounded-lg border border-neutral-200 bg-white p-3 shadow-2xl dark:border-neutral-700 dark:bg-neutral-800">
              <span
                className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${
                  STATUS_COLORS[activeDrag.status] ?? 'bg-neutral-300'
                }`}
              />
              <p className="truncate text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                {activeDrag.company}
              </p>
              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                {activeDrag.role}
              </p>
            </div>
          )}
        </DragOverlay>
      </main>

      {modal && (
        <JobForm
          initial={modal.mode === 'edit' ? modal.job : null}
          status={modal.status}
          resumes={resumes}
          onSave={(payload) => handleSaveJob(payload, modal.job)}
          onClose={() => setModal(null)}
        />
      )}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete this job?"
          message={`“${deleteTarget.company} — ${deleteTarget.role}” will be permanently removed. This can't be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {toast && (
        <div className="pointer-events-none fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-lg dark:bg-neutral-100 dark:text-neutral-900">
          {toast}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImportFile}
      />
    </div>
  );
}
