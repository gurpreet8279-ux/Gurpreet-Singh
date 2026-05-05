import { Check } from "lucide-react";
import { cn } from "../lib/utils";

const tiers = [
  {
    name: 'Silver Package',
    id: 'tier-silver',
    href: '#booking',
    price: '$179.99',
    description: 'Refresh your ride inside and out. Gives your vehicle a deep clean and a sleek finish—perfect for regular maintenance or getting your car ready for a special occasion. (Duration 1.5 - 2 Hours)',
    features: [
      'Full exterior wash for a clean, shiny finish',
      'Detailed wheel and rim cleaning',
      'Door jambs wiped down and cleaned',
      'Interior vacuum (seats, carpets, mats, and trunk)',
      'All interior surfaces wiped and cleaned (dash, panels, cupholders, etc.)',
      'Interior and exterior windows cleaned for clear visibility'
    ],
  },
  {
    name: 'Gold Package',
    id: 'tier-gold',
    href: '#booking',
    price: 'Starts at $199.99',
    description: 'Add more shine and protection to your vehicle. The Gold Package includes everything from the Silver Package, plus premium extras to take your car’s care to the next level.',
    features: [
      'Full exterior wash',
      'Detailed wheel and rim cleaning',
      'Door jambs cleaned',
      'Interior vacuum (seats, carpets, mats, and trunk)',
      'Interior surface wipe-down (dash, panels, cupholders, etc.)',
      'Interior and exterior window cleaning',
      'Tire dressing for a glossy, like-new look',
      'Steam-cleaned air vents',
      'Interior panels dressed for a clean finish and UV protection',
      'Underbody rinse to remove built-up debris'
    ],
  },
  {
    name: 'Platinum Package',
    id: 'tier-premium',
    href: '#booking',
    price: 'Starts at $249.99',
    description: 'The ultimate care for your vehicle. This top-tier package includes everything from the Gold Package plus exclusive upgrades to give your car the best treatment possible.',
    features: [
      'Full, meticulous exterior wash to restore shine',
      'Detailed wheel and rim cleaning',
      'Door jambs thoroughly cleaned',
      'Deep interior vacuum (seats, carpets, mats, trunk)',
      'All interior panels cleaned (dash, doors, cupholders, etc.)',
      'Interior and exterior windows cleaned for crystal-clear visibility',
      'Underbody rinse to remove debris',
      'Tire dressing for a glossy finish',
      'Steam-cleaned air vents',
      'Interior panels dressed for protection and shine',
      'Interior leather cleaned',
      'Steam clean entire interior for deep refresh',
      'Leather conditioning to restore and protect',
      'Carpet and seat shampoo to refresh upholstery',
      'Stain removal for a spotless interior',
      'Paint sealant for long-lasting protection and shine',
      'Rubber floor mats shined and dressed for durability and appearance'
    ],
  },
];

const vehicleUpcharges = [
  { type: "A Mid-Size SUV", price: "+CA$25.00", desc: "e.g., Honda CR-V, Toyota RAV4" },
  { type: "A Large SUV / Truck / Van", price: "+CA$40.00", desc: "e.g., Chevy Tahoe, Ford F-150, Minivans" },
];

export function Pricing() {
  return (
    <div id="pricing" className="bg-black py-24 sm:py-32 relative isolate">
       <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
         <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-gold-600 to-zinc-900 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-gold-500 tracking-widest uppercase">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white font-heading sm:text-5xl">
            Detailing Packages
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-zinc-400">
          Transparent pricing for premium service. Select the package that fits your needs.
        </p>
        
        {/* Pricing Tiers */}
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="ring-1 ring-zinc-800 bg-zinc-950/50 rounded-sm p-8 xl:p-10 transition-transform hover:scale-[1.02] relative"
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className="text-white text-xl font-semibold leading-8 font-heading tracking-wide"
                >
                  {tier.name}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-zinc-400">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className={cn("font-bold tracking-tight text-white", tier.price.includes('Starts at') ? "text-2xl" : "text-4xl")}>{tier.price}</span>
                <span className="text-sm font-semibold leading-6 text-zinc-400">/car</span>
              </p>
              <a
                href={tier.href}
                aria-describedby={tier.id}
                className="bg-white/10 text-white hover:bg-white/20 mt-6 block rounded-none px-3 py-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 uppercase tracking-widest transition-colors"
              >
                Book This Package
              </a>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-zinc-300 xl:mt-10">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-gold-500" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Limited Time Promo Separate Section */}
        <div className="mx-auto mt-16 max-w-4xl rounded-sm ring-2 ring-gold-500 bg-zinc-900/80 shadow-2xl shadow-gold-900/20 p-8 sm:p-10 relative isolate transition-transform hover:scale-[1.01]">
           <p className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gold-500 px-4 py-1 text-sm font-semibold uppercase tracking-widest text-black rounded-full shadow-lg whitespace-nowrap">
             Limited Time Offer
           </p>
           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="lg:w-2/3">
                 <h3 className="text-3xl font-bold font-heading tracking-wide text-gold-400">The Crown Jewel</h3>
                 <p className="mt-2 text-lg text-zinc-300">Our Interior Promotion Package. (Duration 1.5 - 2 Hours)</p>
                 <ul role="list" className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm leading-6 text-zinc-300">
                    <li className="flex gap-x-3 items-start"><Check className="h-5 w-5 flex-none text-gold-500 mt-0.5" /> Deep vacuum, steam clean (Vents included) & shampoo</li>
                    <li className="flex gap-x-3 items-start"><Check className="h-5 w-5 flex-none text-gold-500 mt-0.5" /> All panels & tight areas fully detailed</li>
                    <li className="flex gap-x-3 items-start"><Check className="h-5 w-5 flex-none text-gold-500 mt-0.5" /> Leather/Plastic cleaned & conditioned</li>
                    <li className="flex gap-x-3 items-start"><Check className="h-5 w-5 flex-none text-gold-500 mt-0.5" /> Salt & stain treatment throughout</li>
                    <li className="flex gap-x-3 items-start"><Check className="h-5 w-5 flex-none text-gold-500 mt-0.5" /> Minimal pet hair included (excessive may be extra)</li>
                 </ul>
                 <p className="mt-4 text-xs italic text-zinc-500">*Subject to an additional charge based on vehicle size*</p>
              </div>
              <div className="lg:w-1/3 flex flex-col lg:items-end">
                <p className="flex items-baseline gap-x-2 lg:justify-end">
                  <span className="text-3xl font-bold tracking-tight text-white">Starts at $199.99</span>
                </p>
                <p className="text-sm font-semibold leading-6 text-zinc-400 mt-1">/car</p>
                <a
                  href="#booking"
                  className="mt-6 w-full lg:w-auto bg-gold-500 text-black hover:bg-gold-400 block rounded-none px-8 py-3 text-center text-sm font-bold uppercase tracking-widest transition-colors"
                >
                  Book Promo
                </a>
              </div>
           </div>
        </div>

        {/* Vehicle Size Upcharges */}
        <div className="mx-auto mt-20 max-w-4xl bg-zinc-900 border border-zinc-800 p-8 rounded-sm">
           <h3 className="text-2xl font-bold font-heading text-white text-center mb-6">Additional Charges For Vehicle Size</h3>
           <p className="text-center text-zinc-400 mb-8 max-w-2xl mx-auto">
             Larger vehicles require more time and product to achieve our standard of perfection. 
             The following upcharges apply to all packages above based on vehicle size.
           </p>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {vehicleUpcharges.map((charge) => (
                <div key={charge.type} className="bg-zinc-950 p-6 rounded-sm border border-zinc-800 text-center flex flex-col justify-center">
                  <h4 className="text-lg font-semibold text-white mb-2">{charge.type}</h4>
                  <div className="text-2xl font-bold text-gold-400 mb-2">{charge.price}</div>
                  <p className="text-sm text-zinc-500">{charge.desc}</p>
                </div>
              ))}
           </div>
           
           <div className="mt-8 text-center text-xs text-zinc-600">
             * Extra dirty vehicles, excessive pet hair, or biohazards may incur additional fees determined upon inspection.
           </div>
        </div>
      </div>
    </div>
  )
}
