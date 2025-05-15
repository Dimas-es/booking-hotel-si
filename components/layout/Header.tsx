"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { assets } from "@/app/assets/assets";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { User } from "lucide-react";

export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Rooms", path: "/list-rooms" },
    { name: "Offers", path: "/offers" },
    { name: "About", path: "/about" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        {navLinks.map((link, i) => (
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
      <div className="hidden md:flex items-center gap-4">
        {status === "loading" ? (
          <div className="w-24 h-9 bg-gray-200 rounded-full animate-pulse" />
        ) : status === "authenticated" && session?.user ? (
          <Button
            className="bg-red-600 text-white px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Logout
          </Button>
        ) : (
          <Link href="/login">
            <Button className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer">
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

        {navLinks.map((link, i) => (
          <Link key={i} href={link.path} onClick={() => setIsMenuOpen(false)}>
            {link.name}
          </Link>
        ))}

        {status === "authenticated" && session?.user ? (
          <button
            onClick={() => { setIsMenuOpen(false); signOut({ callbackUrl: "/" }); }}
            className="bg-red-600 text-white px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <Link href="/login" onClick={() => setIsMenuOpen(false)}>
            <Button className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500 cursor-pointer">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
