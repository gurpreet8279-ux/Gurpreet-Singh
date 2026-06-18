import express from "express";
import fs from "fs/promises";
import path from "path";
import { createServer as createViteServer } from "vite";

const DATA_FILE = path.join(process.cwd(), "blockedSlots.json");

// Define the type here so it's clear
type BlockedSlotsRecord = Record<string, string[]>;

async function loadBlockedSlots(): Promise<BlockedSlotsRecord> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty object
    return {};
  }
}

async function saveBlockedSlots(slots: BlockedSlotsRecord) {
  await fs.writeFile(DATA_FILE, JSON.stringify(slots, null, 2), "utf-8");
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
