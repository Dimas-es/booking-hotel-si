import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Hero } from "@/components/sections/Hero"
import { FeaturedRooms } from "@/components/sections/FeaturedRooms"
import { Gallery } from "@/components/sections/Gallery"
import { CTA } from "@/components/sections/CTA"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <FeaturedRooms />
      <Gallery />
      <CTA />
      <Footer />
    </div>
  )
}
