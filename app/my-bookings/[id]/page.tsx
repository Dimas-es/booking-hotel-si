"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Download,
  MapPin,
  User,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  getBookingById,
  type BookingWithDetails,
  updateBookingStatus,
} from "../actions";
import { supabase } from "@/lib/supabase";

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user) {
      fetchBooking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, router]);

  const fetchBooking = async () => {
    setIsLoading(true);
    const data = await getBookingById(id);
    setBooking(data);
    setIsLoading(false);
  };

  const handleCancelBooking = async () => {
    setCancelError(null);
    setCancelLoading(true);
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
    if (!userId) {
      setCancelError("User ID not found. Please re-login.");
      setCancelLoading(false);
      return;
    }
    if (!booking) return;
    const result = await updateBookingStatus({
      booking_id: booking.id,
      status: "cancelled",
      user_id: userId,
    });
    setCancelLoading(false);
    if (!result.success) {
      setCancelError(result.error || "Failed to cancel booking");
    } else {
      fetchBooking();
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-48 bg-gray-200 rounded"></div>
              <div className="h-4 w-96 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-64 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-48 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex min-h-screen flex-col mt-16">
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
              <p className="text-gray-600 mb-6">
                The booking you&#39;re looking for doesn&#39;t exist or you
                don&#39;t have permission to view it.
              </p>
              <Button asChild>
                <Link href="/my-bookings">Back to My Bookings</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const primaryImage =
    booking.room.room_images.find((img) => img.is_primary)?.image_url ||
    booking.room.room_images[0]?.image_url;

  return (
    <div className="flex min-h-screen flex-col mt-16">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
            <div className="flex items-center gap-2">
              <p className="text-gray-600">Booking ID: {booking.id}</p>
              <Badge
                className={
                  booking.status === "pending"
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    : booking.status === "confirmed"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-red-100 text-red-800 hover:bg-red-100"
                }
              >
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Room Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative h-48 md:h-auto md:w-1/3">
                      <Image
                        src={primaryImage || "/placeholder.svg"}
                        alt={booking.room.room_type}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-1">
                        Room {booking.room.room_number}
                      </h2>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span>{booking.room.room_type}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Check-in</p>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                            <p className="font-medium">
                              {new Date(
                                booking.check_in_date
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Check-out</p>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                            <p className="font-medium">
                              {new Date(
                                booking.check_out_date
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Capacity</p>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1 text-gray-500" />
                            <p className="font-medium">
                              {booking.room.capacity} guests
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Price per night
                          </p>
                          <p className="font-medium">
                            Rp. {booking.room.price_per_night.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Amenities</p>
                        <div className="flex flex-wrap gap-2">
                          {booking.room.amenities.map((amenity, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-gray-50"
                            >
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardContent>
                  {booking.status === "pending" && (
                    <Button
                      variant="outline"
                      className="mt-4 text-red-600 hover:text-red-700 hover:bg-red-100 cursor-pointer"
                      disabled={cancelLoading}
                      onClick={handleCancelBooking}
                    >
                      {cancelLoading ? "Cancelling..." : "Cancel Booking"}
                    </Button>
                  )}
                  {cancelError && (
                    <div className="text-red-600 text-sm font-medium mt-2">
                      {cancelError}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Payment Status</p>
                      <Badge
                        className={
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : "bg-gray-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {booking.status === "confirmed"
                          ? "Confirmed"
                          : booking.status === "pending"
                          ? "Pending"
                          : "Cancelled"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Booking Date</p>
                      <p className="font-medium">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                        <p>Total</p>
                        <p>Rp. {booking.total_price.toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
