"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { assets } from "@/app/assets/assets";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { createClient } from "@supabase/supabase-js";

// Avatar component
function Avatar({ src, alt, name, onClick }: { src?: string; alt?: string; name?: string; onClick?: () => void }) {
  return (
    <span
      className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 overflow-hidden border cursor-pointer"
      onClick={onClick}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || "User"} className="object-cover w-full h-full" />
      ) : (
        <span className="text-gray-600 font-bold">
          {name
            ? name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            : "U"}
        </span>
      )}
    </span>
  );
}

// Supabase client (client-side)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // NavLinks tanpa "My Bookings"
  const baseNavLinks = [
    { name: "Home", path: "/" },
    { name: "Rooms", path: "/list-rooms" },
    { name: "Gallery", path: "/gallery" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch avatar from Supabase users table
  useEffect(() => {
    const fetchAvatar = async () => {
      if (session?.user?.email) {
        const { data, error } = await supabase
          .from("users")
          .select("image")
          .eq("email", session.user.email)
          .single();
        if (data?.image) setAvatarUrl(data.image);
        else setAvatarUrl(null);
      }
    };
    fetchAvatar();
  }, [session?.user?.email]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const textColorClass = isHomePage
    ? isScrolled
      ? "text-gray-700"
      : "text-white"
    : "text-gray-700";

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
          : "py-4 md:py-6"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src={assets.logo}
          alt="QuickStay Logo"
          className={`h-9 ${
            isScrolled || !isHomePage ? "invert opacity-80" : ""
          }`}
        />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {baseNavLinks.map((link, i) => (
          <Link
            key={i}
            href={link.path}
            className={`group flex flex-col gap-0.5 ${textColorClass}`}
          >
            {link.name}
            <div
              className={`${
                isScrolled || !isHomePage ? "bg-gray-700" : "bg-white"
              } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </Link>
        ))}
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4 relative">
        {status === "loading" ? (
          <div className="w-24 h-9 bg-gray-200 rounded-full animate-pulse" />
        ) : status === "authenticated" && session?.user ? (
          <>
            {/* Avatar User with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Avatar
                src={avatarUrl || undefined}
                alt={session.user.name || "User"}
                name={session.user.name || session.user.email}
                onClick={() => setDropdownOpen((v) => !v)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50 py-2 animate-fadeIn">
                  <div className="px-4 py-2 border-b text-sm text-gray-700 font-semibold">
                    {session.user.name || session.user.email}
                  </div>
                  <Link
                    href="/my-bookings"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer"
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link href="/login" className="w-full">
            <Button className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer w-full">
              Login
            </Button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        <Image
          src={isMenuOpen ? assets.closeMenu : assets.menuIcon}
          alt="Menu"
          className={`h-6 w-6 cursor-pointer ${
            isScrolled || !isHomePage ? "invert" : ""
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <Image src={assets.closeIcon} alt="Close" className="h-6 w-6" />
        </button>

        {baseNavLinks.map((link, i) => (
          <Link key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
            {link.name}
          </Link>
        ))}

        {status === "authenticated" && session?.user ? (
          <>
            {/* Avatar User di mobile */}
            <div className="flex flex-col items-center gap-2">
              <Avatar
                src={avatarUrl || undefined}
                alt={session.user.name || "User"}
                name={session.user.name || session.user.email}
              />
            </div>
            <Link
              href="/my-bookings"
              className="w-full text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button className="bg-gray-100 text-gray-800 w-full mb-2">
                My Bookings
              </Button>
            </Link>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="bg-red-600 text-white px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer w-full"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full">
            <Button className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer w-full">
              Login
            </Button>
          </Link>
        )}
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s;
        }
      `}</style>
    </nav>
  );
}