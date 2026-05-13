import { ShieldCheck, Target, Award } from "lucide-react";

export function About() {
  return (
    <section id="about" className="bg-black py-24 sm:py-32 relative isolate overflow-hidden border-t border-zinc-900 border-b">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-900/10 via-black to-black"></div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-xs font-semibold leading-7 text-gold-500 tracking-[0.2em] uppercase">About Us</h2>
          <p className="mt-4 text-4xl font-normal tracking-wide text-white font-heading sm:text-6xl">
            Durham's Crown Mobile Detailing
          </p>
          <p className="mt-8 text-lg leading-relaxed text-zinc-400 font-light max-w-xl mx-auto">
            We are dedicated to providing the highest level of automotive care across the Durham Region, including Pickering, Ajax, Whitby, Oshawa, and surrounding areas. 
            We believe that your vehicle is an extension of yourself, and it deserves to be treated like royalty right in your own driveway.
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col items-center text-center p-10 bg-transparent rounded-none border border-gold-600/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all hover:border-gold-500/40 hover:bg-zinc-950/30">
              <dt className="flex flex-col items-center text-xl font-heading font-normal leading-7 text-white mt-4 tracking-wide">
                <div className="flex h-16 w-16 items-center justify-center rounded-none bg-transparent border border-gold-500/30 mb-6">
                   <Award className="h-6 w-6 text-gold-400" aria-hidden="true" strokeWidth={1} />
                </div>
                Premium Quality
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-sm leading-relaxed text-zinc-400 font-light">
                <p className="flex-auto">We use only the finest industry-leading products to ensure your vehicle's finish is protected and shines brilliantly.</p>
              </dd>
            </div>
            
            <div className="flex flex-col items-center text-center p-10 bg-transparent rounded-none border border-gold-600/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all hover:border-gold-500/40 hover:bg-zinc-950/30">
              <dt className="flex flex-col items-center text-xl font-heading font-normal leading-7 text-white mt-4 tracking-wide">
                <div className="flex h-16 w-16 items-center justify-center rounded-none bg-transparent border border-gold-500/30 mb-6">
                   <ShieldCheck className="h-6 w-6 text-gold-400" aria-hidden="true" strokeWidth={1} />
                </div>
                Trusted Expertise
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-sm leading-relaxed text-zinc-400 font-light">
                <p className="flex-auto">Fully trained, insured, and experienced in handling delicate clear coats, luxury interiors, and exotic paints.</p>
              </dd>
            </div>
            
            <div className="flex flex-col items-center text-center p-10 bg-transparent rounded-none border border-gold-600/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all hover:border-gold-500/40 hover:bg-zinc-950/30">
              <dt className="flex flex-col items-center text-xl font-heading font-normal leading-7 text-white mt-4 tracking-wide">
                <div className="flex h-16 w-16 items-center justify-center rounded-none bg-transparent border border-gold-500/30 mb-6">
                   <Target className="h-6 w-6 text-gold-400" aria-hidden="true" strokeWidth={1} />
                </div>
                Unmatched Convenience
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-sm leading-relaxed text-zinc-400 font-light">
                <p className="flex-auto">We are entirely mobile. We bring water, power, and our passion for detailing straight to your driveway or workplace.</p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
