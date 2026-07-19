import React, { useState, useEffect } from "react";
import { CheckCircle2, Calendar as CalendarIcon, Clock, ChevronRight, Copy, Mail } from "lucide-react";
import { format, startOfToday } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "../lib/utils";
import { AVAILABLE_TIME_SLOTS, BLOCKED_DATES } from "../config";

const getApiUrl = (endpoint: string) => {
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}${endpoint}`;
  }
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1" || host.endsWith("run.app")) {
    return endpoint;
  }
  const base = "https://ais-pre-7dx3czfaefni3zdxkayidk-308212599119.us-west2.run.app";
  return `${base}${endpoint}`;
};

export function BookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [dynamicBlockedSlots, setDynamicBlockedSlots] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem("blockedSlots");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [googleEvents, setGoogleEvents] = useState<{start: string, end: string}[]>([]);

  useEffect(() => {
    // 1. Initial fetch from server-side API (highly reliable)
    const fetchLocalSlots = async () => {
      try {
        const response = await fetch(getApiUrl("/api/blocked-slots"));
        if (response.ok) {
          const data = await response.json();
          if (data.slots) {
            setDynamicBlockedSlots(data.slots);
            localStorage.setItem("blockedSlots", JSON.stringify(data.slots));
          }
        }
      } catch (e) {
        console.error("Failed to load blocked slots from server-side API:", e);
      }
    };
    fetchLocalSlots();
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setGoogleEvents([]);
      return;
    }
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    fetch(getApiUrl(`/api/slots?date=${dateStr}`))
      .then(res => res.json())
      .then(data => {
        if (data.events) {
          setGoogleEvents(data.events);
        }
      })
      .catch(err => console.error("Error fetching Google Calendar slots", err));
  }, [selectedDate]);

  const today = startOfToday();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      alert("Please select both a date and a time block before submitting.");
      return;
    }
    
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    // Web3Forms required fields
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "fea02e2e-c9c0-463e-a4f1-8cb7a88fe74e";
    
    formData.append("access_key", accessKey);
    formData.append("subject", `New Booking Request from ${formData.get("name")}`);
    formData.append("from_name", "Durham's Crown Mobile Detailing Bookings");
    
    // Formatted date and time
    formData.append("Service_Date", format(selectedDate, 'EEEE, MMMM do, yyyy'));
    formData.append("Service_Time", selectedTime);

    const object = Object.fromEntries(formData);
    
    // Parse time block to pass valid ISO start/end to backend
    const [startHour, startMinuteStr, ampm] = selectedTime.split(/[:\s]/);
    let hour = parseInt(startHour);
    if (ampm === "PM" && hour < 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(hour, parseInt(startMinuteStr), 0);
    const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // 2-hour duration
    
    const apiPayload = {
      name: object.name,
      email: object.email,
      phone: object.phone,
      serviceType: object.package,
      vehicleDetails: `${object['vehicle-make']} - ${object['vehicle-type']}`,
      address: object.address,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      displayDate: object.Service_Date,
      displayTime: object.Service_Time
    };

    try {
      // 1. Submit to Web3Forms directly from the browser (to avoid server-side IP block)
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "fea02e2e-c9c0-463e-a4f1-8cb7a88fe74e";
      const emailData = {
        access_key: accessKey,
        subject: `New Booking Request from ${apiPayload.name}`,
        from_name: "Durham's Crown Mobile Detailing Bookings",
        name: apiPayload.name,
        email: apiPayload.email || "",
        phone: apiPayload.phone,
        package: apiPayload.serviceType,
        vehicle: apiPayload.vehicleDetails,
        address: apiPayload.address,
        Service_Date: apiPayload.displayDate,
        Service_Time: apiPayload.displayTime
      };

      try {
          const w3fResponse = await fetch("https://api.web3forms.com/submit", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json"
              },
              body: JSON.stringify(emailData)
          });
          const text = await w3fResponse.text();
          try {
              const w3fResult = JSON.parse(text);
              console.log("Web3Forms client result:", w3fResult);
          } catch (e) {
              console.warn("Web3Forms returned non-JSON:", text);
          }
      } catch (err) {
          console.error("Web3Forms client failed:", err);
      }

      // 2. Submit to our backend for Calendar Sync (optional)
      try {
          const response = await fetch(getApiUrl("/api/bookings"), {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(apiPayload)
          });
          console.log("Backend status:", response.status);
      } catch (err) {
          console.warn("Backend sync failed. Continuing since Web3Forms handles emails.");
      }

      setSubmitted(true);
    } catch (error: any) {
        console.error(error);
        alert(`Something went wrong! Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTimeSlotAvailable = (timeStr: string) => {
    if (!selectedDate) return false;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const blockedSlots = dynamicBlockedSlots[dateStr] || [];
    if (blockedSlots.includes("ALL") || blockedSlots.includes(timeStr)) {
      return false;
    }
    
    const now = new Date();
    const isTodayFlag = dateStr === format(now, 'yyyy-MM-dd');
    
    // Parse time string (HH:mm AM/PM)
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    const slotDate = new Date(selectedDate);
    slotDate.setHours(hours, minutes, 0, 0);

    if (isTodayFlag) {
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      if (slotDate <= oneHourFromNow) return false;
    }

    // Google Calendar check (assuming 2 hour duration for the slot)
    const slotEnd = new Date(slotDate.getTime() + 2 * 60 * 60 * 1000);
    for (const event of googleEvents) {
      if (!event.start || !event.end) continue;
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      // Overlap logic: slotStart < eventEnd && slotEnd > eventStart
      if (slotDate < eventEnd && slotEnd > eventStart) {
        return false;
      }
    }

    return true;
  };

  return (
    <div id="booking" className="bg-zinc-950 py-24 sm:py-32 border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-gold-500 tracking-widest uppercase">Schedule Service</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white font-heading sm:text-5xl">
            Book Your Detail
          </p>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Select your preferred date and time to secure your spot directly. You'll receive a confirmation email shortly.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
          {submitted ? (
            <div className="bg-zinc-900/80 border border-gold-500/30 p-8 rounded-sm text-center flex flex-col items-center animate-in fade-in zoom-in duration-300">
               <CheckCircle2 className="w-16 h-16 text-gold-500 mb-4" />
               <h3 className="text-2xl font-heading text-white font-bold mb-2">Booking Requested!</h3>
               <p className="text-zinc-400 text-lg mb-4">
                 Your appointment is requested for <span className="text-gold-400 font-semibold">{selectedDate && format(selectedDate, 'EEEE, MMMM do')} at {selectedTime}</span>.
               </p>
               <p className="text-zinc-500 text-sm mb-6">
                 We've received your request and will contact you shortly to confirm!
               </p>

               <button 
                 onClick={() => {
                    setSubmitted(false);
                    setSelectedDate(undefined);
                    setSelectedTime(null);
                 }}
                 className="text-gold-500 text-sm hover:text-gold-400 underline decoration-gold-500/50 underline-offset-4"
               >
                 Start another booking
               </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="bg-zinc-900 p-8 rounded-sm border border-zinc-800 shadow-xl flex flex-col gap-10">
              
              {/* Step 1: Select Date */}
              <div>
                 <div className="flex items-center gap-2 mb-4">
                    <CalendarIcon className="w-5 h-5 text-gold-500" />
                    <h3 className="text-lg font-heading font-medium text-white">1. Select Date</h3>
                 </div>
                 
                 <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-4 text-white flex justify-center custom-calendar-wrapper">
                    <style>
                      {`
                        .custom-calendar-wrapper .rdp {
                          --rdp-accent-color: #D4AF37;
                          --rdp-background-color: rgba(212, 175, 55, 0.1);
                          --rdp-day_button: 40px;
                          --rdp-selected-border: 2px solid var(--rdp-accent-color);
                          --rdp-outline: 2px solid var(--rdp-accent-color);
                          margin: 0;
                        }
                        .custom-calendar-wrapper .rdp-day_selected, 
                        .custom-calendar-wrapper .rdp-day_selected:focus-visible, 
                        .custom-calendar-wrapper .rdp-day_selected:hover {
                          color: black;
                          background-color: var(--rdp-accent-color);
                        }
                        .custom-calendar-wrapper .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
                           background-color: var(--rdp-background-color);
                        }
                        .custom-calendar-wrapper .rdp-day_disabled {
                           opacity: 0.3;
                        }
                      `}
                    </style>
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => { setSelectedDate(date); setSelectedTime(null); }}
                      disabled={(date) => {
                        if (date < today) return true;
                        const dateStr = format(date, 'yyyy-MM-dd');
                        if (BLOCKED_DATES.includes(dateStr)) return true;
                        if (dynamicBlockedSlots[dateStr]?.includes("ALL")) return true;
                        return false;
                      }}
                      showOutsideDays={false}
                    />
                 </div>
              </div>

              {/* Step 2: Select Time */}
              {selectedDate && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-gold-500" />
                      <h3 className="text-lg font-heading font-medium text-white">2. Select Time</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {AVAILABLE_TIME_SLOTS.map(time => {
                      const isSelected = selectedTime === time;
                      const isAvailable = isTimeSlotAvailable(time);
                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-3 px-4 rounded-sm border text-sm font-semibold tracking-wide transition-all",
                            isSelected 
                              ? "bg-gold-500 border-gold-500 text-black shadow-lg" 
                              : isAvailable
                                ? "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-gold-500/50 hover:bg-zinc-900"
                                : "bg-zinc-900 border-zinc-900 text-zinc-600 cursor-not-allowed opacity-50"
                          )}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Details */}
              {selectedDate && selectedTime && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-2 mb-6">
                      <ChevronRight className="w-5 h-5 text-gold-500" />
                      <h3 className="text-lg font-heading font-medium text-white">3. Your Information</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="name" className="block text-xs font-medium leading-6 text-zinc-400 uppercase tracking-wider">
                        Full Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          className="block w-full border-0 bg-zinc-950 px-3.5 py-3 text-white shadow-sm ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-gold-500 sm:text-sm sm:leading-6 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-medium leading-6 text-zinc-400 uppercase tracking-wider">
                        Phone Number
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          required
                          className="block w-full border-0 bg-zinc-950 px-3.5 py-3 text-white shadow-sm ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-gold-500 sm:text-sm sm:leading-6 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium leading-6 text-zinc-400 uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          className="block w-full border-0 bg-zinc-950 px-3.5 py-3 text-white shadow-sm ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-gold-500 sm:text-sm sm:leading-6 transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2 text-white my-2"><hr className="border-zinc-800" /></div>

                    <div>
                      <label htmlFor="vehicle-make" className="block text-xs font-medium leading-6 text-zinc-400 uppercase tracking-wider">
                        Vehicle Make & Model
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="vehicle-make"
                          id="vehicle-make"
                          placeholder="e.g. Ford F-150"
                          required
                          className="block w-full border-0 bg-zinc-950 px-3.5 py-3 text-white shadow-sm ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-gold-500 sm:text-sm sm:leading-6 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="vehicle-type" className="block text-xs font-medium leading-6 text-zinc-400 uppercase tracking-wider">
                        Vehicle Type
                      </label>
                      <div className="mt-1">
                        <select
                          id="vehicle-type"
                          name="vehicle-type"
                          className="block w-full border-0 bg-zinc-950 px-3.5 py-3.5 text-white shadow-sm ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-gold-500 sm:text-sm sm:leading-6 transition-all"
                        >
                          <option>A Large SUV / Truck / Van (+CA$39.99)</option>
                          <option>A Compact / Mid-Size SUV (+CA$24.99)</option>
                          <option>Car / Coupe / Sedan</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="package" className="block text-xs font-medium leading-6 text-zinc-400 uppercase tracking-wider">
                        Select Package
                      </label>
                      <div className="mt-1">
                        <select
                          id="package"
                          name="package"
                          className="block w-full border-0 bg-zinc-950 px-3.5 py-3.5 text-white shadow-sm ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-gold-500 sm:text-sm sm:leading-6 transition-all"
                        >
                          <option>Silver Package ($179.99)</option>
                          <option>Gold Package ($199.99)</option>
                          <option>Platinum Package ($249.99)</option>
                          <option>The Crown Jewel PROMO ($199)</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="block text-xs font-medium leading-6 text-zinc-400 uppercase tracking-wider">
                        Service Address (We Come To You)
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address"
                          id="address"
                          required
                          placeholder="Street address, City, ZIP"
                          className="block w-full border-0 bg-zinc-950 px-3.5 py-3 text-white shadow-sm ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-gold-500 sm:text-sm sm:leading-6 transition-all"
                        />
                      </div>
                    </div>

                  </div>
                  <div className="mt-10">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="block w-full bg-gold-600/20 border border-gold-500/50 text-gold-300 hover:bg-gold-500 hover:text-black hover:border-gold-500 px-3.5 py-4 text-center text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:hover:bg-gold-600/20 disabled:hover:text-gold-300"
                    >
                      {isSubmitting ? "Submitting..." : `Request Booking for ${selectedTime}`}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
