import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-3xl font-bold mb-6">Stay Inspired</h2>
        <p className="mb-8">
          Join our newsletter and be the first to discover new destinations, exclusive offers, and travel inspiration.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
          <Button>Subscribe</Button>
        </div>
        <p className="text-sm mt-4 text-white/60">
          By subscribing, you agree to our Privacy Policy and consent to receive updates.
        </p>
      </div>
    </section>
  )
} 