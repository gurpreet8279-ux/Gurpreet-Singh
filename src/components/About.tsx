import { ShieldCheck, Target, Award } from "lucide-react";

export function About() {
  return (
    <section id="about" className="bg-black py-24 sm:py-32 relative isolate overflow-hidden border-t border-zinc-900 border-b">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-900/20 via-black to-black"></div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-gold-500 tracking-widest uppercase">About Us</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white font-heading sm:text-5xl drop-shadow-lg">
            Durham's Crown Mobile Detailing
          </p>
          <p className="mt-6 text-lg leading-8 text-zinc-400 font-light">
            We are dedicated to providing the highest level of automotive care in the Durham area. 
            We believe that your vehicle is an extension of yourself, and it deserves to be treated like royalty.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 bg-zinc-950/50 rounded-sm border border-zinc-800/50 shadow-xl transition-all hover:border-gold-500/30 hover:bg-zinc-900/50">
              <dt className="flex items-center gap-x-3 text-xl font-heading font-semibold leading-7 text-white mt-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10 ring-1 ring-gold-500/20 mb-4">
                   <Award className="h-6 w-6 text-gold-500" aria-hidden="true" />
                </div>
                Premium Quality
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-400">
                <p className="flex-auto">We use only the finest industry-leading products to ensure your vehicle's finish is protected and shines brilliantly.</p>
              </dd>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-zinc-950/50 rounded-sm border border-zinc-800/50 shadow-xl transition-all hover:border-gold-500/30 hover:bg-zinc-900/50">
              <dt className="flex items-center gap-x-3 text-xl font-heading font-semibold leading-7 text-white mt-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10 ring-1 ring-gold-500/20 mb-4">
                   <ShieldCheck className="h-6 w-6 text-gold-500" aria-hidden="true" />
                </div>
                Trusted Expertise
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-400">
                <p className="flex-auto">Fully trained, insured, and experienced in handling delicate clear coats, luxury interiors, and exotic paints.</p>
              </dd>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-zinc-950/50 rounded-sm border border-zinc-800/50 shadow-xl transition-all hover:border-gold-500/30 hover:bg-zinc-900/50">
              <dt className="flex items-center gap-x-3 text-xl font-heading font-semibold leading-7 text-white mt-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10 ring-1 ring-gold-500/20 mb-4">
                   <Target className="h-6 w-6 text-gold-500" aria-hidden="true" />
                </div>
                Unmatched Convenience
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-zinc-400">
                <p className="flex-auto">We are entirely mobile. We bring water, power, and our passion for detailing straight to your driveway or workplace.</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
