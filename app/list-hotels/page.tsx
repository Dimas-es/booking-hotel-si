import { Header } from "@/components/layout/Header"
import ListHotels from "@/components/list-hotels/ListHotels"
import { Footer } from "@/components/layout/Footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <ListHotels />
      <Footer />
    </div>
  )
}
