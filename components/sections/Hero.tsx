'use client'
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cities, assets } from "@/app/assets/assets"
import heroImage from "@/app/assets/heroImage.png"

function formatDate(date: Date | undefined) {
  if (!date) return "Select date";
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export function Hero() {
  const [destination, setDestination] = useState<string>(cities[0]);
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<number>(2);
  const [openCheckIn, setOpenCheckIn] = useState(false);
  const [openCheckOut, setOpenCheckOut] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulasi search, bisa diganti dengan router push atau lainnya
    console.log({ destination, checkIn, checkOut, guests });
  };

  return (
    <section className="relative h-screen flex items-center">
      <Image
        src={heroImage}
        alt="Luxury hotel with pool at sunset"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="container relative z-10 mx-auto px-4 text-white">
        <div className="max-w-4xl">
          <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">The Ultimate Hotel Experience</Badge>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Discover Your Perfect <br /> Getaway Destination
          </h1>
          <p className="mb-8 max-w-xl text-lg text-white/90">
            Experience luxury and comfort at some of the world's finest hotels and resorts. Find your perfect stay.
          </p>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg px-4 py-3 flex flex-col md:flex-row items-center gap-2 max-w-4xl mx-auto shadow">
            {/* Destination */}
            <div className="flex flex-col flex-1 min-w-[120px]">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Image src={assets.locationIcon} alt="Location" width={18} height={18} />
                <span>Destination</span>
              </div>
              <select
                id="destinationInput"
                className="appearance-none bg-transparent font-bold text-black text-base outline-none border-0 p-0 cursor-pointer"
                value={destination}
                onChange={e => setDestination(e.target.value)}
              >
                {cities.map((city) => (
                  <option key={city} value={city} className="text-black">{city}</option>
                ))}
              </select>
            </div>

            {/* Check in */}
            <div className="flex flex-col flex-1 min-w-[120px]">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Image src={assets.calenderIcon} alt="Calendar" width={18} height={18} />
                <span>Check in</span>
              </div>
              <Popover open={openCheckIn} onOpenChange={setOpenCheckIn}>
                <PopoverTrigger asChild>
                  <button type="button" className="bg-transparent font-bold text-black text-base outline-none border-0 p-0 cursor-pointer text-left w-full" onClick={() => setOpenCheckIn(true)}>
                    {checkIn ? formatDate(checkIn) : ""}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={checkIn} onSelect={(date: Date | undefined) => { setCheckIn(date); setOpenCheckIn(false); }} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check out */}
            <div className="flex flex-col flex-1 min-w-[120px]">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Image src={assets.calenderIcon} alt="Calendar" width={18} height={18} />
                <span>Check out</span>
              </div>
              <Popover open={openCheckOut} onOpenChange={setOpenCheckOut}>
                <PopoverTrigger asChild>
                  <button type="button" className="bg-transparent font-bold text-black text-base outline-none border-0 p-0 cursor-pointer text-left w-full" onClick={() => setOpenCheckOut(true)}>
                    {checkOut ? formatDate(checkOut) : ""}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={checkOut} onSelect={(date: Date | undefined) => { setCheckOut(date); setOpenCheckOut(false); }} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guests */}
            <div className="flex flex-col flex-1 min-w-[80px]">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <span>Guests</span>
              </div>
              <input
                type="number"
                id="guests"
                min={1}
                max={4}
                value={guests}
                onChange={e => setGuests(Number(e.target.value))}
                className="bg-transparent font-bold text-black text-base outline-none border-0 p-0 max-w-16 text-left"
              />
            </div>

            {/* Search Button */}
            <button type="submit" className="flex items-center justify-center gap-2 rounded-md bg-black py-3 px-6 text-white font-semibold text-base my-auto cursor-pointer max-md:w-full max-md:py-2 min-w-[120px]">
              <Image src={assets.searchIcon} alt="Search" width={18} height={18} className="text-white" />
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
} 