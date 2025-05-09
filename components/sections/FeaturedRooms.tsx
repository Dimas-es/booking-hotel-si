import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronRight } from "lucide-react"
import { roomsDummyData, hotelDummyData } from "@/app/assets/assets"

export function FeaturedRooms() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Featured Rooms</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Discover our exclusive selection of rooms, each designed to provide the ultimate comfort and luxury for your stay.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roomsDummyData.map((room) => (
            <Card key={room._id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={room.images[0]}
                  alt={room.roomType}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-2 left-2 bg-white text-black">
                  {room.roomType}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{hotelDummyData.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {room.amenities.length} amenities
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
                    <span className="font-medium">4.8</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <div>
                  <span className="font-bold">${room.pricePerNight}</span>
                  <span className="text-sm text-muted-foreground"> /night</span>
                </div>
                <Link href={`/details/${room._id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link href="/list-rooms" className="text-sm font-medium flex items-center hover:underline">
            View All Rooms <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
