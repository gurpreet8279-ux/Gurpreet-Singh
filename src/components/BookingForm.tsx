import React, { useState, useEffect } from "react";
import { CheckCircle2, Calendar as CalendarIcon, Clock, ChevronRight, Copy, Mail } from "lucide-react";
import { format, startOfToday } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "../lib/utils";
import { AVAILABLE_TIME_SLOTS, BLOCKED_DATES } from "../config";

export function BookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [dynamicBlockedDates, setDynamicBlockedDates] = useState<string[]>([]);

  useEffect(() => {
    // Load local blocked dates from Admin Dashboard
    const saved = localStorage.getItem("DURHAM_BLOCKED_DATES");
    if (saved) {
      try {
        setDynamicBlockedDates(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    
    // Polling mechanism to keep forms up to date without refresh if admin open in another tab
    const interval = setInterval(() => {
      const updatedSaved = localStorage.getItem("DURHAM_BLOCKED_DATES");
      if (updatedSaved) {
        try {
          const parsed = JSON.parse(updatedSaved);
          if (JSON.stringify(parsed) !== JSON.stringify(dynamicBlockedDates)) {
            setDynamicBlockedDates(parsed);
          }
        } catch (e) {}
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [dynamicBlockedDates]);

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
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
          },
          body: json
      });
      const result = await response.json();
      if (result.success) {
          setSubmitted(true);
      } else {
          console.error(result);
          alert(`Submission failed: ${result.message || 'Please try again.'}`);
      }
    } catch (error) {
        console.error(error);
        alert("Something went wrong! Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTimeSlotAvailable = (timeStr: string) => {
    if (!selectedDate) return false;
    
    const now = new Date();
    const isTodayFlag = format(selectedDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
    
    if (!isTodayFlag) return true;

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

    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    return slotDate > oneHourFromNow;
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
                        return BLOCKED_DATES.includes(dateStr) || dynamicBlockedDates.includes(dateStr);
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
