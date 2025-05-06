import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import { testimonials } from "@/components/data/testimonials"

export function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">What Our Guests Say</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Discover why discerning travelers choose QuickStay for their luxury accommodations around the world.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center mb-4">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-muted-foreground">{testimonial.comment}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 