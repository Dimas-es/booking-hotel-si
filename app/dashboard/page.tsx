import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, CreditCard, Hotel, MapPin, Star, Users } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome back to QuickStay Admin</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Data</Button>
          <Button>Add New Property</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 dark:bg-neutral-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bookings</p>
                <p className="text-3xl font-bold mt-1">1,249</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">+12.5%</Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">from last month</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 dark:bg-neutral-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                <p className="text-3xl font-bold mt-1">$348,520</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">+8.2%</Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">from last month</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-green-600"
                >
                  <path d="M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
                  <path d="M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" />
                  <path d="M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12" />
                  <path d="M22 9c-4.29 0-7.14-2.33-10-7 .5 5.67-2 8.75-5 7" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 dark:bg-neutral-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold mt-1">8,492</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">+5.3%</Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">from last month</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 dark:bg-neutral-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Properties</p>
                <p className="text-3xl font-bold mt-1">542</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">+3.1%</Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">from last month</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-md bg-orange-100 flex items-center justify-center">
                <Hotel className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Recent Bookings</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={booking.image || "/placeholder.svg"}
                      alt={booking.hotel}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">{booking.hotel}</h3>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <MapPin className="h-3 w-3 flex-shrink-0 mr-1" />
                      <span className="truncate">{booking.location}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Top Hotels</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topHotels.map((hotel, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                    <Image src={hotel.image || "/placeholder.svg"} alt={hotel.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">{hotel.name}</h3>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">per night</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
const recentBookings = [
  {
    hotel: "The Grand Resort",
    location: "Los Angeles, California, USA",
    dates: "Sep 20 - Sep 25, 2025",
    guests: 2,
    amount: 1495,
    status: "Confirmed",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    hotel: "Crystal Waters Resort",
    location: "Miami Beach, Florida, USA",
    dates: "Sep 15 - Sep 18, 2025",
    guests: 3,
    amount: 890,
    status: "Pending",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    hotel: "Skyline Lase Hotel",
    location: "New York City, New York, USA",
    dates: "Oct 10 - Oct 15, 2025",
    guests: 1,
    amount: 1250,
    status: "Processing",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    hotel: "The Regal Palace",
    location: "Las Vegas, Nevada, USA",
    dates: "Nov 05 - Nov 10, 2025",
    guests: 2,
    amount: 2100,
    status: "Confirmed",
    image: "/placeholder.svg?height=64&width=64",
  },
]

const topHotels = [
  {
    name: "The Grand Resort",
    location: "Los Angeles, CA",
    rating: 4.8,
    reviewCount: 200,
    price: 450,
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Crystal Waters Resort",
    location: "Miami Beach, FL",
    rating: 4.6,
    reviewCount: 180,
    price: 350,
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Skyline Lase Hotel",
    location: "New York City, NY",
    rating: 4.9,
    reviewCount: 220,
    price: 550,
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "The Regal Palace",
    location: "Las Vegas, NV",
    rating: 4.7,
    reviewCount: 150,
    price: 400,
    image: "/placeholder.svg?height=48&width=48",
  },
]

