import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { isTimeSlotAvailable, createBookingEvent, getEventsForDay, BookingDetails } from "./src/utils/googleCalendar";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Enable CORS so the static frontend (e.g. on Netlify or custom domain) can reach our API
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/slots", async (req, res) => {
    const { date } = req.query;
    if (!date || typeof date !== "string") {
      return res.status(400).json({ error: "Date is required (YYYY-MM-DD)" });
    }
    
    try {
      const events = await getEventsForDay(date);
      // Return a minimal format for frontend
      const mappedEvents = events.map(e => ({
        start: e.start?.dateTime || e.start?.date,
        end: e.end?.dateTime || e.end?.date,
      }));
      res.json({ events: mappedEvents });
    } catch (error) {
      console.error("Error fetching slots:", error);
      res.status(500).json({ error: "Failed to fetch slots" });
    }
  });

  // Example: Insert this logic into your existing booking controller
  app.post("/api/bookings", async (req, res) => {
    console.log("Received booking request:", req.body);
    const bookingData: BookingDetails = req.body;
    
    try {
      // 1. Check double-bookings via Calendar (if set up)
      try {
        console.log("Checking time slot availability...");
        const isAvailable = await isTimeSlotAvailable(bookingData.startTime, bookingData.endTime);
        console.log("Time slot availability:", isAvailable);
        if (!isAvailable) {
          return res.status(409).json({ error: "Time slot is already booked." });
        }
      } catch (calError) {
        console.error("Calendar check failed (likely not configured). Proceeding with booking anyway.", calError);
      }

      // 3. Sync to Google Calendar
      try {
        await createBookingEvent(bookingData);
      } catch (calendarError) {
        // IMPORTANT: Log the error but DO NOT fail the booking process.
        // The booking is already in your database. You could queue this for a retry later.
        console.error("Calendar sync failed, but booking was saved.", calendarError);
      }

      res.status(201).json({ message: "Booking confirmed successfully!" });
    } catch (error) {
      console.error("Booking error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
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
