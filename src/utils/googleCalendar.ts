import { google } from 'googleapis';

// 1. Initialize the Google Auth Client using Application Default Credentials (ADC)
// This requires ZERO setup in AI Studio because the container already has a service account!
// If deployed elsewhere, it will fall back to using GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY.
const authOptions: any = {
  scopes: ['https://www.googleapis.com/auth/calendar.events'],
};

if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
  authOptions.credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  };
}

const auth = new google.auth.GoogleAuth(authOptions);

const calendar = google.calendar({ version: 'v3', auth });

// The ID of the specific calendar you want to manage (e.g., your business email)
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'durhamscrowndetailing@gmail.com';

export interface BookingDetails {
  name: string;
  phone: string;
  serviceType: string;
  vehicleDetails: string;
  address: string;
  startTime: string; // ISO 8601 string, e.g., '2023-10-15T10:00:00Z'
  endTime: string;   // ISO 8601 string, e.g., '2023-10-15T12:00:00Z'
}

/**
 * Checks if a specific time slot is free on the calendar.
 * @param startTime ISO 8601 string
 * @param endTime ISO 8601 string
 * @returns boolean true if available, false if double-booked
 */
export async function isTimeSlotAvailable(startTime: string, endTime: string): Promise<boolean> {
  try {
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: startTime,
      timeMax: endTime,
      singleEvents: true, // Expands recurring events into single instances
    });
    
    const events = response.data.items || [];
    // If there are no overlapping events, the slot is available
    return events.length === 0;
  } catch (error) {
    console.error("Error checking calendar availability:", error);
    throw new Error("Failed to check calendar availability.");
  }
}

/**
 * Creates a new calendar event for a confirmed booking.
 * @param bookingDetails The customer and service details
 */
export async function createBookingEvent(bookingDetails: BookingDetails) {
  const { name, phone, serviceType, vehicleDetails, address, startTime, endTime } = bookingDetails;
  
  const event = {
    summary: `${serviceType} - ${name}`,
    location: address,
    description: `Customer: ${name}\nPhone: ${phone}\nVehicle: ${vehicleDetails}\nService: ${serviceType}`,
    start: {
      dateTime: startTime,
    },
    end: {
      dateTime: endTime,
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create calendar event:", error);
    throw new Error("Failed to sync booking to Google Calendar.");
  }
}

export async function getEventsForDay(dateStr: string) {
  // dateStr is 'YYYY-MM-DD'
  // Create boundaries for the day
  const startTime = new Date(`${dateStr}T00:00:00.000Z`); 
  startTime.setHours(startTime.getHours() - 12); 
  const endTime = new Date(`${dateStr}T23:59:59.999Z`);
  endTime.setHours(endTime.getHours() + 12);

  try {
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: startTime.toISOString(),
      timeMax: endTime.toISOString(),
      singleEvents: true,
    });
    return response.data.items || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}
