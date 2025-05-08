import { Home, CheckCircle } from "lucide-react"

interface HotelInfoProps {
  amenities: string[]
  features: Array<{
    title: string
    description: string
  }>
  city: string
  description: string
}

export function HotelInfo({ amenities, features, city, description }: HotelInfoProps) {
  return (
    <div className="lg:col-span-2">
      <h2 className="text-2xl font-bold mb-4">Experience Luxury Like Never Before</h2>

      <div className="flex flex-wrap gap-6 mb-8">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center gap-2">
            <Home className="h-5 w-5 text-gray-600" />
            <span className="text-sm">{amenity}</span>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-gray-700 mt-0.5" />
            <div>
              <h3 className="font-medium">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <p className="text-gray-600 mb-4">
          {description}
        </p>
      </div>
    </div>
  )
} 