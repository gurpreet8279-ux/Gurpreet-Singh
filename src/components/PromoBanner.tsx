import { Crown } from "lucide-react";

export function PromoBanner() {
  return (
    <div className="bg-gold-500 text-black px-4 py-3 text-center sm:px-6 lg:px-8 z-50 relative animate-in slide-in-from-top duration-500">
      <p className="text-sm font-semibold sm:text-base tracking-wide flex items-center justify-center gap-2">
        <Crown className="w-4 h-4" />
        LIMITED TIME PROMOTION: The "Crown Jewel" Full Detail Special Just $199!
        <Crown className="w-4 h-4" />
      </p>
    </div>
  );
}
