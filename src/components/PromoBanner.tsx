import { Crown } from "lucide-react";

export function PromoBanner() {
  return (
    <div className="bg-zinc-950 border-b border-gold-600/30 text-gold-400 px-4 py-2 text-center sm:px-6 lg:px-8 z-50 relative animate-in slide-in-from-top duration-500 shadow-[0_0_15px_rgba(196,162,77,0.1)]">
      <p className="text-xs font-semibold tracking-[0.2em] flex items-center justify-center gap-3 uppercase">
        <Crown className="w-3.5 h-3.5 text-gold-500" strokeWidth={1.5} />
        Limited Offer: "The Crown Jewel" Package - Starts at $199
        <Crown className="w-3.5 h-3.5 text-gold-500" strokeWidth={1.5} />
      </p>
    </div>
  );
}
