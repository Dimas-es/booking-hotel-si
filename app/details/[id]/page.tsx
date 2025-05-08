'use client'

import { roomsDummyData, hotelDummyData, roomCommonData } from "@/app/assets/assets"
import { useParams } from "next/navigation"
import { HotelTitle } from "@/components/details/HotelTitle"
import { PhotoGallery } from "@/components/details/PhotoGallery"
import { HotelInfo } from "@/components/details/HotelInfo"
import { LocationMap } from "@/components/details/LocationMap"
import { BookingCard } from "@/components/details/BookingCard"

export default function HotelDetail() {
  const params = useParams()
  const roomId = params.id as string
  const room = roomsDummyData.find(r => r._id === roomId)

  if (!room) {
    return <div>Room not found</div>
  }

  const description = `Guests are raving about this stunning property located in the heart of ${hotelDummyData.city}. This luxurious
    hotel offers breathtaking views of the city skyline. The price quoted is the best guest at the given
    spot please mark that the number of guests to get the exact price for groups. The rooms will be
    allocated ground floor according to availability. You get the home-feeling vibe because that feels
    like staying at home.`

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-4 py-8">
          <HotelTitle 
            hotelName={hotelDummyData.name}
            roomType={room.roomType}
            address={hotelDummyData.address}
          />

          <PhotoGallery images={room.images} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <HotelInfo 
                amenities={room.amenities}
                features={roomCommonData}
                city={hotelDummyData.city}
                description={description}
              />
              <LocationMap 
                city={hotelDummyData.city}
                address={hotelDummyData.address}
              />
            </div>
            <div>
              <BookingCard pricePerNight={room.pricePerNight} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 