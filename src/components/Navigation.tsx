import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Pricing", href: "#pricing" },
    { name: "Booking", href: "#booking" },
  ];

  return (
    <header className="bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 border-b border-zinc-800">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 flex items-center gap-3 group">
            {/* Logo image - users should upload this to public/logo.png */}
            <img src="/logo.png" alt="Durham's Crown Logo" className="h-16 w-auto object-contain transition-transform group-hover:scale-105" onError={(e) => {
               // Fallback if logo is missing
               (e.target as HTMLImageElement).style.display = 'none';
               const fallback = document.getElementById('logo-fallback');
               if (fallback) fallback.style.display = 'flex';
            }} />
            <div id="logo-fallback" className="hidden flex-col items-start justify-center">
              <span className="font-heading text-xl font-bold tracking-wider text-white leading-tight">DURHAM'S CROWN</span>
              <span className="text-[10px] tracking-[0.2em] text-gold-500 font-medium uppercase">Mobile Detailing</span>
            </div>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-zinc-400"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navLinks.map((item) => (
            <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-zinc-300 hover:text-gold-500 transition-colors uppercase tracking-wider">
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#booking" className="text-sm font-semibold leading-6 text-black bg-gold-500 px-6 py-2.5 rounded-none hover:bg-gold-400 transition-colors uppercase tracking-wider">
            Book Now <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-zinc-900 border-b border-zinc-800 shadow-2xl">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-3 text-base font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white uppercase tracking-wider"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <a
              href="#booking"
              className="block mt-4 rounded-md bg-gold-500 px-3 py-3 text-center text-base font-medium text-black uppercase tracking-wider hover:bg-gold-400"
              onClick={() => setIsOpen(false)}
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
