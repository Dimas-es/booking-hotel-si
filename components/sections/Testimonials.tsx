import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import { testimonials } from "@/app/assets/assets"

export function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">What Our Guests Say</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Discover why discerning travelers choose QuickStay for their luxury accommodations around the world.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6">
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    sizes="(max-width: 48px) 100vw, 48px"
                    className="rounded-full object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.address}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-muted-foreground">{testimonial.review}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 