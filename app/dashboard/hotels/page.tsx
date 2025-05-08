import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Plus, Search, Star } from "lucide-react"

export default function HotelsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Hotels</h1>
          <p className="text-gray-500">Manage all hotel properties</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export CSV</Button>
          <Button className="gap-1">
            <Plus className="h-4 w-4" /> Add New Hotel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input placeholder="Search hotels..." className="pl-9" />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-full md:w-1/2">
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-1/2">
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="los-angeles">Los Angeles</SelectItem>
                <SelectItem value="new-york">New York</SelectItem>
                <SelectItem value="miami">Miami</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-3 lg:justify-end">
          <div className="w-full md:w-1/2 lg:w-auto">
            <Select defaultValue="newest">
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative h-48">
              <Image src={hotel.image || "/placeholder.svg"} alt={hotel.name} fill className="object-cover" />
              <Badge className="absolute top-2 left-2 bg-white text-black">{hotel.tag}</Badge>
              <Badge
                className={`absolute top-2 right-2 ${
                  hotel.status === "Active"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : hotel.status === "Inactive"
                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                }`}
              >
                {hotel.status}
              </Badge>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{hotel.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{hotel.location}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
                  <span className="font-medium">{hotel.rating}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <div>
                  <span className="font-bold">${hotel.price}</span>
                  <span className="text-sm text-gray-500"> /night</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Button variant="outline" className="gap-1">
          Load More
        </Button>
      </div>
    </div>
  )
}

const hotels = [
  {
    name: "The Grand Resort",
    location: "Los Angeles, California, USA",
    rating: 4.8,
    price: 450,
    image: "/placeholder.svg?height=200&width=300",
    tag: "Best Seller",
    status: "Active",
  },
  {
    name: "The Regal Palace",
    location: "Las Vegas, Nevada, USA",
    rating: 4.9,
    price: 380,
    image: "/placeholder.svg?height=200&width=300",
    tag: "",
    status: "Active",
  },
  {
    name: "Crystal Waters Resort",
    location: "Miami Beach, Florida, USA",
    rating: 4.6,
    price: 320,
    image: "/placeholder.svg?height=200&width=300",
    tag: "Featured",
    status: "Active",
  },
  {
    name: "Skyline Lase Hotel",
    location: "New York City, New York, USA",
    rating: 4.9,
    price: 520,
    image: "/placeholder.svg?height=200&width=300",
    tag: "New",
    status: "Pending",
  },
  {
    name: "Velvet Nights Inn",
    location: "Chicago, Illinois, USA",
    rating: 4.7,
    price: 280,
    image: "/placeholder.svg?height=200&width=300",
    tag: "",
    status: "Active",
  },
  {
    name: "The Seaside Lodge",
    location: "San Francisco, California, USA",
    rating: 4.5,
    price: 310,
    image: "/placeholder.svg?height=200&width=300",
    tag: "",
    status: "Inactive",
  },
]
