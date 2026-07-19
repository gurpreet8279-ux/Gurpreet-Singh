import express from "express";
import fs from "fs/promises";
import path from "path";
import { createServer as createViteServer } from "vite";

const DATA_FILE = path.join(process.cwd(), "data", "blocked-slots.json");

// Define the type here so it's clear
type BlockedSlotsRecord = Record<string, string[]>;

let inMemorySlots: BlockedSlotsRecord | null = null;
let dbInstance: any = null;

async function getFirestoreDb() {
  if (dbInstance) return dbInstance;
  try {
    const configPath = path.join(process.cwd(), "firebase-applet-config.json");
    try {
      await fs.access(configPath);
    } catch {
      console.warn("firebase-applet-config.json not found, using local JSON storage only.");
      return null;
    }
    const configData = await fs.readFile(configPath, "utf-8");
    const firebaseConfig = JSON.parse(configData);
    
    // Dynamic import to prevent crashes if Firestore is uninitialized or key is missing
    const { initializeApp, getApps, getApp } = await import("firebase/app");
    const { getFirestore } = await import("firebase/firestore");
    
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    return dbInstance;
  } catch (error) {
    console.error("Failed to lazy initialize Firebase on server-side:", error);
    return null;
  }
}

async function loadBlockedSlots(): Promise<BlockedSlotsRecord> {
  // Always try loading from Firestore first for real-time synchronization
  const firestoreDb = await getFirestoreDb();
  if (firestoreDb) {
    try {
      const { doc, getDoc } = await import("firebase/firestore");
      const docRef = doc(firestoreDb, "config", "blocked-slots");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        inMemorySlots = snap.data().slots || {};
        return inMemorySlots!;
      }
    } catch (error) {
      console.error("Failed to load blocked slots from Firestore, falling back:", error);
    }
  }

  // Fallback to in-memory cache if set
  if (inMemorySlots) return inMemorySlots;

  // Fallback to local JSON file
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    inMemorySlots = JSON.parse(data);
    return inMemorySlots || {};
  } catch (error) {
    return {};
  }
}

async function saveBlockedSlots(slots: BlockedSlotsRecord) {
  inMemorySlots = slots;

  // Try saving to Firestore
  const firestoreDb = await getFirestoreDb();
  if (firestoreDb) {
    try {
      const { doc, setDoc } = await import("firebase/firestore");
      const docRef = doc(firestoreDb, "config", "blocked-slots");
      await setDoc(docRef, { slots });
      console.log("Successfully saved blocked slots to Firestore.");
    } catch (error) {
      console.error("Failed to save blocked slots to Firestore:", error);
    }
  }

  // Always save locally as fallback and cache
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(slots, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to file", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/blocked-slots", async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const slots = await loadBlockedSlots();
    res.json(slots);
  });

  app.post("/api/blocked-slots", async (req, res) => {
    const newSlots = req.body;
    await saveBlockedSlots(newSlots);
    res.json({ success: true, blockedSlots: newSlots });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // In express 4, app.get('*') works for all routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
