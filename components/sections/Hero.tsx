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
  const [destination, setDestination] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState<string>("");
  const [openCheckIn, setOpenCheckIn] = useState(false);
  const [openCheckOut, setOpenCheckOut] = useState(false);
  const [focus, setFocus] = useState<{[key:string]: boolean}>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const guestsNumber = guests ? Number(guests) : undefined;
    console.log({ destination, checkIn, checkOut, guests: guestsNumber });
  };

  // Helper for floating label
  const isActive = (field: string) => {
    if (field === 'destination') return focus.destination || !!destination;
    if (field === 'checkIn') return focus.checkIn || !!checkIn;
    if (field === 'checkOut') return focus.checkOut || !!checkOut;
    if (field === 'guests') return focus.guests || !!guests;
    return false;
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

          <form onSubmit={handleSubmit} className="bg-white rounded-lg px-4 py-3 flex flex-col md:flex-row items-center gap-4 max-w-4xl mx-auto shadow">
            {/* Destination Floating Label */}
            <div className="relative flex flex-col justify-end flex-1 min-w-[120px] pb-1 border-b border-gray-200">
              <select
                id="destinationInput"
                className="peer appearance-none bg-transparent text-base font-medium text-gray-900 outline-none border-0 w-full h-12 pt-5 pr-6 cursor-pointer"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                onFocus={() => setFocus(f => ({...f, destination: true}))}
                onBlur={() => setFocus(f => ({...f, destination: false}))}
                required
                style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
              >
                <option value="" disabled hidden></option>
                {cities.map((city) => (
                  <option key={city} value={city} className="text-black">{city}</option>
                ))}
              </select>
              <span className={`pointer-events-none absolute left-3 transition-all duration-200 flex items-center gap-1
                ${isActive('destination') ? 'text-xs top-2 -translate-y-0 scale-90 rotate-[-6deg]' : 'text-base top-1/2 -translate-y-1/2'}
                text-gray-500 font-normal
              `}>
                <Image src={assets.locationIcon} alt="Location" width={16} height={16} />
                <span>Destination</span>
              </span>
            </div>

            {/* Check in Floating Label */}
            <div className="relative flex flex-col justify-end flex-1 min-w-[120px] pb-1 border-b border-gray-200">
              <Popover open={openCheckIn} onOpenChange={setOpenCheckIn}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="peer bg-transparent text-base font-medium text-gray-900 outline-none border-0 w-full h-12 pt-5 text-left pr-6"
                    onClick={() => setOpenCheckIn(true)}
                    onFocus={() => setFocus(f => ({...f, checkIn: true}))}
                    onBlur={() => setFocus(f => ({...f, checkIn: false}))}
                  >
                    {checkIn ? formatDate(checkIn) : ""}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={checkIn} onSelect={(date: Date | undefined) => { setCheckIn(date); setOpenCheckIn(false); }} initialFocus />
                </PopoverContent>
              </Popover>
              <span className={`pointer-events-none absolute left-3 transition-all duration-200 flex items-center gap-1
                ${isActive('checkIn') ? 'text-xs top-2 -translate-y-0 scale-90 rotate-[-6deg]' : 'text-base top-1/2 -translate-y-1/2'}
                text-gray-500 font-normal
              `}>
                <Image src={assets.calenderIcon} alt="Calendar" width={16} height={16} />
                <span>Check in</span>
              </span>
            </div>

            {/* Check out Floating Label */}
            <div className="relative flex flex-col justify-end flex-1 min-w-[120px] pb-1 border-b border-gray-200">
              <Popover open={openCheckOut} onOpenChange={setOpenCheckOut}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="peer bg-transparent text-base font-medium text-gray-900 outline-none border-0 w-full h-12 pt-5 text-left pr-6"
                    onClick={() => setOpenCheckOut(true)}
                    onFocus={() => setFocus(f => ({...f, checkOut: true}))}
                    onBlur={() => setFocus(f => ({...f, checkOut: false}))}
                  >
                    {checkOut ? formatDate(checkOut) : ""}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={checkOut} onSelect={(date: Date | undefined) => { setCheckOut(date); setOpenCheckOut(false); }} initialFocus />
                </PopoverContent>
              </Popover>
              <span className={`pointer-events-none absolute left-3 transition-all duration-200 flex items-center gap-1
                ${isActive('checkOut') ? 'text-xs top-2 -translate-y-0 scale-90 rotate-[-6deg]' : 'text-base top-1/2 -translate-y-1/2'}
                text-gray-500 font-normal
              `}>
                <Image src={assets.calenderIcon} alt="Calendar" width={16} height={16} />
                <span>Check out</span>
              </span>
            </div>

            {/* Guests Floating Label */}
            <div className="relative flex flex-col justify-end flex-1 min-w-[80px] pb-1 border-b border-gray-200">
              <input
                type="number"
                id="guests"
                min={1}
                max={4}
                value={guests}
                onChange={e => setGuests(e.target.value)}
                onFocus={() => setFocus(f => ({...f, guests: true}))}
                onBlur={() => setFocus(f => ({...f, guests: false}))}
                className="peer bg-transparent text-base font-medium text-gray-900 outline-none border-0 max-w-16 text-left w-full h-12 pt-5 pr-6"
                required
              />
              <span className={`pointer-events-none absolute left-3 transition-all duration-200 flex items-center gap-1
                ${isActive('guests') ? 'text-xs top-2 -translate-y-0 scale-90 rotate-[-6deg]' : 'text-base top-1/2 -translate-y-1/2'}
                text-gray-500 font-normal
              `}>
                <span>Guests</span>
              </span>
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