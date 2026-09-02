# Job Tracker — Local-first Kanban for your job search

A single-page React application to track job applications as a Kanban board.
Everything lives in your browser's IndexedDB — no backend, no accounts, 100% local.

Built with **Vite + React 18 + Tailwind CSS v4**, **idb** (IndexedDB wrapper),
and **@dnd-kit** (drag-and-drop).

## Quick start

```bash
npm install
npm run dev        # open the printed localhost URL
```

Production build:

```bash
npm run build && npm run preview
```

## Features

- **6-column Kanban board** — Wishlist → Applied → Follow-up → Interview → Offer → Rejected
- **Drag-and-drop** cards between columns and reorder within a column (`@dnd-kit`)
- **Add / edit / delete** jobs via a modal form with required-field validation
- Each card shows company, role, resume tag, salary/notes, applied date +
  **days since applied**, and a clickable **LinkedIn** icon
- Column headers show live counts; each column scrolls independently
- **Search bar** filters cards by company or role across the board
- Every CRUD action persists instantly to IndexedDB
- **Light / dark mode** toggle (persisted)
- **Export all data as JSON** backup and **import JSON** to restore
- Sort a column by date applied (newest / oldest), with manual order restored on "clear"

## Job fields

| Field        | Notes                                              |
| ------------ | -------------------------------------------------- |
| Company      | text, required                                     |
| Role         | text, required                                     |
| LinkedIn URL | clickable icon on the card                         |
| Resume used  | pick from previously used resumes, or type a new one (saved for later) |
| Date applied | auto-set to today on creation, editable            |
| Salary       | optional, e.g. `₹25-30 LPA` / `$150-180K`          |
| Notes        | recruiter, referral, interview feedback            |
| Status       | maps to the column it lives in                     |

## Data & privacy

- Database name: `job-tracker` (stores: `jobs`, `resumes`, `settings`)
- The first launch seeds a few sample cards so you can try the drag-and-drop;
  delete them freely or import a backup over them.
- Export a `.json` backup any time — it includes jobs, resume names, column
  order and sort preferences. Import replaces the current board.

## Project structure

```
src/
  main.jsx                 entry
  index.css                Tailwind v4 theme + scrollbars
  constants.js             columns, colors, formatters
  db.js                    idb wrapper (CRUD, seeds, settings)
  hooks/useJobData.js      data hook + sort helpers
  components/
    App.jsx                board + dnd-kit wiring + CRUD + import/export
    TopBar.jsx             search, add, export/import, theme toggle
    JobColumn.jsx          one kanban column (droppable + sortable list)
    JobCard.jsx            card (sortable item, accent, meta)
    JobForm.jsx            add/edit modal with validation
    ConfirmDialog.jsx      delete confirmation
    ui.jsx                 shared bits (badge, empty state, Escape hook)
```
