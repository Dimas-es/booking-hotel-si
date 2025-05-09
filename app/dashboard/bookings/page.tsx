import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table"
import { SearchIcon, Plus } from "lucide-react"

export default function BookingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Bookings</h1>
          <p className="text-gray-500">View and manage all reservations</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-1">
            <Plus className="h-4 w-4" /> Add New Booking
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Booking Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input placeholder="Search by name, hotel, or booking ID..." className="pl-9" />
              </div>
            </div>
            <div>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select defaultValue="newest">
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full">
                          <Image
                            src={booking.guestImage || "/placeholder.svg"}
                            alt={booking.guest}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span>{booking.guest}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-md">
                          <Image
                            src={booking.hotelImage || "/placeholder.svg"}
                            alt={booking.hotel}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span>{booking.hotel}</span>
                      </div>
                    </TableCell>
                    <TableCell>{booking.checkIn}</TableCell>
                    <TableCell>{booking.checkOut}</TableCell>
                    <TableCell>${booking.amount}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          booking.status === "Confirmed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : booking.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : booking.status === "Cancelled"
                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button size="sm">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const bookings = [
  {
    id: "B-10428",
    guest: "Emma Rodriguez",
    guestImage: "/placeholder.svg?height=32&width=32",
    hotel: "The Grand Resort",
    hotelImage: "/placeholder.svg?height=32&width=32",
    checkIn: "Sep 20, 2025",
    checkOut: "Sep 25, 2025",
    amount: 1495,
    status: "Confirmed",
  },
  {
    id: "B-10427",
    guest: "James Smith",
    guestImage: "/placeholder.svg?height=32&width=32",
    hotel: "Crystal Waters Resort",
    hotelImage: "/placeholder.svg?height=32&width=32",
    checkIn: "Sep 15, 2025",
    checkOut: "Sep 18, 2025",
    amount: 890,
    status: "Pending",
  },
  {
    id: "B-10426",
    guest: "Olivia Johnson",
    guestImage: "/placeholder.svg?height=32&width=32",
    hotel: "Skyline Lase Hotel",
    hotelImage: "/placeholder.svg?height=32&width=32",
    checkIn: "Oct 10, 2025",
    checkOut: "Oct 15, 2025",
    amount: 1250,
    status: "Confirmed",
  },
  {
    id: "B-10425",
    guest: "William Brown",
    guestImage: "/placeholder.svg?height=32&width=32",
    hotel: "The Regal Palace",
    hotelImage: "/placeholder.svg?height=32&width=32",
    checkIn: "Nov 05, 2025",
    checkOut: "Nov 10, 2025",
    amount: 2100,
    status: "Cancelled",
  },
  {
    id: "B-10424",
    guest: "Sophia Miller",
    guestImage: "/placeholder.svg?height=32&width=32",
    hotel: "Velvet Nights Inn",
    hotelImage: "/placeholder.svg?height=32&width=32",
    checkIn: "Aug 22, 2025",
    checkOut: "Aug 26, 2025",
    amount: 950,
    status: "Completed",
  },
  {
    id: "B-10423",
    guest: "Noah Davis",
    guestImage: "/placeholder.svg?height=32&width=32",
    hotel: "The Seaside Lodge",
    hotelImage: "/placeholder.svg?height=32&width=32",
    checkIn: "Sep 30, 2025",
    checkOut: "Oct 03, 2025",
    amount: 780,
    status: "Confirmed",
  },
]
