import { useMemo, useState } from 'react';
import { COLUMNS, STATUS_COLORS, STATUS_LABELS } from '../constants';
import { useEscape } from './ui';

const inputCls =
  'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder-neutral-500 dark:focus:border-sky-500';
const labelCls =
  'mb-1 block text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400';

export default function JobForm({ initial, status, resumes, onSave, onClose }) {
  const isEdit = Boolean(initial?.id);
  const nowIso = useMemo(() => new Date().toISOString(), []);

  const [form, setForm] = useState(() => {
    const j = initial ?? {};
    return {
      company: j.company ?? '',
      role: j.role ?? '',
      url: j.url ?? '',
      resume: j.resume ?? '',
      appliedAt: j.appliedAt
        ? new Date(j.appliedAt).toISOString().slice(0, 10)
        : nowIso.slice(0, 10),
      salary: j.salary ?? '',
      notes: j.notes ?? '',
      status: j.status ?? status ?? COLUMNS[0].id,
    };
  });
  const [errors, setErrors] = useState({});

  useEscape(onClose);

  function update(patch) {
    setForm((f) => ({ ...f, ...patch }));
  }

  function validate() {
    const next = {};
    if (!form.company.trim()) next.company = 'Company name is required';
    if (!form.role.trim()) next.role = 'Job title / role is required';
    if (form.url.trim() && !isValidUrl(form.url.trim())) {
      next.url = 'Enter a valid URL (e.g. https://www.linkedin.com/jobs/view/...)';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      company: form.company.trim(),
      role: form.role.trim(),
      url: form.url.trim(),
      resume: form.resume,
      appliedAt: form.appliedAt
        ? new Date(`${form.appliedAt}T00:00:00`).toISOString()
        : '',
      salary: form.salary.trim(),
      notes: form.notes.trim(),
      status: form.status,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm sm:items-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Edit job' : 'Add a new job'}
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        className="my-8 w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              {isEdit ? 'Edit job' : 'Add a new job'}
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
              {isEdit ? `Updating ${initial.company}` : 'Track a role you found on LinkedIn'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            aria-label="Close"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Company *" error={errors.company}>
            <input
              className={inputCls}
              value={form.company}
              onChange={(e) => update({ company: e.target.value })}
              placeholder="Acme Corp"
              autoFocus
              required
            />
          </Field>
          <Field label="Job title / role *" error={errors.role}>
            <input
              className={inputCls}
              value={form.role}
              onChange={(e) => update({ role: e.target.value })}
              placeholder="Senior Frontend Engineer"
              required
            />
          </Field>
          <Field label="LinkedIn job URL" error={errors.url}>
            <input
              type="url"
              className={inputCls}
              value={form.url}
              onChange={(e) => update({ url: e.target.value })}
              placeholder="https://www.linkedin.com/jobs/view/…"
            />
          </Field>
          <Field label="Resume used">
            <input
              list="resume-options"
              className={inputCls}
              value={form.resume}
              onChange={(e) => update({ resume: e.target.value })}
              placeholder="SDE_Resume_v3"
            />
          </Field>
          <Field label="Date applied" hint="Auto-set to today">
            <input
              type="date"
              className={inputCls}
              value={form.appliedAt}
              onChange={(e) => update({ appliedAt: e.target.value })}
            />
          </Field>
          <Field label="Salary range">
            <input
              className={inputCls}
              value={form.salary}
              onChange={(e) => update({ salary: e.target.value })}
              placeholder="₹25-30 LPA or $150-180K"
            />
          </Field>
          <Field label="Status">
            <select
              className={inputCls}
              value={form.status}
              onChange={(e) => update({ status: e.target.value })}
            >
              {COLUMNS.map((c) => (
                <option key={c.id} value={c.id}>
                  {STATUS_LABELS[c.id]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <datalist id="resume-options">
          {resumes.map((r) => (
            <option key={r} value={r} />
          ))}
        </datalist>

        <Field label="Notes" className="mt-4">
          <textarea
            className={`${inputCls} min-h-[90px] resize-y`}
            value={form.notes}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder="Recruiter name, referral, interview feedback…"
          />
        </Field>

        <div className="mt-6 flex items-center justify-end gap-2">
          {isEdit && (
            <span
              className={`mr-auto inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                STATUS_COLORS[form.status]
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {STATUS_LABELS[form.status]}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          >
            {isEdit ? 'Save changes' : 'Add job'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, hint, className = '', children }) {
  return (
    <div className={className}>
      <label className={labelCls}>
        {label}
        {hint && <span className="ml-1 font-normal normal-case text-neutral-400">· {hint}</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-rose-500">{error}</p>}
    </div>
  );
}

function isValidUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}
