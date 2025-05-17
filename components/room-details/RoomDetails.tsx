"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { differenceInDays } from "date-fns";
import { useSession } from "next-auth/react";
import { CheckCircle2 } from "lucide-react";
import { createBooking } from "@/app/my-bookings/actions";

type Room = {
  id: string;
  room_number: string;
  room_type: string;
  price_per_night: number;
  capacity: number;
  amenities: string[];
  is_available: boolean;
  room_images: {
    image_url: string;
    is_primary: boolean;
  }[];
};

export default function RoomDetails({ roomId }: { roomId: string }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isDateAvailable, setIsDateAvailable] = useState(true);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  // Fetch room details
  useEffect(() => {
    if (!roomId) return;

    const fetchRoomDetails = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select(
          `
          id,
          room_number,
          room_type,
          price_per_night,
          capacity,
          amenities,
          is_available,
          room_images (
            image_url,
            is_primary
          )
        `
        )
        .eq("id", roomId)
        .single();

      if (!error && data) {
        setRoom({
          ...data,
          room_images: data.room_images || [],
        });
      }
      setLoading(false);
    };

    fetchRoomDetails();
  }, [roomId]);

  // Cek ketersediaan tanggal booking (hanya booking confirmed yang mencegah booking)
  useEffect(() => {
    const checkAvailability = async () => {
      setIsDateAvailable(true);
      setBookingError(null);
      if (!checkIn || !checkOut || !room) return;
      setCheckingAvailability(true);

      // Cek booking confirmed yang overlap dengan tanggal yang dipilih
      const { data: confirmedBookings } = await supabase
        .from("bookings")
        .select("id")
        .eq("room_id", room.id)
        .eq("status", "confirmed")
        .or(
          `and(check_in_date,lt.${checkOut}),and(check_out_date,gt.${checkIn})`
        );

      // Jika ada booking confirmed yang overlap, tidak bisa booking
      setIsDateAvailable(!confirmedBookings || confirmedBookings.length === 0);
      setCheckingAvailability(false);
    };

    if (checkIn && checkOut && room) {
      checkAvailability();
    } else {
      setIsDateAvailable(true);
    }
  }, [checkIn, checkOut, room]);

  useEffect(() => {
    if (checkIn && checkOut && room) {
      const days = differenceInDays(new Date(checkOut), new Date(checkIn));
      setTotalPrice(days > 0 ? days * room.price_per_night : 0);
    }
  }, [checkIn, checkOut, room]);

  // Cancel all pending bookings yang overlap jika ada yang confirmed
  const autoCancelOverlappingPending = async (confirmedBookingId: string) => {
    // Ambil data booking confirmed
    const { data: confirmedBooking } = await supabase
      .from("bookings")
      .select("check_in_date,check_out_date")
      .eq("id", confirmedBookingId)
      .single();

    if (!confirmedBooking) return;

    // Cari semua booking pending yang overlap
    const { data: pendingBookings } = await supabase
      .from("bookings")
      .select("id")
      .eq("room_id", roomId)
      .eq("status", "pending")
      .or(
        `and(check_in_date,lt.${confirmedBooking.check_out_date}),and(check_out_date,gt.${confirmedBooking.check_in_date})`
      );

    // Batalkan semua booking pending yang overlap
    if (pendingBookings && pendingBookings.length > 0) {
      for (const b of pendingBookings) {
        await supabase
          .from("bookings")
          .update({ status: "cancelled" })
          .eq("id", b.id);
      }
    }
  };

  // Pantau perubahan booking confirmed, lalu auto-cancel pending yang overlap
  useEffect(() => {
    const channel = supabase
      .channel("booking-status")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookings" },
        (payload) => {
          if (
            payload.new.status === "confirmed" &&
            payload.old.status !== "confirmed"
          ) {
            autoCancelOverlappingPending(payload.new.id);
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const handleBooking = async () => {
    setBookingError(null);
    if (!session || !session.user) {
      router.push("/login");
      return;
    }
    if (!room) {
      setBookingError("Room not found.");
      return;
    }
    if (!isDateAvailable) {
      setBookingError("Room is not available for the selected dates.");
      return;
    }
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
      setBookingError("User ID not found. Please re-login.");
      return;
    }
    const result = await createBooking({
      user_id: userId,
      room_id: room.id,
      check_in_date: checkIn,
      check_out_date: checkOut,
      total_price: totalPrice,
    });
    if (!result.success) {
      setBookingError(result.error || "Booking failed");
    } else {
      setBookingSuccess(true);
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  if (!room) {
    return (
      <p className="text-center mt-10 text-red-500">
        Room not found or an error occurred.
      </p>
    );
  }

  const primaryImage =
    room.room_images.find((img) => img.is_primary)?.image_url ||
    room.room_images[0]?.image_url ||
    "/fallback.jpg";

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl mt-16">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="aspect-video relative w-full">
          <Image
            src={primaryImage}
            alt={room.room_type}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">
            Room {room.room_number}
          </h1>
          <p className="text-lg text-gray-500 mb-4">{room.room_type}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="mb-2">
                <span className="font-semibold text-gray-700">
                  Price per night:
                </span>{" "}
                <span className="text-black font-semibold">
                  Rp. {room.price_per_night.toLocaleString()}
                </span>
              </p>
              <p className="mb-2">
                <span className="font-semibold text-gray-700">Capacity:</span>{" "}
                {room.capacity} person(s)
              </p>
              <p className="mb-2">
                <span className="font-semibold text-gray-700">Status:</span>{" "}
                <Badge
                  className={`${
                    isDateAvailable
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  } font-medium px-3 py-1 rounded-full`}
                >
                  {isDateAvailable ? "Available" : "Not Available"}
                </Badge>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-700">
                Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {room.amenities.length > 0 ? (
                  room.amenities.map((amenity, index) => (
                    <Badge
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                    >
                      <span className="text-xs">{amenity}</span>
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No amenities listed.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-6">
            <Button variant="outline" onClick={() => router.push("/list-rooms")} className="cursor-pointer">
              Back to Room List
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button disabled={!isDateAvailable || checkingAvailability} className="cursor-pointer">
                  Book Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="cursor-pointer">Booking Room {room.room_number}</DialogTitle>
                </DialogHeader>

                {bookingSuccess ? (
                  <div className="flex flex-col items-center gap-3 py-6">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                    <p className="text-green-600 font-semibold text-lg mb-2">
                      Booking successful!
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => router.push("/list-rooms")}
                    >
                      Back to Room List
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1 text-gray-700">
                        Check-in Date
                      </label>
                      <Input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-gray-700">
                        Check-out Date
                      </label>
                      <Input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                      />
                    </div>

                    <div className="text-sm text-gray-700">
                      Total Price:{" "}
                      <span className="font-semibold text-black">
                        Rp. {totalPrice.toLocaleString()}
                      </span>
                    </div>

                    {!isDateAvailable && (
                      <div className="text-red-600 text-sm font-medium">
                        Room is not available for the selected dates.
                      </div>
                    )}
                    {bookingError && (
                      <div className="text-red-600 text-sm font-medium">{bookingError}</div>
                    )}
                    <Button
                      className="w-full"
                      disabled={
                        !checkIn ||
                        !checkOut ||
                        totalPrice <= 0 ||
                        !isDateAvailable ||
                        checkingAvailability
                      }
                      onClick={handleBooking}
                    >
                      {checkingAvailability
                        ? "Checking..."
                        : !isDateAvailable
                        ? "Room Not Available"
                        : "Confirm Booking"}
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}