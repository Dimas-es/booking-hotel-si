import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { featuredHotels } from "@/components/data/hotels"

export function FeaturedHotels() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Featured Hotels</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Discover our handpicked collection of exceptional properties around the world, offering unparalleled luxury
          and unforgettable experiences.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredHotels.map((hotel, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative h-48">
                <Image src={hotel.image || "/placeholder.svg"} alt={hotel.name} fill className="object-cover" />
                <Badge className="absolute top-2 left-2 bg-white text-black">{hotel.tag}</Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{hotel.name}</h3>
                    <p className="text-sm text-muted-foreground">{hotel.features} features</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
                    <span className="font-medium">{hotel.rating}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div>
                  <span className="font-bold">${hotel.price}</span>
                  <span className="text-sm text-muted-foreground"> /night</span>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button variant="outline">View All Hotels</Button>
        </div>
      </div>
    </section>
  )
} 