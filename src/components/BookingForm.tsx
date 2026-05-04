import React, { useState } from "react";
import { CheckCircle2, Calendar, Clock, ChevronRight } from "lucide-react";
import { format, addDays, startOfToday } from "date-fns";
import { cn } from "../lib/utils";

const TIME_SLOTS = ["08:00 AM", "10:30 AM", "01:00 PM", "03:30 PM"];

export function BookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Generate next 7 days starting from tomorrow
  const today = startOfToday();
  const availableDates = Array.from({ length: 7 }).map((_, i) => addDays(today, i + 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    
    // In a real app, this would send data to a backend or CRM.
    setSubmitted(true);
    setTimeout(() => {
        setSubmitted(false);
        setSelectedDate(null);
        setSelectedTime(null);
    }, 5000);
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
            Select your preferred date and time to secure your spot directly.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20">
          {submitted ? (
            <div className="bg-zinc-900/80 border border-gold-500/30 p-8 rounded-sm text-center flex flex-col items-center animate-in fade-in zoom-in duration-300">
               <CheckCircle2 className="w-16 h-16 text-gold-500 mb-4" />
               <h3 className="text-2xl font-heading text-white font-bold mb-2">Booking Confirmed!</h3>
               <p className="text-zinc-400 text-lg">
                 Your appointment is scheduled for {selectedDate && format(selectedDate, 'EEEE, MMMM do')} at {selectedTime}.
                 We will see you then!
               </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-sm border border-zinc-800 shadow-xl flex flex-col gap-10">
              
              {/* Step 1: Select Date */}
              <div>
                 <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-gold-500" />
                    <h3 className="text-lg font-heading font-medium text-white">1. Select Date</h3>
                 </div>
                 <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                   {availableDates.map(date => {
                     const isSelected = selectedDate?.getTime() === date.getTime();
                     return (
                       <button
                         key={date.toISOString()}
                         type="button"
                         onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                         className={cn(
                           "flex flex-col items-center justify-center p-3 rounded-sm border transition-all",
                           isSelected 
                             ? "bg-gold-500 border-gold-500 text-black shadow-lg" 
                             : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-gold-500/50 hover:bg-zinc-900"
                         )}
                       >
                         <span className={cn("text-xs uppercase tracking-wider font-semibold", isSelected ? "text-black/80" : "text-zinc-500")}>
                           {format(date, 'EEE')}
                         </span>
                         <span className="text-xl font-bold mt-1">
                           {format(date, 'd')}
                         </span>
                       </button>
                     );
                   })}
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
                    {TIME_SLOTS.map(time => {
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
                          <option>Mid-size SUV (+24.99)</option>
                          <option>Standard SUV (+34.99)</option>
                          <option>Big SUV / Truck(+39.99)</option>
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
                          <option>Basic Wash ($69)</option>
                          <option>Standard Wash ($99)</option>
                          <option>Premium Detail ($149)</option>
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
                      className="block w-full bg-gold-500 px-3.5 py-4 text-center text-sm font-bold text-black shadow-lg hover:bg-gold-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 uppercase tracking-widest transition-all hover:-translate-y-1"
                    >
                      Confirm Booking for {selectedTime}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
