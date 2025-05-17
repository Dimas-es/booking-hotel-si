"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Hero } from "@/components/sections/Hero"
import { FeaturedRooms } from "@/components/sections/FeaturedRooms"
import { Gallery } from "@/components/sections/Gallery"
import { CTA } from "@/components/sections/CTA"

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Jika sudah login
    if (status === "authenticated") {
      // Jika role sudah admin, lakukan hard reload ke dashboard
      if ((session?.user as any)?.role === "admin") {
        if (typeof window !== "undefined") {
          window.location.href = "/dashboard";
        }
      } else {
        // Jika user Google, tapi role belum admin, reload untuk refresh session
        // (mengatasi cache session lama setelah login)
        if (typeof window !== "undefined" && session?.user?.email && session?.user?.email.endsWith("@gmail.com")) {
          // Cek localStorage agar reload hanya sekali
          if (!localStorage.getItem("_force_session_reload")) {
            localStorage.setItem("_force_session_reload", "1");
            window.location.reload();
          } else {
            localStorage.removeItem("_force_session_reload");
          }
        }
      }
    }
  }, [session, status, router]);

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
