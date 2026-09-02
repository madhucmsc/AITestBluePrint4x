// Kanban columns in display order. `order` is the persisted sort position
// used to keep a stable column ordering across reloads.
export const COLUMNS = [
  { id: 'wishlist', label: 'Wishlist', order: 0 },
  { id: 'applied', label: 'Applied', order: 1 },
  { id: 'follow-up', label: 'Follow-up', order: 2 },
  { id: 'interview', label: 'Interview', order: 3 },
  { id: 'offer', label: 'Offer', order: 4 },
  { id: 'rejected', label: 'Rejected', order: 5 },
];

export const STATUS_LABELS = Object.fromEntries(COLUMNS.map((c) => [c.id, c.label]));

export const STATUS_ORDER = Object.fromEntries(COLUMNS.map((c) => [c.id, c.order]));

// Column accent + subtle tint used for the card left border and column dot.
export const STATUS_COLORS = {
  wishlist: 'bg-slate-400',
  applied: 'bg-sky-500',
  'follow-up': 'bg-amber-400',
  interview: 'bg-violet-500',
  offer: 'bg-emerald-500',
  rejected: 'bg-rose-500',
};

// Pre-seeded resume names that also populate the dropdown datalist.
export const DEFAULT_RESUMES = ['SDE_Resume_v3', 'QA_Lead_Resume'];

// Simple local date formatting for "date applied" display.
export const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : DATE_FORMATTER.format(d);
}

export function daysSince(iso) {
  if (!iso) return null;
  const start = new Date(iso);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((today - start) / 86_400_000);
  return Number.isNaN(diff) ? null : diff;
}

// Persisted sort preference per column: 'newest' | 'oldest' | null (custom/manual).
export const SORT_PREFERENCES = {
  newest: 'newest',
  oldest: 'oldest',
};
