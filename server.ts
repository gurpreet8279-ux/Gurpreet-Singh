import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { isTimeSlotAvailable, createBookingEvent, BookingDetails } from "./src/utils/googleCalendar";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Example: Insert this logic into your existing booking controller
  app.post("/api/bookings", async (req, res) => {
    const bookingData: BookingDetails = req.body;
    
    try {
      // 1. Check double-bookings via Calendar (or your database)
      const isAvailable = await isTimeSlotAvailable(bookingData.startTime, bookingData.endTime);
      
      if (!isAvailable) {
        return res.status(409).json({ error: "Time slot is already booked." });
      }

      // 2. Save booking to your existing database FIRST
      const { collection, addDoc } = await import("firebase/firestore");
      const { db } = await import("./src/db/firebase");
      
      const docRef = await addDoc(collection(db, "bookings"), {
        ...bookingData,
        createdAt: new Date().toISOString()
      });
      
      console.log("Booking saved to database with ID:", docRef.id);

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
