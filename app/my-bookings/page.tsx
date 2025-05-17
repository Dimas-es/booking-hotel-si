"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CalendarIcon, Download, MapPin, Search } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { getBookingsByUserId, type BookingWithDetails, updateBookingStatus, deleteBooking } from "./actions"
import { supabase } from "@/lib/supabase"

export default function MyBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancelLoadingId, setCancelLoadingId] = useState<string | null>(null)
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session?.user) {
      fetchBookings()
    }
  }, [status, session, router])

  const fetchBookings = async () => {
    if (!session || !session.user) return;
    let userId = (session.user as any)?.id;
    if (!userId && session.user?.email) {
      const { data: userProfile } = await supabase
        .from("users")
        .select("id")
        .eq("email", session.user.email)
        .single();
      userId = userProfile?.id;
    }
    if (!userId) return;
    setIsLoading(true);
    const data = await getBookingsByUserId(userId);
    setBookings(data);
    setIsLoading(false);
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!session || !session.user) return;
    setCancelLoadingId(bookingId);
    let userId = (session.user as any)?.id;
    if (!userId && session.user?.email) {
      const { data: userProfile } = await supabase
        .from("users")
        .select("id")
        .eq("email", session.user.email)
        .single();
      userId = userProfile?.id;
    }
    if (!userId) return;
    await updateBookingStatus({ booking_id: bookingId, status: "cancelled", user_id: userId });
    setCancelLoadingId(null);
    fetchBookings();
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!session || !session.user) return;
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    setDeleteLoadingId(bookingId);
    let userId = (session.user as any)?.id;
    if (!userId && session.user?.email) {
      const { data: userProfile } = await supabase
        .from("users")
        .select("id")
        .eq("email", session.user.email)
        .single();
      userId = userProfile?.id;
    }
    if (!userId) return;
    await deleteBooking({ booking_id: bookingId, user_id: userId });
    setDeleteLoadingId(null);
    fetchBookings();
  };

  // Filter bookings based on search query and status
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.room.room_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.room.room_number.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const pendingBookings = filteredBookings.filter((booking) => booking.status === "pending")
  const confirmedBooking = filteredBookings.filter((booking) => booking.status === "confirmed")
  const cancelledBookings = filteredBookings.filter((booking) => booking.status === "cancelled")

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen flex-col mt-16">
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-48 bg-gray-200 rounded"></div>
              <div className="h-4 w-96 bg-gray-200 rounded"></div>
              <div className="h-10 w-full max-w-md bg-gray-200 rounded"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col mt-16">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage your reservations and view your booking history</p>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                placeholder="Search by room type or number..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-6">
              {pendingBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No pending bookings</h3>
                  <p className="text-gray-500 mb-4">You don&#39;t have any pending reservations</p>
                  <Button asChild>
                    <Link href="/list-rooms">Find a room</Link>
                  </Button>
                </div>
              ) : (
                pendingBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    cancelLoadingId={cancelLoadingId}
                    handleCancelBooking={handleCancelBooking}
                    deleteLoadingId={deleteLoadingId}
                    handleDeleteBooking={handleDeleteBooking}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="confirmed" className="space-y-6">
              {confirmedBooking.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No confirmed bookings</h3>
                  <p className="text-gray-500 mb-4">You don&#39;t have any confirmed stays</p>
                  <Button asChild>
                    <Link href="/list-rooms">Find a room</Link>
                  </Button>
                </div>
              ) : (
                confirmedBooking.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-6">
              {cancelledBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No cancelled bookings</h3>
                  <p className="text-gray-500 mb-4">You don&#39;t have any cancelled reservations</p>
                  <Button asChild>
                    <Link href="/list-rooms">Find a room</Link>
                  </Button>
                </div>
              ) : (
                cancelledBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function BookingCard({
  booking,
  cancelLoadingId,
  handleCancelBooking,
  deleteLoadingId,
  handleDeleteBooking,
}: {
  booking: BookingWithDetails,
  cancelLoadingId?: string | null,
  handleCancelBooking?: (id: string) => void,
  deleteLoadingId?: string | null,
  handleDeleteBooking?: (id: string) => void
}) {
  const primaryImage = booking.room.room_images.find((img) => img.is_primary)?.image_url || booking.room.room_images[0]?.image_url

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative h-48 md:h-auto md:w-1/3 lg:w-1/4">
            <Image
              src={primaryImage || "/placeholder.svg"}
              alt={booking.room.room_type}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{booking.room.room_type}</h3>
                  <Badge
                    className={
                      booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        : booking.status === "confirmed"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>Room {booking.room.room_number}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Check-in</p>
                    <p className="font-medium">{new Date(booking.check_in_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Check-out</p>
                    <p className="font-medium">{new Date(booking.check_out_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Capacity</p>
                    <p className="font-medium">{booking.room.capacity} guests</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Price per night</p>
                    <p className="font-medium">Rp. {booking.room.price_per_night}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.room.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="bg-gray-50">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-2">
                  <p className="text-xs text-gray-500">Total amount</p>
                  <p className="font-bold text-lg">Rp. {booking.total_price}</p>
                </div>
                <Badge
                  className={
                    booking.status === "confirmed"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : booking.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }
                >
                  {booking.status === "confirmed" ? "Confirmed" : booking.status === "pending" ? "Pending" : "Refunded"}
                </Badge>
              </div>
            </div>
            <div className="border-t mt-4 pt-4 flex flex-wrap gap-2 justify-between items-center">
              <div className="text-sm text-gray-500">
                <span>Booking ID: </span>
                <span className="font-medium">{booking.id}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {booking.status === "confirmed" && (
                  <Button variant="outline" size="sm" className="gap-1 cursor-pointer">
                    <Download className="h-4 w-4" /> Invoice
                  </Button>
                )}
                {(booking.status === "pending" || booking.status === "cancelled") && handleDeleteBooking && (
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer" disabled={deleteLoadingId === booking.id} onClick={() => handleDeleteBooking(booking.id)}>{deleteLoadingId === booking.id ? "Deleting..." : "Delete"}</Button>
                )}
                <Button size="sm" className="cursor-pointer" asChild>
                  <Link href={`/my-bookings/${booking.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}