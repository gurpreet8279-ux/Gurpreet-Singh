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
            <p className="mt-4 md:mt-0 text-center md:text-left text-sm leading-6 text-zinc-400 md:ml-8 max-w-md">
              Bringing royalty-level auto detailing directly to your driveway. Servicing Durham and surrounding areas.
            </p>
          </div>
          
          <div className="mt-8 flex justify-center space-x-6 md:mt-0">
            <a href="#" className="text-zinc-500 hover:text-gold-500 transition-colors">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" aria-hidden="true" />
            </a>
            <a href="#" className="text-zinc-500 hover:text-gold-500 transition-colors">
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
