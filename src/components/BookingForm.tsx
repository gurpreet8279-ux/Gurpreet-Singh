import React, { useState } from "react";
import { CheckCircle2, Calendar as CalendarIcon, Clock, ChevronRight } from "lucide-react";
import { format, startOfToday } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "../lib/utils";
import { AVAILABLE_TIME_SLOTS } from "../config";

export function BookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const today = startOfToday();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Format the date/time nicely
    data.date = format(selectedDate, 'EEEE, MMMM do, yyyy');
    data.time = selectedTime;
    data._subject = `New Booking Request from ${data.name}`;
    data._autoresponse = `Thank you for choosing Durham's Crown Mobile Detailing! We have received your booking request for ${data.date} at ${data.time}. One of our team members will contact you shortly to officially confirm your appointment.`;

    try {
      // Using FormSubmit for email notifications (works on Netlify too)
      await fetch("https://formsubmit.co/ajax/durhamscrowndetailing@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      setSubmitted(true);
      setTimeout(() => {
          setSubmitted(false);
          setSelectedDate(undefined);
          setSelectedTime(null);
      }, 8000);
    } catch (error) {
      console.error(error);
      alert("There was an error submitting the form. Please try again or contact us directly at durhamscrowndetailing@gmail.com.");
    } finally {
      setIsSubmitting(false);
    }
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
               <p className="text-zinc-500 text-sm">
                 We've received your request and will contact you shortly to confirm!
               </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-sm border border-zinc-800 shadow-xl flex flex-col gap-10">
              
              {/* Fake field for spam prevention via formsubmit */}
              <input type="text" name="_honey" style={{ display: 'none' }} />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              
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
                      disabled={[{ before: today }]}
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
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "py-3 px-4 rounded-sm border text-sm font-semibold tracking-wide transition-all",
                            isSelected 
                              ? "bg-gold-500 border-gold-500 text-black shadow-lg" 
                              : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-gold-500/50 hover:bg-zinc-900"
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
                          <option>Car / Coupe / Sedan</option>
                          <option>A Mid-Size SUV (+CA$25.00)</option>
                          <option>A Large SUV / Truck / Van (+CA$40.00)</option>
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
                      className="block w-full bg-gold-500 px-3.5 py-4 text-center text-sm font-bold text-black shadow-lg hover:bg-gold-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 uppercase tracking-widest transition-all hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0"
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
