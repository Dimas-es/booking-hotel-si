import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, CheckCircle, Home, MapPin, Minus, Plus, Search, Shield, Star, Users } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

export default function HotelDetail() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <Image src="/placeholder.svg?height=24&width=24" alt="QuickStay Logo" width={24} height={24} />
              <span className="font-bold text-lg ml-1">QuickStay</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/destination" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Destination
            </Link>
            <Link href="/experiences" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Experiences
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Button>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white">Login</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Hotel Title Section */}
          <div className="mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">The Grand Resort</h1>
                  <span className="text-sm text-gray-500">(Single Bed)</span>
                  <Badge className="bg-orange-500 hover:bg-orange-600">25% OFF</Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 4 ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">200+ reviews</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">Los Angeles, California, USA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="grid grid-cols-3 gap-2 mb-8">
            <div className="col-span-3 md:col-span-1 row-span-2">
              <div className="relative h-full min-h-[200px]">
                <Image
                  src="/placeholder.svg?height=400&width=300"
                  alt="Hotel room"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="col-span-3 md:col-span-1">
              <div className="relative h-full min-h-[150px]">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Hotel room"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="col-span-3 md:col-span-1">
              <div className="relative h-full min-h-[150px]">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Hotel room"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="col-span-3 md:col-span-1">
              <div className="relative h-full min-h-[150px]">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Hotel room"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
            <div className="col-span-3 md:col-span-1">
              <div className="relative h-full min-h-[150px]">
                <Image
                  src="/placeholder.svg?height=200&width=300"
                  alt="Hotel room"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Hotel Info and Booking */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Experience Luxury Like Never Before</h2>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-gray-600" />
                  <span className="text-sm">Free WiFi</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-gray-600"
                  >
                    <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>
                  </svg>
                  <span className="text-sm">Free breakfast</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-gray-600"
                  >
                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                  </svg>
                  <span className="text-sm">Ocean view</span>
                </div>
              </div>

              {/* Booking Card for Mobile */}
              <div className="lg:hidden mb-8">
                <Card className="shadow-md">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">$299</span>
                        <span className="text-gray-600">/day</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="border rounded-md p-3">
                        <div className="text-xs text-gray-500 mb-1">Check-in</div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Jul 15, 2025</span>
                        </div>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="text-xs text-gray-500 mb-1">Check-out</div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Jul 18, 2025</span>
                        </div>
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
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gray-700 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Clean Room</h3>
                    <p className="text-sm text-gray-600">We will leave the room clean for you.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-gray-700 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Enhanced Clean</h3>
                    <p className="text-sm text-gray-600">This host has committed to QuickStay's cleaning process.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-700 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Great location</h3>
                    <p className="text-sm text-gray-600">90% of recent guests gave the location a 5-star rating.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-gray-700 mt-0.5"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                  <div>
                    <h3 className="font-medium">Great check-in experience</h3>
                    <p className="text-sm text-gray-600">
                      100% of recent guests gave the check-in process a 5-star rating.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-gray-600 mb-4">
                  Guests are raving about this stunning property located in the heart of Los Angeles. This luxurious
                  hotel offers breathtaking views of the city skyline. The price quoted is the best guest at the given
                  spot please mark that the number of guests to get the exact price for groups. The rooms will be
                  allocated ground floor according to availability. You get the home-feeling vibe because that feels
                  like staying at home.
                </p>
              </div>

              {/* Location Map */}
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Location on map</h2>
                <div className="relative h-[300px] w-full mb-4 rounded-lg overflow-hidden border">
                  <Image
                    src="/placeholder.svg?height=300&width=600&text=Map"
                    alt="Location map"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                      Exact location provided after booking
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-white">
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-white">
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <h3 className="font-bold mb-1">Los Angeles, California, USA</h3>
                <p className="text-gray-600 text-sm">It's like a home away from home.</p>
              </div>

              {/* Host Information */}
              <div className="border-t pt-8">
                <div className="flex items-start gap-4">
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Emma Rodriguez"
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">Hosted by Emma Rodriguez</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">200+ reviews</span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                      <div className="text-sm text-gray-600">Response rate: 100%</div>
                      <div className="text-sm text-gray-600">Response time: 30 min</div>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">Contact Now</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Card for Desktop */}
            <div className="hidden lg:block">
              <Card className="shadow-md sticky top-24">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">$299</span>
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
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/placeholder.svg?height=24&width=24" alt="QuickStay Logo" width={24} height={24} />
                <span className="font-bold text-lg">QuickStay</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Discover the world's most extraordinary places to stay, from boutique hotels to luxury villas and more.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Partners
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Safety Information
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Cancellation Options
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase">Newsletter</h3>
              <p className="text-sm text-gray-600 mb-4">
                Subscribe to our newsletter for travel inspiration and special offers.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button size="sm" className="h-9 bg-gray-900 hover:bg-gray-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">© 2025 QuickStay. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-xs text-gray-600 hover:text-gray-900">
                Privacy
              </Link>
              <Link href="#" className="text-xs text-gray-600 hover:text-gray-900">
                Terms
              </Link>
              <Link href="#" className="text-xs text-gray-600 hover:text-gray-900">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
