import { motion } from "motion/react";
import { Sparkles, Shield, Clock } from "lucide-react";

export function Hero() {
  return (
    <div className="relative bg-zinc-950 isolate overflow-hidden">
      {/* Luxurious Background Imagery & Overlays */}
      <div className="absolute inset-0 -z-20 bg-zinc-950" />
      <img
        src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2940&auto=format&fit=crop"
        alt="Premium mobile car detailing in Durham Region, Ontario"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40 object-center"
      />
      {/* Vignette & Gradient Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent mix-blend-multiply" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-zinc-950 via-zinc-950/50 to-transparent" />
      {/* Subtle Gold Ambient Glow */}
      <div className="absolute right-0 top-0 -z-10 transform-gpu overflow-hidden blur-[120px] pointer-events-none" aria-hidden="true">
         <div className="relative right-0 aspect-[1/1] w-[40rem] translate-x-1/4 -translate-y-1/4 rounded-full bg-gold-600 opacity-20" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-24 sm:mt-32 lg:mt-16"
          >
            <a href="#pricing" className="inline-flex space-x-6 items-center">
              <span className="rounded-none bg-gold-600/10 px-4 py-2 text-xs font-semibold leading-6 text-gold-400 border border-gold-500/30 uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(196,162,77,0.1)]">
                Exclusive Offer
              </span>
              <span className="inline-flex items-center space-x-2 text-xs font-medium leading-6 text-zinc-300 uppercase tracking-widest">
                <span>View our $199 Special</span>
                <span aria-hidden="true" className="text-gold-500 font-normal">&rarr;</span>
              </span>
            </a>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-8 mb-2"
          >
            <span className="text-gold-500 font-medium tracking-[0.2em] uppercase text-xs">
              From Durham, For Durham
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 font-heading text-5xl font-normal tracking-wide text-white sm:text-7xl shadow-black drop-shadow-2xl leading-tight"
          >
            Royalty Treatment <br/> <span className="font-normal text-gold-300">For Your Vehicle</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg leading-relaxed text-zinc-300 font-light max-w-xl"
          >
            Durham's premier mobile auto detailing service. We bring the luxury wash, wax, and interior restoration directly to your home or office. Experience the crown difference.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-8"
          >
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#booking"
                className="bg-gold-500 border border-gold-500 text-black hover:bg-gold-400 block rounded-none px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] transition-all"
              >
                Book Now
              </a>
              <a
                href="tel:437-663-3998"
                className="bg-transparent border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 block rounded-none px-8 py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] transition-all"
              >
                Contact
              </a>
            </div>
            
            <div className="flex flex-col items-start sm:ml-4 sm:border-l sm:border-zinc-800 sm:pl-8">
              <span className="text-zinc-500 text-[10px] uppercase tracking-[0.25em] mb-2 font-medium">Direct Line</span>
              <a href="tel:437-663-3998" className="text-zinc-300 text-base font-light hover:text-gold-400 transition-colors flex items-center gap-3">
                <span className="bg-zinc-900/50 p-2 border border-zinc-800">
                  <svg className="h-4 w-4 text-gold-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.273-3.973-6.869-6.869l1.293-.97c.362-.271.527-.733.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </span>
                <span className="tracking-widest">437-663-3998</span>
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Features list on the right for larger screens */}
        <div className="mx-auto mt-24 flex max-w-2xl sm:mt-32 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32 items-center">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none grid grid-cols-1 gap-6">
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8, delay: 0.8 }}
                 className="flex items-center gap-5 bg-zinc-950/40 backdrop-blur-md p-6 rounded-none border border-gold-500/20"
               >
                 <div className="bg-transparent border border-gold-500/40 p-4">
                    <Sparkles className="w-5 h-5 text-gold-400" strokeWidth={1.5} />
                 </div>
                 <div>
                   <h3 className="text-white font-normal font-heading tracking-wide text-lg">Pristine Detail</h3>
                   <p className="text-zinc-400 text-sm mt-1 font-light">Showroom quality finish, every time.</p>
                 </div>
               </motion.div>
               
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8, delay: 1.0 }}
                 className="flex items-center gap-5 bg-zinc-950/40 backdrop-blur-md p-6 rounded-none border border-gold-500/20 ml-0 lg:ml-16"
               >
                 <div className="bg-transparent border border-gold-500/40 p-4">
                    <Clock className="w-5 h-5 text-gold-400" strokeWidth={1.5} />
                 </div>
                 <div>
                   <h3 className="text-white font-normal font-heading tracking-wide text-lg">Mobile Convenience</h3>
                   <p className="text-zinc-400 text-sm mt-1 font-light">Discreet service at your home or office.</p>
                 </div>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8, delay: 1.2 }}
                 className="flex items-center gap-5 bg-zinc-950/40 backdrop-blur-md p-6 rounded-none border border-gold-500/20"
               >
                 <div className="bg-transparent border border-gold-500/40 p-4">
                    <Shield className="w-5 h-5 text-gold-400" strokeWidth={1.5} />
                 </div>
                 <div>
                   <h3 className="text-white font-normal font-heading tracking-wide text-lg">Premium Materials</h3>
                   <p className="text-zinc-400 text-sm mt-1 font-light">Safe, high-end chemicals & sealants.</p>
                 </div>
               </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
}
