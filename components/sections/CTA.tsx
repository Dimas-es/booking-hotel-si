import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-3xl font-bold mb-6">Plan Your Perfect Stay</h2>
        <p className="mb-8">
          Discover unbeatable deals and exclusive hotel packages designed for every kind of traveler. Secure your dream room now and make every trip unforgettable.
        </p>
        <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 transition-colors">
          Book Now
        </Button>
        <p className="text-sm mt-4 text-white/60">
          Enjoy flexible cancellation policies and best price guarantees on select rooms.
        </p>
      </div>
    </section>
  )
}