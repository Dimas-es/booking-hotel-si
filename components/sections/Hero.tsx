import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPin, Search, Users } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

export function Hero() {
  return (
    <section className="relative h-[600px] flex items-center justify-center">
      <Image
        src="/placeholder.svg?height=600&width=1200"
        alt="Luxury hotel with pool at sunset"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="container relative z-10 mx-auto px-4 text-white">
        <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">The Ultimate Hotel Experience</Badge>
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Discover Your Perfect <br /> Getaway Destination
        </h1>
        <p className="mb-8 max-w-xl text-lg text-white/90">
          Experience luxury and comfort at some of the world's finest hotels and resorts. Find your perfect stay.
        </p>

        <div className="bg-white rounded-lg p-2 flex flex-col md:flex-row gap-2 max-w-4xl">
          <div className="flex-1 flex items-center gap-2 p-2 border rounded-md">
            <MapPin className="h-5 w-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Destination"
              className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              defaultValue="Dubai"
            />
          </div>
          <div className="flex-1 flex items-center gap-2 p-2 border rounded-md">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-left font-normal p-0 h-auto">
                  <span>Mar 15, 2025</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-1 flex items-center gap-2 p-2 border rounded-md">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-left font-normal p-0 h-auto">
                  <span>Mar 18, 2025</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-1 flex items-center gap-2 p-2 border rounded-md">
            <Users className="h-5 w-5 text-gray-500" />
            <Input
              type="number"
              placeholder="Guests"
              className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              defaultValue="2"
            />
          </div>
          <Button className="md:w-auto w-full">
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>
        </div>
      </div>
    </section>
  )
} 