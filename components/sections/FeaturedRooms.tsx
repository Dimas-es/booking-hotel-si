"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

type Room = {
  id: string
  room_number: string
  room_type: string
  price_per_night: number
  capacity: number
  amenities: string[]
  is_available: boolean
  room_images: {
    image_url: string
    is_primary: boolean
  }[]
}

export function FeaturedRooms() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select(`
          id,
          room_number,
          room_type,
          price_per_night,
          capacity,
          amenities,
          is_available,
          room_images (
            image_url,
            is_primary
          )
        `)
        .limit(4)

      if (error) {
        console.error("Error fetching rooms:", error)
      } else if (data) {
        const formattedData = data.map((room: any) => ({
          ...room,
          room_number: String(room.room_number),
          capacity: Number(room.capacity),
          amenities: Array.isArray(room.amenities) ? room.amenities : [],
          room_images: Array.isArray(room.room_images)
            ? room.room_images.filter((img: any) => img.is_primary || room.room_images.length === 1)
            : [],
        }))
        setRooms(formattedData)
      }

      setLoading(false)
    }

    fetchRooms()
  }, [])

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Featured Rooms</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Discover our exclusive selection of rooms, each designed to provide the ultimate comfort and luxury for your stay.
        </p>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading rooms...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={room.room_images[0]?.image_url ?? "/fallback.jpg"}
                    alt={room.room_type}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-white text-black">
                    {room.room_type}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Room {room.room_number}</h3>
                      <p className="text-sm text-muted-foreground">
                        {room.amenities.length} amenities
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div>
                    <span className="font-bold">Rp. {room.price_per_night}</span>
                    <span className="text-sm text-muted-foreground"> /night</span>
                  </div>
                  <Link href={`/details/${room.id}`}>
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <Link href="/list-rooms" className="text-sm font-medium flex items-center hover:underline">
            View All Rooms <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
