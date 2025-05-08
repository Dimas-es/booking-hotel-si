"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, MapPin } from "lucide-react"

interface Booking {
  hotel: string
  location: string
  dates: string
  guests: number
  amount: number
  status: "Confirmed" | "Pending" | "Processing"
  image: string
}

interface RecentBookingsProps {
  bookings: Booking[]
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">Recent Bookings</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1">
          View All <ArrowUpRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                <Image 
                  src={booking.image} 
                  alt={booking.hotel} 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{booking.hotel}</h3>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <MapPin className="h-3 w-3 flex-shrink-0 mr-1" />
                  <span className="truncate">{booking.location}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <span>{booking.dates}</span>
                  <span className="mx-1">•</span>
                  <span>{booking.guests} guests</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">${booking.amount}</p>
                <Badge
                  className={`mt-1 ${
                    booking.status === "Confirmed"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                  }`}
                >
                  {booking.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 