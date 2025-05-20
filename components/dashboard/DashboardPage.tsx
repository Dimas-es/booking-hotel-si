"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, CreditCard, Hotel, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Booking = {
  id: string;
  user_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: string;
  created_at: string;
  user?: { name: string; image: string | null };
  room?: { room_number: string };
};

type Room = {
  id: string;
  room_number: string;
  price_per_night: number;
  room_type: string;
  amenities: string[];
  capacity: number;
  room_images: { image_url: string }[];
};

type User = {
  id: string;
  name: string | null;
  image: string | null;
  created_at: string | null;
};

export default function DashboardPage() {
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalRooms, setTotalRooms] = useState(0);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [topRooms, setTopRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    // Total Bookings
    const { count: bookingsCount } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true });
    setTotalBookings(bookingsCount || 0);

    // Total Revenue (sum of total_price where status = confirmed)
    const { data: revenueData } = await supabase
      .from("bookings")
      .select("total_price, status");
    const revenue = (revenueData || [])
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + (b.total_price || 0), 0);
    setTotalRevenue(revenue);

    // Total Users
    const { count: usersCount } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });
    setTotalUsers(usersCount || 0);

    // Total Rooms
    const { count: roomsCount } = await supabase
      .from("rooms")
      .select("*", { count: "exact", head: true });
    setTotalRooms(roomsCount || 0);

    // Recent Bookings (join user & room)
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*, user:users(id, name, image), room:rooms(id, room_number)")
      .order("created_at", { ascending: false })
      .limit(4);
    setRecentBookings(bookingsData || []);

    // Top Rooms (by booking count)
    const { data: topRoomsData } = await supabase
      .from("rooms")
      .select("*, room_images(image_url)");
    // Count bookings per room
    const { data: bookingsAll } = await supabase
      .from("bookings")
      .select("room_id");
    const roomBookingCount: Record<string, number> = {};
    (bookingsAll || []).forEach((b) => {
      if (b.room_id) {
        roomBookingCount[b.room_id] = (roomBookingCount[b.room_id] || 0) + 1;
      }
    });
    // Sort by booking count desc, ambil 4 teratas
    const sortedRooms =
      (topRoomsData || [])
        .map((room) => ({
          ...room,
          bookingCount: roomBookingCount[room.id] || 0,
        }))
        .sort((a, b) => b.bookingCount - a.bookingCount)
        .slice(0, 4) || [];
    setTopRooms(sortedRooms);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back to QuickStay Admin
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 dark:bg-neutral-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Bookings
                </p>
                <p className="text-3xl font-bold mt-1">
                  {totalBookings.toLocaleString()}
                </p>
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
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold mt-1">
                  Rp. {totalRevenue.toLocaleString("id-ID")}
                </p>
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
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-3xl font-bold mt-1">
                  {totalUsers.toLocaleString()}
                </p>
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
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Rooms
                </p>
                <p className="text-3xl font-bold mt-1">
                  {totalRooms.toLocaleString()}
                </p>
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
            <Link href="/dashboard/bookings">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 cursor-pointer"
              >
                View All <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800"
                >
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={
                        booking.user?.image
                          ? booking.user.image
                          : "/placeholder.svg"
                      }
                      alt={booking.user?.name || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">
                      Room {booking.room?.room_number || "-"}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span className="truncate">
                        {booking.user?.name || "-"}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>
                        {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
                        {new Date(booking.check_out_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      Rp. {booking.total_price.toLocaleString("id-ID")}
                    </p>
                    <Badge
                      className={`mt-1 ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Top Rooms</CardTitle>
            <Link href="/dashboard/rooms">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 cursor-pointer"
              >
                View All <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRooms.map((room, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800"
                >
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={
                        room.room_images?.[0]?.image_url || "/placeholder.svg"
                      }
                      alt={room.room_number}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold">Room {room.room_number}</h3>
                    <p className="text-sm">{room.room_type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      Rp. {room.price_per_night.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      per night
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
