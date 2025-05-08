import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface LocationMapProps {
  city: string
  address: string
}

export function LocationMap({ city, address }: LocationMapProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Location on map</h2>
      <div className="relative h-[300px] w-full mb-4 rounded-lg overflow-hidden border">
        <Image
          src="/placeholder.svg?height=300&width=600&text=Map"
          alt="Location map"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
            Exact location provided after booking
          </Badge>
        </div>
      </div>

      <h3 className="font-bold mb-1">{city}</h3>
      <p className="text-gray-600 text-sm">{address}</p>
    </div>
  )
} 