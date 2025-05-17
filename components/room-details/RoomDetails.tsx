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
  const router = useRouter();
  const { data: session, status } = useSession();

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

      if (error) {
        console.error("Error fetching room details:", error);
      } else {
        const formattedRoom = {
          ...data,
          room_number: String(data.room_number),
          capacity: Number(data.capacity),
          amenities: Array.isArray(data.amenities) ? data.amenities : [],
          room_images: data.room_images || [],
        };
        setRoom(formattedRoom);
      }
      setLoading(false);
    };

    fetchRoomDetails();
  }, [roomId]);

  useEffect(() => {
    if (checkIn && checkOut && room) {
      const days = differenceInDays(new Date(checkOut), new Date(checkIn));
      setTotalPrice(days > 0 ? days * room.price_per_night : 0);
    }
  }, [checkIn, checkOut, room]);

  const handleBooking = async () => {
    setBookingError(null);
    if (!session || !session.user) {
      if (typeof window !== "undefined") {
        const loginDialog = document.createElement("div");
        loginDialog.innerHTML = `<div style='background: white; border-radius: 12px; box-shadow: 0 2px 16px rgba(0,0,0,0.15); padding: 32px; max-width: 320px; margin: 100px auto; text-align: center; font-family: inherit;'>
          <div style='font-size: 2.5rem; color: #f59e42; margin-bottom: 12px;'>🔒</div>
          <div style='font-size: 1.1rem; margin-bottom: 16px;'>You must be logged in to book a room.</div>
          <button style='background: #2563eb; color: white; border: none; border-radius: 8px; padding: 10px 24px; font-size: 1rem; cursor: pointer;'>Login</button>
        </div>`;
        loginDialog.style.position = "fixed";
        loginDialog.style.top = "0";
        loginDialog.style.left = "0";
        loginDialog.style.width = "100vw";
        loginDialog.style.height = "100vh";
        loginDialog.style.background = "rgba(0,0,0,0.25)";
        loginDialog.style.zIndex = "9999";
        loginDialog.onclick = (e) => {
          if (e.target === loginDialog) loginDialog.remove();
        };
        loginDialog.querySelector("button")?.addEventListener("click", () => {
          router.push("/login");
          loginDialog.remove();
        });
        document.body.appendChild(loginDialog);
      }
      return;
    }
    if (!room) {
      setBookingError("Room not found.");
      return;
    }
    let userId = (session.user as any)?.id;
    if (!userId && session.user?.email) {
      // Fallback: fetch user id by email
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

  if (!roomId) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg text-gray-700 mb-4">Room Not Found</p>
        <Button variant="outline" onClick={() => router.push("/list-rooms")} className="cursor-pointer">
          Back to Rooms
        </Button>
      </div>
    );
  }

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
    room.room_images[0]?.image_url;

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl mt-16">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="aspect-video relative w-full">
          <Image
            src={primaryImage ?? "/fallback.jpg"}
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
                    room.is_available
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  } font-medium px-3 py-1 rounded-full`}
                >
                  {room.is_available ? "Available" : "Not Available"}
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
                <Button disabled={!room.is_available} className="cursor-pointer">Book Now</Button>
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

                    {bookingError && (
                      <div className="text-red-600 text-sm font-medium">{bookingError}</div>
                    )}
                    <Button
                      className="w-full"
                      disabled={!checkIn || !checkOut || totalPrice <= 0}
                      onClick={handleBooking}
                    >
                      Confirm Booking
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