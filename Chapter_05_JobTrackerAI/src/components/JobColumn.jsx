import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import JobCard from './JobCard';
import { STATUS_COLORS, STATUS_LABELS } from '../constants';

export default function JobColumn({
  column,
  jobs,
  search,
  onEdit,
  onDelete,
  onAddToColumn,
  sortPref,
  onSortPrefChange,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const filtered = jobs.filter((job) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      job.company.toLowerCase().includes(q) || job.role.toLowerCase().includes(q)
    );
  });

  return (
    <section
      className={`flex w-[280px] shrink-0 flex-col overflow-hidden rounded-xl border bg-neutral-100/80 transition-colors dark:bg-neutral-900/50 md:w-auto md:flex-1 ${
        isOver
          ? 'border-sky-400 bg-sky-50/60 dark:border-sky-500 dark:bg-sky-500/10'
          : 'border-neutral-200 dark:border-neutral-800'
      }`}
    >
      {/* Header */}
      <header className="flex items-center gap-2 px-3 pb-1 pt-3">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${
            STATUS_COLORS[column.id] ?? 'bg-neutral-400'
          }`}
          aria-hidden="true"
        />
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {STATUS_LABELS[column.id] ?? column.id}
        </h2>
        <span
          className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
            filtered.length
              ? 'bg-white text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'
              : 'bg-transparent text-neutral-400'
          }`}
        >
          {filtered.length}
        </span>
        <div className="ml-auto flex items-center gap-0.5">
          {sortPref && (
            <button
              type="button"
              onClick={() => onSortPrefChange(column.id, null)}
              title="Back to manual order"
              aria-label="Clear date sort"
              className="rounded p-1 text-neutral-400 hover:text-rose-500 dark:text-neutral-500"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={() => onAddToColumn(column.id)}
            title={`Add job to ${STATUS_LABELS[column.id]}`}
            aria-label={`Add job to ${STATUS_LABELS[column.id]}`}
            className="rounded p-1 text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Sort toggle */}
      <div className="flex items-center gap-1 px-3 pb-2">
        <button
          type="button"
          onClick={() =>
            onSortPrefChange(column.id, sortPref === 'newest' ? null : 'newest')
          }
          className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
            sortPref === 'newest'
              ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300'
              : 'text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300'
          }`}
          title="Sort by date applied (newest first)"
        >
          Newest
        </button>
        <button
          type="button"
          onClick={() =>
            onSortPrefChange(column.id, sortPref === 'oldest' ? null : 'oldest')
          }
          className={`rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
            sortPref === 'oldest'
              ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300'
              : 'text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300'
          }`}
          title="Sort by date applied (oldest first)"
        >
          Oldest
        </button>
      </div>

      {/* Scrollable cards */}
      <div
        ref={setNodeRef}
        className="scrollbar-thin min-h-0 flex-1 space-y-2 overflow-y-auto px-2 pb-2"
      >
        {filtered.length > 0 ? (
          <SortableContext
            items={filtered.map((j) => j.id)}
            strategy={verticalListSortingStrategy}
          >
            {filtered.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </SortableContext>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 py-10 text-center">
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              {search ? 'No matching jobs' : `No jobs in ${STATUS_LABELS[column.id]?.toLowerCase()}`}
            </p>
            {!search && (
              <button
                type="button"
                onClick={() => onAddToColumn(column.id)}
                className="text-xs font-medium text-sky-600 hover:underline dark:text-sky-400"
              >
                + Add a job
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
