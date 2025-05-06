import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Hero } from "@/components/sections/Hero"
import { FeaturedHotels } from "@/components/sections/FeaturedHotels"
import { ExclusiveOffers } from "@/components/sections/ExclusiveOffers"
import { Testimonials } from "@/components/sections/Testimonials"
import { Newsletter } from "@/components/sections/Newsletter"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <FeaturedHotels />
      <ExclusiveOffers />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  )
}
