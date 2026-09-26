import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import {
  INITIAL_COURSES,
  INITIAL_FACULTY,
  INITIAL_STUDENTS,
  INITIAL_SUBJECTS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_NOTICES,
  INITIAL_EVENTS,
  INITIAL_GALLERY,
  INITIAL_DOWNLOADS,
  INITIAL_APPLICATIONS,
  INITIAL_CONTACT_MESSAGES
} from './src/data/collegeData';

const DEFAULT_CLOUD_URL = 'https://qbxbfqjzpxiyzobyojex.supabase.co';
const DEFAULT_CLOUD_KEY = 'sb_publishable_tHwdETTQZKzPhsf1A-_uMQ_Iyx-kXXQ';

function resolveValidSupabaseUrl(raw?: string): string {
  const trimmed = (raw || '').trim();
  if (!trimmed || trimmed.startsWith('sb_') || trimmed.startsWith('eyJ')) {
    return DEFAULT_CLOUD_URL;
  }
  const match = trimmed.match(/(?:db\.)?([a-z0-9]{15,25})\.supabase\.co/i);
  if (match && match[1]) {
    return `https://${match[1].toLowerCase()}.supabase.co`;
  }
  return DEFAULT_CLOUD_URL;
}

function resolveValidSupabaseKey(raw?: string): string {
  const trimmed = (raw || '').trim();
  if (!trimmed || trimmed.includes('supabase.co') || trimmed.startsWith('http')) {
    return DEFAULT_CLOUD_KEY;
  }
  if (trimmed === 'sb_publishable_mY-zOAZTMoje3pwhNMw4gg_XD_AcXHr') {
    return DEFAULT_CLOUD_KEY;
  }
  return trimmed;
}

const SUPABASE_CLOUD_URL = resolveValidSupabaseUrl(process.env.VITE_SUPABASE_URL);
const SUPABASE_CLOUD_KEY = resolveValidSupabaseKey(process.env.VITE_SUPABASE_ANON_KEY);
let cloudSupabase: any = null;
try {
  cloudSupabase = createClient(SUPABASE_CLOUD_URL, SUPABASE_CLOUD_KEY);
} catch (err) {
  console.warn('Could not initialize cloudSupabase client:', err);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE_PATH = path.join(__dirname, 'supabase', 'live-db.json');

export interface LiveSupabaseStore {
  courses: any[];
  faculty: any[];
  students: any[];
  subjects: any[];
  admissions: any[];
  notices: any[];
  events: any[];
  study_materials: any[];
  gallery: any[];
  downloads: any[];
  contact_messages: any[];
  uploaded_files: any[];
  updatedAt: string;
}

const VALID_TABLES: (keyof LiveSupabaseStore)[] = [
  'courses',
  'faculty',
  'students',
  'subjects',
  'admissions',
  'notices',
  'events',
  'study_materials',
  'gallery',
  'downloads',
  'contact_messages',
  'uploaded_files'
];

function getInitialStore(): LiveSupabaseStore {
  return {
    courses: INITIAL_COURSES,
    faculty: INITIAL_FACULTY,
    students: INITIAL_STUDENTS,
    subjects: INITIAL_SUBJECTS,
    admissions: INITIAL_APPLICATIONS,
    notices: INITIAL_NOTICES,
    events: INITIAL_EVENTS,
    study_materials: INITIAL_STUDY_MATERIALS,
    gallery: INITIAL_GALLERY,
    downloads: INITIAL_DOWNLOADS,
    contact_messages: INITIAL_CONTACT_MESSAGES,
    uploaded_files: [],
    updatedAt: new Date().toISOString()
  };
}

function loadStore(): LiveSupabaseStore {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        ...getInitialStore(),
        ...parsed
      };
    }
  } catch (err) {
    console.warn('Could not load live-db.json, initializing fresh store:', err);
  }
  const initial = getInitialStore();
  saveStore(initial);
  return initial;
}

function saveStore(store: LiveSupabaseStore) {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    store.updatedAt = new Date().toISOString();
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(store, null, 2), 'utf-8');

    // Mirror state to Supabase Cloud (public.college_sync_state)
    if (cloudSupabase) {
      Promise.resolve(
        cloudSupabase.from('college_sync_state').upsert({
          id: 'icbc_main_state',
          payload: store,
          updated_at: store.updatedAt
        })
      )
        .then(({ error }) => {
          if (error) {
            console.warn('Cloud sync warning:', error.message);
          }
        })
        .catch(() => {});
    }
  } catch (err) {
    console.error('Failed to persist live-db.json:', err);
  }
}

let dbStore: LiveSupabaseStore = loadStore();

// Connected SSE clients for instant real-time website updates
const sseClients = new Set<express.Response>();

function broadcastRealtimeUpdate(changedSlice: Record<string, any[]>, senderId?: string) {
  const payload = JSON.stringify({
    type: 'SUPABASE_REALTIME_SYNC',
    senderId: senderId || '',
    changedTables: Object.keys(changedSlice),
    updatedAt: dbStore.updatedAt,
    state: changedSlice
  });
  for (const client of sseClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Allow large base64 images & documents in JSON payloads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // 1. Real-time Server-Sent Events (SSE) stream so website stays permanently connected
  app.get('/api/supabase/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Send initial connected event
    res.write(
      `data: ${JSON.stringify({
        type: 'SUPABASE_CONNECTED',
        updatedAt: dbStore.updatedAt,
        state: dbStore
      })}\n\n`
    );

    sseClients.add(res);

    // Keep-alive heartbeat every 10 seconds so connection never drops
    const heartbeat = setInterval(() => {
      try {
        res.write(`data: ${JSON.stringify({ type: 'HEARTBEAT', timestamp: new Date().toISOString() })}\n\n`);
      } catch {
        clearInterval(heartbeat);
        sseClients.delete(res);
      }
    }, 10000);

    req.on('close', () => {
      clearInterval(heartbeat);
      sseClients.delete(res);
    });
  });

  // 2. Get full live database state
  app.get('/api/supabase/state', (_req, res) => {
    res.json({
      connected: true,
      updatedAt: dbStore.updatedAt,
      state: dbStore
    });
  });

  // 3. Save / Sync one or more tables from Admin Panel and immediately broadcast ONLY the changed tables
  app.post('/api/supabase/sync', (req, res) => {
    const updates = req.body || {};
    const senderId = typeof updates._senderId === 'string' ? updates._senderId : undefined;

    const changedSlice: Record<string, any[]> = {};
    for (const key of VALID_TABLES) {
      if (Array.isArray(updates[key])) {
        (dbStore as any)[key] = updates[key];
        changedSlice[key] = updates[key];
      }
    }

    if (Object.keys(changedSlice).length > 0) {
      saveStore(dbStore);
      broadcastRealtimeUpdate(changedSlice, senderId);
    }

    res.json({
      success: true,
      connected: true,
      changedTables: Object.keys(changedSlice),
      updatedAt: dbStore.updatedAt,
      state: changedSlice
    });
  });

  // 4. Built-in PostgREST-compatible endpoints (/rest/v1/:table)
  app.all('/rest/v1/:table', (req, res) => {
    const table = req.params.table as keyof LiveSupabaseStore;
    if (!(table in dbStore) || table === 'updatedAt') {
      res.json([]);
      return;
    }

    if (req.method === 'GET') {
      res.json((dbStore as any)[table] || []);
      return;
    }

    res.status(200).json((dbStore as any)[table] || []);
  });

  // Production static serving vs Vite dev middleware
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ ICBC Vellore Server & Persistent Supabase Realtime Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
