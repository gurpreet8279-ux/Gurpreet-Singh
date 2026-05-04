import { motion } from "motion/react";
import { Sparkles, Shield, Clock } from "lucide-react";

export function Hero() {
  return (
    <div className="relative bg-zinc-950 isolate overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <img
        src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2940&auto=format&fit=crop"
        alt="Luxurious black car being detailed"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30 object-center"
      />
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
         <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-gold-600 to-zinc-900 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-24 sm:mt-32 lg:mt-16"
          >
            <a href="#pricing" className="inline-flex space-x-6">
              <span className="rounded-full bg-gold-500/10 px-3 py-1 text-sm font-semibold leading-6 text-gold-400 ring-1 ring-inset ring-gold-500/20 uppercase tracking-widest">
                New Promotion
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-zinc-300">
                <span>View our $199 Special</span>
                <span aria-hidden="true">&rarr;</span>
              </span>
            </a>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-10 font-heading text-5xl font-bold tracking-tight text-white sm:text-7xl shadow-black drop-shadow-xl"
          >
            Royalty Treatment <br/> For Your Vehicle
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg leading-8 text-zinc-300 font-light"
          >
            Durham's premier mobile auto detailing service. We bring the luxury wash, wax, and interior restoration directly to your home or office. Experience the crown difference.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex items-center gap-x-6"
          >
            <a
              href="#booking"
              className="bg-gold-500 px-8 py-4 text-sm font-bold text-black shadow-sm hover:bg-gold-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 uppercase tracking-widest transition-all hover:scale-105"
            >
              Book Appointment
            </a>
            <a href="#services" className="text-sm font-semibold leading-6 text-white hover:text-gold-400 transition-colors uppercase tracking-wider">
              Our Services <span aria-hidden="true">â</span>
            </a>
          </motion.div>
        </div>
        
        {/* Features list on the right for larger screens */}
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32 items-center">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none grid grid-cols-1 gap-8">
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8, delay: 0.8 }}
                 className="flex items-center gap-4 bg-zinc-900/60 backdrop-blur p-6 rounded-sm border border-zinc-800"
               >
                 <div className="bg-gold-500/20 p-3 rounded-full">
                    <Sparkles className="w-6 h-6 text-gold-500" />
                 </div>
                 <div>
                   <h3 className="text-white font-semibold font-heading tracking-wide">Pristine Detail</h3>
                   <p className="text-zinc-400 text-sm mt-1">Showroom quality finish, every time.</p>
                 </div>
               </motion.div>
               
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8, delay: 1.0 }}
                 className="flex items-center gap-4 bg-zinc-900/60 backdrop-blur p-6 rounded-sm border border-zinc-800 ml-0 lg:ml-12"
               >
                 <div className="bg-gold-500/20 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-gold-500" />
                 </div>
                 <div>
                   <h3 className="text-white font-semibold font-heading tracking-wide">We Come To You</h3>
                   <p className="text-zinc-400 text-sm mt-1">Home or office, entirely mobile.</p>
                 </div>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.8, delay: 1.2 }}
                 className="flex items-center gap-4 bg-zinc-900/60 backdrop-blur p-6 rounded-sm border border-zinc-800"
               >
                 <div className="bg-gold-500/20 p-3 rounded-full">
                    <Shield className="w-6 h-6 text-gold-500" />
                 </div>
                 <div>
                   <h3 className="text-white font-semibold font-heading tracking-wide">Premium Products</h3>
                   <p className="text-zinc-400 text-sm mt-1">Safe, high-end chemicals & waxes.</p>
                 </div>
               </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
}
