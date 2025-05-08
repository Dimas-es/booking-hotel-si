"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Star } from "lucide-react"

interface Hotel {
  name: string
  location: string
  rating: number
  reviewCount: number
  price: number
  image: string
}

interface TopHotelsProps {
  hotels: Hotel[]
}

export function TopHotels({ hotels }: TopHotelsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">Top Hotels</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1">
          View All <ArrowUpRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hotels.map((hotel, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                <Image 
                  src={hotel.image} 
                  alt={hotel.name} 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{hotel.name}</h3>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <div className="flex mr-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < hotel.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span>{hotel.reviewCount} reviews</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">${hotel.price}</p>
                <p className="text-xs text-gray-500">per night</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 