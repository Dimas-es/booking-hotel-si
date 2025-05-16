import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import heroImage from "@/app/assets/heroImage.png"

export function Hero() {
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
            Discover Your Perfect <br /> Gateway Destination
          </h1>
          <p className="mb-8 max-w-xl text-lg text-white/90">
            Experience luxury and comfort at some of the world&#39;s finest hotels and resorts. Find your perfect stay.
          </p>
        </div>
      </div>
    </section>
  )
} 