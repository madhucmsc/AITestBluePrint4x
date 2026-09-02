import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { daysSince, formatDate, STATUS_COLORS } from '../constants';

const LinkedInIcon = ({ className = 'h-3.5 w-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
  </svg>
);

export default function JobCard({ job, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id, data: { type: 'job', status: job.status } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1 : undefined,
  };

  const days = daysSince(job.appliedAt);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative cursor-grab rounded-lg border border-neutral-200 bg-white p-3 pl-4 shadow-sm select-none outline-none hover:border-neutral-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-sky-500 active:cursor-grabbing dark:border-neutral-700/70 dark:bg-neutral-800 dark:hover:border-neutral-600 ${
        isDragging ? 'shadow-lg' : ''
      }`}
      onClick={() => onEdit(job)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEdit(job);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Edit ${job.company} ${job.role}`}
    >
      {/* Status accent bar */}
      <span
        className={`absolute top-2 bottom-2 left-0 w-1 rounded-r-full ${
          STATUS_COLORS[job.status] ?? 'bg-neutral-300'
        }`}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-neutral-800 dark:text-neutral-100">
            {job.company}
          </p>
          <p className="truncate text-xs text-neutral-500 dark:text-neutral-400" title={job.role}>
            {job.role}
          </p>
        </div>

        <div
          className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noreferrer noopener"
              title="Open LinkedIn job"
              aria-label="Open LinkedIn job"
              className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-sky-600 dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-sky-400"
            >
              <LinkedInIcon />
            </a>
          )}
          <button
            type="button"
            title="Edit job"
            aria-label="Edit job"
            onClick={() => onEdit(job)}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793 3 14.172V17h2.828l8.38-8.379-2.829-2.828z" />
            </svg>
          </button>
          <button
            type="button"
            title="Delete job"
            aria-label="Delete job"
            onClick={() => onDelete(job)}
            className="rounded p-1 text-neutral-400 hover:bg-rose-50 hover:text-rose-600 dark:text-neutral-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 0 0-.9.553l-.57 1.14A1 1 0 0 1 6.613 4H4a1 1 0 0 0 0 2h1.09l.867 9.54A2 2 0 0 0 7.94 17.5h4.12a2 2 0 0 0 1.983-1.96l.867-9.54H16a1 1 0 1 0 0-2h-2.613a1 1 0 0 1-.917-.607l-.57-1.14A1 1 0 0 0 11 2H9zm2.5 5a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0V7zm-3 0a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0V7zm4 0a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0V7z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {(job.salary || job.resume || job.notes) && (
        <p className="line-clamp-2 mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          {[job.salary, job.notes].filter(Boolean).join(' · ') || '\u00A0'}
        </p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {job.resume && (
          <span className="max-w-[130px] truncate rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-400">
            {job.resume}
          </span>
        )}
        {job.appliedAt ? (
          <span className="ml-auto text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
            {formatDate(job.appliedAt)}
            {days !== null && days >= 0 && (
              <span className="ml-1 text-neutral-400 dark:text-neutral-500">
                · {days === 0 ? 'today' : `${days}d`}
              </span>
            )}
          </span>
        ) : (
          <span className="ml-auto text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
            Not applied yet
          </span>
        )}
      </div>
    </div>
  );
}
