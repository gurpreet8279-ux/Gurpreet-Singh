import { isTimeSlotAvailable, createBookingEvent, BookingDetails } from "./src/utils/googleCalendar";

async function run() {
    const bookingData: BookingDetails = {
      name: "test", email: "test@example.com", phone: "1234567890", serviceType: "test", vehicleDetails: "test", address: "test", startTime: "2026-07-05T10:00:00Z", endTime: "2026-07-05T12:00:00Z"
    };
    try {
      const isAvailable = await isTimeSlotAvailable(bookingData.startTime, bookingData.endTime);
      console.log("isAvailable", isAvailable);
      const { collection, addDoc } = await import("firebase/firestore");
      const { db } = await import("./src/db/firebase");
      console.log("imported db", db);
    } catch (e) {
      console.error(e);
    }
}
run();
