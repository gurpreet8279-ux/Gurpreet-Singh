import { Navigation } from "./components/Navigation";
import { PromoBanner } from "./components/PromoBanner";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Pricing } from "./components/Pricing";
import { BookingForm } from "./components/BookingForm";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden selection:bg-gold-500/30">
      <PromoBanner />
      <Navigation />
      
      <main>
        <Hero />
        
        {/* Simple Services summary before Pricing can be good, or just rely on hero features. We'll use a visual break. */}
        <section id="services" className="bg-zinc-950 py-16 border-y border-zinc-900">
           <div className="max-w-7xl mx-auto px-6 text-center lg:px-8">
              <h2 className="text-3xl font-heading font-bold text-white mb-4">Why Choose Durham's Crown?</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                We don't just wash your car; we restore its glory. Using premium products and meticulous techniques, your vehicle gets the royal treatment it deserves, all from the convenience of your own home.
              </p>
           </div>
        </section>

        <Pricing />
        
        <About />
        
        <BookingForm />
      </main>

      <Footer />
    </div>
  );
}
