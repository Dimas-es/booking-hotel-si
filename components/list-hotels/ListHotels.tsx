"use client"

import React, { useState } from "react"
import { MapPin, Wifi, Coffee, Bed, Mountain, Droplets } from "lucide-react"
import Image from "next/image"
import { roomsDummyData } from "../../app/assets/assets"
import type { JSX } from "react"

// Dummy filter options
const popularFilters = ["Single Bed", "Double Bed", "Suite", "Luxury Room"]
const priceRanges = ["$100 to $200", "$200 to $300", "$300 to $400"]
const sortOptions = ["Price Low to High", "Price High to Low", "Newest First"]

// Amenity icon map
const amenityIcons: Record<string, JSX.Element> = {
  "Free WiFi": <Wifi className="w-3 h-3 mr-1" />,
  "Free Breakfast": <Coffee className="w-3 h-3 mr-1" />,
  "Room Service": <Bed className="w-3 h-3 mr-1" />,
  "Mountain View": <Mountain className="w-3 h-3 mr-1" />,
  "Pool Access": <Droplets className="w-3 h-3 mr-1" />,
}

export default function HotelRooms() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl mt-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-medium mb-2">Hotel Rooms</h1>
        <p className="text-gray-600">
          Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Hotel Listings */}
        <div className="w-full lg:w-3/4 space-y-8">
          {roomsDummyData.map((room) => (
            <HotelCard
              key={room._id}
              id={room._id}
              name={room.hotel.name}
              location={room.hotel.city}
              address={room.hotel.address}
              roomType={room.roomType}
              price={room.pricePerNight}
              image={room.images[0]}
              amenities={room.amenities}
              isAvailable={room.isAvailable}
            />
          ))}
        </div>

        {/* Filter Sidebar */}
        <div className="w-full lg:w-1/4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium uppercase text-sm">Filters</h3>
              <button className="text-sm text-gray-500">CLEAR</button>
            </div>

            {/* Filters */}
            <FilterGroup title="Popular filters" options={popularFilters} />
            <FilterGroup title="Price" options={priceRanges} />
            <FilterGroup title="Sort by" options={sortOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Hotel Card Component
function HotelCard({
  id,
  name,
  location,
  address,
  roomType,
  price,
  image,
  amenities,
  isAvailable,
}: {
  id: string
  name: string
  location: string
  address: string
  roomType: string
  price: number
  image: string
  amenities: string[]
  isAvailable: boolean
}) {
  return (
    <div className="flex flex-col md:flex-row border border-gray-200 rounded-lg overflow-hidden">
      {/* Image */}
      <div className="md:w-1/3 h-48 md:h-auto relative">
        <Image src={image} alt={name} fill className="object-cover" unoptimized />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium px-3 py-1 bg-red-500 rounded">Not Available</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 md:p-6 flex-1">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <div className="text-sm text-gray-500 mb-1">{location}</div>
            <h3 className="text-xl font-medium mb-1">{name}</h3>
            <div className="text-sm font-medium text-gray-700 mb-2">{roomType}</div>
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{address}</span>
            </div>
          </div>
          <div className="mt-2 md:mt-0 md:text-right">
            <div className="text-xl font-semibold">
              ${price} <span className="text-sm font-normal">/night</span>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-3 mt-2">
          {amenities.map((amenity) => (
            <div key={amenity} className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded">
              {amenityIcons[amenity] || null}
              <span>{amenity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Checkbox Filter Group
function FilterGroup({ title, options }: { title: string; options: string[] }) {
  return (
    <div className="mb-6">
      <h4 className="font-medium text-sm mb-2">{title}</h4>
      <div className="space-y-2">
        {options.map((option) => (
          <FilterCheckbox key={option} label={option} />
        ))}
      </div>
    </div>
  )
}

// Checkbox Item
function FilterCheckbox({ label, onChange }: { label: string; onChange?: (label: string, checked: boolean) => void }) {
  const id = label.toLowerCase().replace(/\s+/g, "-")
  const [checked, setChecked] = useState(false)

  const handleChange = () => {
    const newValue = !checked
    setChecked(newValue)
    onChange?.(label, newValue)
  }

  return (
    <div className="flex items-center space-x-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label htmlFor={id} className="text-sm cursor-pointer">
        {label}
      </label>
    </div>
  )
}
