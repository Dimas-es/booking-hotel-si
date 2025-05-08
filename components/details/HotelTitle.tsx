import { Badge } from "@/components/ui/badge"
import { MapPin, Star } from "lucide-react"

interface HotelTitleProps {
  hotelName: string
  roomType: string
  address: string
}

export function HotelTitle({ hotelName, roomType, address }: HotelTitleProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">{hotelName}</h1>
            <span className="text-sm text-gray-500">({roomType})</span>
            <Badge className="bg-orange-500 hover:bg-orange-600">25% OFF</Badge>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < 4 ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">200+ reviews</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{address}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 