import express from 'express';
import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const app = express();
const PORT = 3000;
const isVercel = !!process.env.VERCEL;
const dataDir = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
const stateFile = path.join(dataDir, 'app-state.json');
const tempStateFile = path.join(dataDir, 'app-state.json.tmp');

const defaultState = {
  studentProfile: null,
  attendanceItems: [],
  examPerformances: [],
  examSchedule: [],
  gatepasses: [],
  pendingFeeBalance: 5000,
  username: '',
  isAuthenticated: false,
  activeTab: 'home',
  revision: 0,
  updatedAt: null,
};

let db: any = null;

// Configure Firebase credentials with robust merging: process.env -> firebase-applet-config.json -> hardcoded fallbacks
let localConfig: any = {};
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
if (fs.existsSync(configPath)) {
  try {
    localConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log('Successfully read firebase-applet-config.json from disk');
  } catch (err) {
    console.error('Failed to parse firebase-applet-config.json:', err);
  }
}

const hardcodedConfig = {
  apiKey: "AIzaSyCGq-VB-uwoww6jarP67Rt3hXcnhvHRAtI",
  authDomain: "world-college-of-medical.firebaseapp.com",
  projectId: "world-college-of-medical",
  storageBucket: "world-college-of-medical.firebasestorage.app",
  messagingSenderId: "780627005834",
  appId: "1:780627005834:web:082d3915cae2e4694c7873",
  firestoreDatabaseId: "ai-studio-worldcollegeofme-195a8968-9d0e-48b7-be77-a11764464c87",
};

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || localConfig.apiKey || hardcodedConfig.apiKey,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || localConfig.authDomain || hardcodedConfig.authDomain,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || localConfig.projectId || hardcodedConfig.projectId,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || localConfig.storageBucket || hardcodedConfig.storageBucket,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId || hardcodedConfig.messagingSenderId,
  appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || localConfig.appId || hardcodedConfig.appId,
  firestoreDatabaseId: process.env.VITE_FIREBASE_DATABASE_ID || process.env.FIREBASE_DATABASE_ID || localConfig.firestoreDatabaseId || hardcodedConfig.firestoreDatabaseId || '(default)',
};

if (firebaseConfig.apiKey) {
  try {
    const firebaseApp = initializeApp({
      apiKey: firebaseConfig.apiKey,
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId,
      appId: firebaseConfig.appId,
    });

    // Use getFirestore with either the custom database ID or fallback to undefined/default
    const dbId = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') 
      ? firebaseConfig.firestoreDatabaseId 
      : undefined;
    db = getFirestore(firebaseApp, dbId);
    console.log('Firebase initialized successfully with database ID:', dbId || 'default', 'on project:', firebaseConfig.projectId);
  } catch (err) {
    console.error('Failed to initialize Firebase:', err);
  }
}

function ensureStore() {
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (err) {
      console.error('Failed to create data directory:', err);
    }
  }

  if (!fs.existsSync(stateFile)) {
    try {
      fs.writeFileSync(stateFile, JSON.stringify({ ...defaultState }, null, 2));
    } catch (err) {
      console.error('Failed to initialize default state file:', err);
    }
  }
}

function readStateFromFile() {
  ensureStore();
  try {
    return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  } catch (err) {
    console.error('Failed to read state from file:', err);
    return { ...defaultState };
  }
}

function writeStateToFile(state: any) {
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (err) {
      console.error('Failed to create data directory for write:', err);
    }
  }
  try {
    fs.writeFileSync(tempStateFile, JSON.stringify(state, null, 2));
    fs.renameSync(tempStateFile, stateFile);
  } catch (err) {
    console.error('Failed to write state to file:', err);
  }
}

async function readState() {
  if (!db) {
    console.log('[FIRESTORE READ SKIPPED] No Firestore DB instance available. Using local state file.');
    return readStateFromFile();
  }
  try {
    console.log('[FIRESTORE READ START] Path: app_state/global');
    const docRef = doc(db, 'app_state', 'global');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log(`[FIRESTORE READ SUCCESS] Path: app_state/global, Revision: ${data?.revision ?? 0}`);
      return data;
    } else {
      console.log('[FIRESTORE READ EMPTY] Path: app_state/global. No state document found. Initializing with local state.');
      const fileData = readStateFromFile();
      console.log('[FIRESTORE WRITE START] Path: app_state/global (for initialization)');
      await setDoc(docRef, fileData);
      console.log('[FIRESTORE WRITE SUCCESS] Path: app_state/global initialized successfully.');
      return fileData;
    }
  } catch (err: any) {
    console.error('[FIRESTORE READ ERROR] Path: app_state/global. Real Firestore error details:', err);
    console.log('Falling back to local state file due to Firestore error.');
    return readStateFromFile();
  }
}

async function writeState(state: any) {
  const nextState = {
    ...defaultState,
    ...state,
    revision: Number(state?.revision ?? 0) + 1,
    updatedAt: new Date().toISOString(),
  };

  writeStateToFile(nextState);

  if (db) {
    try {
      console.log(`[FIRESTORE WRITE START] Path: app_state/global. Target Revision: ${nextState.revision}`);
      const docRef = doc(db, 'app_state', 'global');
      await setDoc(docRef, nextState);
      console.log(`[FIRESTORE WRITE SUCCESS] Path: app_state/global. Successfully persisted revision ${nextState.revision} to Firestore.`);
    } catch (err: any) {
      console.error('[FIRESTORE WRITE ERROR] Path: app_state/global. Real Firestore write error:', err);
      throw new Error(`Firestore save failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  } else {
    console.warn('[FIRESTORE WRITE SKIPPED] DB is offline or uninitialized. Saved locally only.');
  }
  return nextState;
}

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json({ limit: '2mb' }));

// API routes go here FIRST
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    port: PORT,
    firebaseConnected: !!db,
    projectId: firebaseConfig.projectId,
    databaseId: firebaseConfig.firestoreDatabaseId,
    env: process.env.NODE_ENV || 'development',
    isVercel,
  });
});

app.get('/api/state', async (_req, res) => {
  try {
    const state = await readState();
    res.json(state);
  } catch (err: any) {
    console.error('Error fetching state in /api/state GET:', err);
    res.status(500).json({
      ok: false,
      error: 'Failed to read state',
      details: err instanceof Error ? err.message : String(err),
      stack: process.env.NODE_ENV !== 'production' && err instanceof Error ? err.stack : undefined
    });
  }
});

const handleStateUpdate = async (req: express.Request, res: express.Response) => {
  try {
    const incoming = req.body ?? {};
    const payload = incoming?.state && typeof incoming.state === 'object' ? incoming.state : incoming;
    const isAdminRequest = (
      payload?.isAdmin === true ||
      payload?.username === 'admin' ||
      incoming?.isAdmin === true ||
      incoming?.username === 'admin' ||
      incoming?.state?.isAdmin === true ||
      incoming?.state?.username === 'admin'
    );

    if (!isAdminRequest) {
      res.status(403).json({ ok: false, message: 'Only admin can update shared data.' });
      return;
    }

    const current = await readState();
    const merged = {
      ...current,
      ...payload,
      revision: Number(current?.revision ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    };
    const savedState = await writeState(merged);
    res.json(savedState);
  } catch (err: any) {
    console.error('Error updating state in /api/state POST/PUT:', err);
    res.status(500).json({
      ok: false,
      error: 'Failed to save state',
      details: err instanceof Error ? err.message : String(err),
      stack: process.env.NODE_ENV !== 'production' && err instanceof Error ? err.stack : undefined
    });
  }
};

app.post('/api/state', handleStateUpdate);
app.put('/api/state', handleStateUpdate);

export default app;
