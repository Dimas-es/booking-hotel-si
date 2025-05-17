"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const popularFilters = ["Single Bed", "Double Bed", "Deluxe", "Vancy"];
const priceRanges = [
  "Rp. 100000 to Rp. 299999",
  "Rp. 300000 to Rp. 499999",
  "Up to Rp. 500000",
];
const sortOptions = ["Price Low to High", "Price High to Low", "Newest First"];

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

export default function ListRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [selectedFilters, setSelectedFilters] = useState({
    popular: [] as string[],
    price: [] as string[],
    sort: "" as string,
  });

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase.from("rooms").select(`
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
      `);

      if (error) {
        console.error("Error fetching rooms:", error);
      } else {
        const formattedData = data.map((room: any) => ({
          ...room,
          room_number: String(room.room_number),
          capacity: Number(room.capacity),
          amenities: Array.isArray(room.amenities) ? room.amenities : [],
          room_images: room.room_images.filter(
            (img: any) => img.is_primary || room.room_images.length === 1
          ),
        }));
        setRooms(formattedData);
        setFilteredRooms(formattedData);
      }
    };

    fetchRooms();
  }, []);

  // Hanya booking confirmed yang membuat room jadi Not Available
  useEffect(() => {
    const updateRoomAvailability = async () => {
      const today = new Date().toISOString().split("T")[0];
      if (rooms.length === 0) return;

      // Ambil semua booking confirmed yang overlap hari ini
      const { data: bookings } = await supabase
        .from("bookings")
        .select("room_id,check_in_date,check_out_date")
        .eq("status", "confirmed");

      setRooms((prev) =>
        prev.map((room) => {
          // Cek apakah ada booking confirmed yang overlap hari ini
          const hasConfirmed =
            bookings &&
            bookings.some(
              (b) =>
                b.room_id === room.id &&
                b.check_in_date <= today &&
                b.check_out_date > today
            );
          return {
            ...room,
            is_available: !hasConfirmed,
          };
        })
      );
      setFilteredRooms((prev) =>
        prev.map((room) => {
          const hasConfirmed =
            bookings &&
            bookings.some(
              (b) =>
                b.room_id === room.id &&
                b.check_in_date <= today &&
                b.check_out_date > today
            );
          return {
            ...room,
            is_available: !hasConfirmed,
          };
        })
      );
    };
    updateRoomAvailability();
  }, [rooms]);

  useEffect(() => {
    let filtered = [...rooms];

    if (selectedFilters.popular.length > 0) {
      filtered = filtered.filter((room) =>
        selectedFilters.popular.includes(room.room_type)
      );
    }

    if (selectedFilters.price.length > 0) {
      filtered = filtered.filter((room) => {
        return selectedFilters.price.some((range) => {
          const [min, max] = range
            .replace("Rp. ", "")
            .replace("Up to ", "0 to ")
            .split(" to ")
            .map((price) => parseInt(price.replace(/\./g, ""), 10));
          return room.price_per_night >= min && room.price_per_night <= max;
        });
      });
    }

    if (selectedFilters.sort === "Price Low to High") {
      filtered.sort((a, b) => a.price_per_night - b.price_per_night);
    } else if (selectedFilters.sort === "Price High to Low") {
      filtered.sort((a, b) => b.price_per_night - a.price_per_night);
    } else if (selectedFilters.sort === "Newest First") {
      filtered.sort((a, b) => b.id.localeCompare(a.id));
    }

    setFilteredRooms(filtered);
  }, [selectedFilters, rooms]);

  const handleFilterChange = (type: string, value: string) => {
    setSelectedFilters((prev) => {
      if (type === "sort") {
        return { ...prev, sort: value };
      }

      const current = prev[type as keyof typeof selectedFilters] as string[];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];

      return { ...prev, [type]: updated };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({ popular: [], price: [], sort: "" });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-medium mb-2">Hotel Rooms</h1>
        <p className="text-gray-600">
          Take advantage of our limited-time offers and special packages to
          enhance your stay and create unforgettable memories.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-3/4 space-y-10">
          {filteredRooms.map((room) => (
            <Link href={`/details/${room.id}`} key={room.id}>
              <HotelCard
                id={room.id}
                number={room.room_number}
                roomType={room.room_type}
                capacity={room.capacity}
                price={room.price_per_night}
                image={room.room_images[0]?.image_url ?? "/fallback.jpg"}
                amenities={room.amenities}
                isAvailable={room.is_available}
              />
            </Link>
          ))}
        </div>

        <aside className="w-full lg:w-1/4">
          <div className="bg-white shadow-md border border-gray-100 p-6 rounded-2xl sticky top-24 space-y-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-700">
                Filters
              </h3>
              <button
                className="text-sm text-indigo-500 hover:underline"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>
            <FilterGroup
              title="Popular filters"
              options={popularFilters}
              selected={selectedFilters.popular}
              onChange={(value) => handleFilterChange("popular", value)}
            />
            <FilterGroup
              title="Price Range"
              options={priceRanges}
              selected={selectedFilters.price}
              onChange={(value) => handleFilterChange("price", value)}
            />
            <FilterGroup
              title="Sort by"
              options={sortOptions}
              selected={[selectedFilters.sort]}
              onChange={(value) => handleFilterChange("sort", value)}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function HotelCard({
  id,
  number,
  roomType,
  capacity,
  price,
  image,
  amenities,
  isAvailable,
}: {
  id: string;
  number: string;
  roomType: string;
  capacity: number;
  price: number;
  image: string;
  amenities: string[];
  isAvailable: boolean;
}) {
  return (
    <div className="bg-white hover:shadow-lg transition-all duration-300 border border-gray-200 rounded-2xl overflow-hidden flex flex-col md:flex-row">
      <div className="md:w-1/3 h-64 md:h-auto relative">
        <Image
          src={image}
          alt={`Room ${number}`}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 transform hover:scale-105"
        />
      </div>
      <div className="p-6 flex flex-col justify-between md:w-2/3">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Room {number}
          </h2>
          <p className="text-sm text-gray-600">{roomType}</p>
          <p className="text-sm text-gray-500">
            Capacity: {capacity} person(s)
          </p>
          <div className="flex flex-wrap mt-3 gap-2">
            {amenities.map((amenity) => (
              <span
                key={amenity}
                className="text-xs bg-gray-200 text-black px-2 py-1 rounded-full"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center mt-5">
          <div className="text-lg font-semibold text-black">
            Rp. {price.toLocaleString("id-ID")}
            <span className="text-sm text-gray-500 ml-1">/night</span>
          </div>
          <span
            className={`text-sm font-medium ${
              isAvailable ? "text-green-600" : "text-red-500"
            }`}
          >
            {isAvailable ? "Available" : "Not Available"}
          </span>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onChange,
}: {
  title: string;
  options: string[];
  selected: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">{title}</h4>
      <div className="space-y-1">
        {options.map((option) => (
          <FilterCheckbox
            key={option}
            label={option}
            checked={selected.includes(option)}
            onChange={() => onChange(option)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center text-sm text-gray-600 cursor-pointer">
      <input
        type="checkbox"
        className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}