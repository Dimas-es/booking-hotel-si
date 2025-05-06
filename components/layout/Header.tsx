import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center bg-white rounded-md p-1">
            <Image src="/placeholder.svg?height=24&width=24" alt="QuickStay Logo" width={24} height={24} />
            <span className="font-bold text-lg ml-1">QuickStay</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-white hover:text-white/80">
            Home
          </Link>
          <Link href="/hotels" className="text-sm font-medium text-white hover:text-white/80">
            Hotels
          </Link>
          <Link href="/experiences" className="text-sm font-medium text-white hover:text-white/80">
            Experiences
          </Link>
          <Link href="/about" className="text-sm font-medium text-white hover:text-white/80">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
            Login
          </Button>
        </div>
      </div>
    </header>
  )
} 