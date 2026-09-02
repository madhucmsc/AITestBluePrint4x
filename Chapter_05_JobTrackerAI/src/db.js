import { openDB } from 'idb';

const DB_NAME = 'job-tracker';
const DB_VERSION = 1;

const STORE_JOBS = 'jobs';
const STORE_RESUMES = 'resumes';
const STORE_SETTINGS = 'settings';

let dbPromise;

export function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const jobs = db.createObjectStore(STORE_JOBS, { keyPath: 'id' });
        // Index used to quickly fetch all cards of a column in sort order.
        jobs.createIndex('by-status', 'status');
        db.createObjectStore(STORE_RESUMES, { keyPath: 'name' });
        db.createObjectStore(STORE_SETTINGS);
      },
    });
  }
  return dbPromise;
}

/* ------------------------------- Jobs ---------------------------------- */

export async function getAllJobs() {
  return (await getDb()).getAll(STORE_JOBS);
}

export async function addJob(job) {
  return (await getDb()).add(STORE_JOBS, job);
}

export async function putJob(job) {
  return (await getDb()).put(STORE_JOBS, job);
}

export async function deleteJob(id) {
  return (await getDb()).delete(STORE_JOBS, id);
}

// Replaces the whole jobs table in one transaction (used by JSON import
// and by seeding the demo cards on first run).
export async function replaceAllJobs(jobs) {
  const db = await getDb();
  const tx = db.transaction(STORE_JOBS, 'readwrite');
  await Promise.all([
    tx.objectStore(STORE_JOBS).clear(),
    ...jobs.map((job) => tx.objectStore(STORE_JOBS).put(job)),
    tx.done,
  ]);
}

/* ------------------------------ Resumes -------------------------------- */

export async function getAllResumes() {
  const all = await (await getDb()).getAll(STORE_RESUMES);
  return all.map((r) => r.name).sort();
}

export async function addResume(name) {
  return (await getDb()).add(STORE_RESUMES, { name });
}

export async function deleteResume(name) {
  const db = await getDb();
  const tx = db.transaction([STORE_RESUMES, STORE_JOBS], 'readwrite');
  await tx.objectStore(STORE_RESUMES).delete(name);
  const index = tx.objectStore(STORE_JOBS).index('by-status');
  const jobs = await index.getAll();
  // Unlink the deleted resume from any card that referenced it.
  for (const job of jobs) {
    if (job.resume === name) {
      job.resume = '';
      await tx.objectStore(STORE_JOBS).put(job);
    }
  }
  await tx.done;
}

// Seed the default resume names on first launch (empty resume store).
export async function seedResumesIfEmpty() {
  const db = await getDb();
  const count = await db.count(STORE_RESUMES);
  if (count === 0) {
    const tx = db.transaction(STORE_RESUMES, 'readwrite');
    for (const name of ['SDE_Resume_v3', 'QA_Lead_Resume']) {
      tx.objectStore(STORE_RESUMES).put({ name });
    }
    await tx.done;
  }
}

// Seed a few demo cards on first launch (empty jobs store).
export async function seedJobsIfEmpty() {
  const db = await getDb();
  const count = await db.count(STORE_JOBS);
  if (count > 0) return;
  const now = Date.now();
  const ago = (days) => new Date(now - days * 86_400_000).toISOString();
  const jobs = [
    {
      id: crypto.randomUUID(),
      company: 'Cronos Systems',
      role: 'Senior Software Engineer',
      url: 'https://www.linkedin.com/jobs/view/cronos-sse',
      resume: 'SDE_Resume_v3',
      appliedAt: ago(2),
      salary: '₹25-30 LPA',
      notes: 'Referred by Aarav on LinkedIn. Hiring manager: Priya.',
      status: 'follow-up',
    },
    {
      id: crypto.randomUUID(),
      company: 'Acme Corp',
      role: 'Frontend Engineer',
      url: 'https://www.linkedin.com/jobs/view/acme-fe',
      resume: 'SDE_Resume_v3',
      appliedAt: ago(9),
      salary: '',
      notes: 'Recruiter: Sarah — screening call done, onsite next week.',
      status: 'interview',
    },
    {
      id: crypto.randomUUID(),
      company: 'Northwind Labs',
      role: 'SDET / QA Lead',
      url: 'https://www.linkedin.com/jobs/view/northwind-qa',
      resume: 'QA_Lead_Resume',
      appliedAt: ago(4),
      salary: '$150-180K',
      notes: 'HM review in progress.',
      status: 'applied',
    },
    {
      id: crypto.randomUUID(),
      company: 'Globex',
      role: 'Product Engineer',
      url: 'https://www.linkedin.com/jobs/view/globex-pe',
      resume: 'SDE_Resume_v3',
      appliedAt: ago(1),
      salary: '',
      notes: '',
      status: 'wishlist',
    },
    {
      id: crypto.randomUUID(),
      company: 'Initech',
      role: 'React Developer',
      url: 'https://www.linkedin.com/jobs/view/initech-react',
      resume: '',
      appliedAt: ago(3),
      salary: '₹18-22 LPA',
      notes: '',
      status: 'wishlist',
    },
    {
      id: crypto.randomUUID(),
      company: 'Umbrella Systems',
      role: 'QA Automation Engineer',
      url: '',
      resume: 'QA_Lead_Resume',
      appliedAt: ago(16),
      salary: '₹20-24 LPA',
      notes: 'No response after 2 weeks — sent follow-up.',
      status: 'rejected',
    },
    {
      id: crypto.randomUUID(),
      company: 'Stark Industries',
      role: 'Staff Engineer',
      url: 'https://www.linkedin.com/jobs/view/staff-eng',
      resume: 'SDE_Resume_v3',
      appliedAt: ago(30),
      salary: '$220K',
      notes: 'Verbal offer — negotiating.',
      status: 'offer',
    },
  ];
  const tx = db.transaction(STORE_JOBS, 'readwrite');
  for (const job of jobs) tx.objectStore(STORE_JOBS).put(job);
  await tx.done;
}

export async function replaceAllResumes(names) {
  const db = await getDb();
  const tx = db.transaction(STORE_RESUMES, 'readwrite');
  await Promise.all([
    tx.objectStore(STORE_RESUMES).clear(),
    ...names.map((name) => tx.objectStore(STORE_RESUMES).put({ name })),
    tx.done,
  ]);
}

/* ------------------------------ Settings ------------------------------- */

export async function getSetting(key) {
  return (await getDb()).get(STORE_SETTINGS, key);
}

export async function setSetting(key, value) {
  return (await getDb()).put(STORE_SETTINGS, value, key);
}
