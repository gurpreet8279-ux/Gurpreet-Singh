import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black py-16 border-t border-zinc-900 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gold-900/10 via-black to-black"></div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center flex-col md:flex-row items-center md:justify-start gap-4">
             <div className="flex items-center gap-3 group">
               <img src="/logo.png" alt="Durham's Crown Logo" className="h-20 w-auto object-contain" onError={(e) => {
                 (e.target as HTMLImageElement).style.display = 'none';
                 const fallback = document.getElementById('footer-logo-fallback');
                 if (fallback) fallback.style.display = 'flex';
               }} />
              <div id="footer-logo-fallback" className="hidden flex-col">
                <span className="font-heading text-xl font-bold tracking-wider text-white leading-tight">DURHAM'S CROWN</span>
                <span className="text-[10px] tracking-[0.2em] text-gold-500 font-medium uppercase">Mobile Detailing</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-center md:text-left text-sm leading-6 text-zinc-400 md:ml-8 max-w-md">
              <p>Bringing royalty-level auto detailing directly to your driveway.</p>
              <p className="mt-3 text-gold-500 font-medium flex items-center justify-center md:justify-start gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Serving Durham Region
              </p>
              <p className="mt-1 text-gold-500 font-medium flex items-center justify-center md:justify-start gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.273-3.973-6.869-6.869l1.293-.97c.362-.271.527-.733.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                437-663-3998
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center space-x-6 md:mt-0">
            <a href="https://www.facebook.com/share/1B27QoKmWf/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-gold-500 transition-colors">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" aria-hidden="true" />
            </a>
            <a href="https://www.instagram.com/durhams_crown_mobile_detailing?igsh=dHgwM2NpZHFxczd2&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-gold-500 transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" aria-hidden="true" />
            </a>
            <a href="#" className="text-zinc-500 hover:text-gold-500 transition-colors">
              <span className="sr-only">X</span>
              <Twitter className="h-6 w-6" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
           <p className="text-center md:text-left">
             &copy; {new Date().getFullYear()} Durham's Crown Mobile Detailing. All rights reserved.
           </p>
           <div className="flex gap-4">
              <a href="#" className="hover:text-gold-400">Privacy Policy</a>
              <a href="#" className="hover:text-gold-400">Terms of Service</a>
           </div>
        </div>
      </div>
    </footer>
  );
}
