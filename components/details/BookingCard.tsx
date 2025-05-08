import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, Minus, Plus, Users } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface BookingCardProps {
  pricePerNight: number
}

export function BookingCard({ pricePerNight }: BookingCardProps) {
  return (
    <Card className="shadow-md sticky top-24">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">${pricePerNight}</span>
            <span className="text-gray-600">/day</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="border rounded-md p-3">
            <div className="text-xs text-gray-500 mb-1">Check-in</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-0 h-auto font-normal">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Jul 15, 2025</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar />
              </PopoverContent>
            </Popover>
          </div>
          <div className="border rounded-md p-3">
            <div className="text-xs text-gray-500 mb-1">Check-out</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-0 h-auto font-normal">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Jul 18, 2025</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="border rounded-md p-3 mb-4">
          <div className="text-xs text-gray-500 mb-1">Guests</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              <span>2 guests</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-6 w-6">
                <Minus className="h-3 w-3" />
              </Button>
              <span>2</span>
              <Button variant="outline" size="icon" className="h-6 w-6">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700">Check Availability</Button>
      </CardContent>
    </Card>
  )
} 