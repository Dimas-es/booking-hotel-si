import { Header } from "@/components/layout/Header"
import ListRooms from "@/components/list-rooms/ListRooms"
import { Footer } from "@/components/layout/Footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <ListRooms />
      <Footer />
    </div>
  )
}
