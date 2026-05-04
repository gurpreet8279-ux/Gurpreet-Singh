import { ExternalLink, Calendar as CalendarIcon, ShieldCheck } from "lucide-react";

export function BookingForm() {
  return (
    <div id="booking" className="bg-zinc-950 py-24 sm:py-32 border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-gold-500 tracking-widest uppercase">Schedule Service</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white font-heading sm:text-5xl">
            Book Your Detail
          </p>
          <p className="mt-6 text-lg leading-8 text-zinc-400">
            For the fastest and most accurate scheduling, please use our official Square booking system. You'll be able to see our real-time availability and receive instant confirmation.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-xl sm:mt-20 flex flex-col items-center">
          <div className="bg-zinc-900 p-8 rounded-sm border border-zinc-800 shadow-xl w-full text-center flex flex-col items-center">
             <CalendarIcon className="w-16 h-16 text-gold-500 mb-6" />
             <h3 className="text-2xl font-bold text-white font-heading mb-4">Official Booking Portal</h3>
             <p className="text-zinc-400 mb-8">
                Click below to open our secure Square scheduling page. You can choose your package, vehicle size, and preferred date/time.
             </p>
             <a
               href="https://book.squareup.com/appointments/dubldw2m4ud8oa/location/LRAR77QXVVRXR/services"
               target="_blank"
               rel="noopener noreferrer"
               className="flex items-center justify-center w-full sm:w-auto bg-gold-500 px-8 py-4 text-center text-sm font-bold text-black shadow-lg hover:bg-gold-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 uppercase tracking-widest transition-all hover:-translate-y-1"
             >
               Book Now on Square
               <ExternalLink className="ml-2 w-5 h-5 flex-shrink-0" />
             </a>
             
             <div className="mt-8 flex items-center justify-center gap-2 text-sm text-zinc-500">
                <ShieldCheck className="w-4 h-4 text-gold-500" />
                <span>Secure booking with Square</span>
             </div>
          </div>
          
          <div className="mt-12 text-center text-zinc-500">
            <p>Having trouble booking? Email us directly at <a href="mailto:durhamscrowndetailing@gmail.com" className="text-gold-500 hover:text-gold-400 font-medium">durhamscrowndetailing@gmail.com</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}
