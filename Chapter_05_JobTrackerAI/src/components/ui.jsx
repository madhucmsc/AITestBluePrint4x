import { useEffect, useState } from 'react';
import { STATUS_COLORS, STATUS_LABELS } from '../constants';

export function StatusBadge({ status, className = '' }) {
  if (!status) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2 py-0.5 text-xs font-medium text-neutral-600 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700 ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_COLORS[status] ?? 'bg-neutral-400'}`} />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function EmptyState({ message, action }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
      <p className="text-xs text-neutral-400 dark:text-neutral-500">{message}</p>
      {action}
    </div>
  );
}

export function useEscape(onEscape) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onEscape();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onEscape]);
}
