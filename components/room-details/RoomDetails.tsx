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
  const router = useRouter();

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
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId || !room) {
      alert("User not logged in or room not found.");
      return;
    }

    const { error } = await supabase.from("bookings").insert({
      user_id: userId,
      room_id: room.id,
      check_in_date: checkIn,
      check_out_date: checkOut,
      total_price: totalPrice,
    });

    if (error) {
      console.error("Booking failed:", error);
      alert("Booking failed");
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
                  <p className="text-green-600 font-medium">
                    Booking successful!
                  </p>
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