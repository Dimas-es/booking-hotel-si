import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export default function DetailsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {children}
      <Footer />
    </div>
  )
} 