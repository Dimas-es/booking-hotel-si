"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="px-3 py-1 rounded border bg-gray-100 dark:bg-gray-800 text-sm"
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌞 Light" : "🌙 Dark"}
    </button>
  )
} 