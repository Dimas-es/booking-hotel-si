import type { Metadata } from "next"
import { DashboardLayout } from "./layout/DashboardLayout"

export const metadata: Metadata = {
  title: "QuickStay Admin Dashboard",
  description: "Admin dashboard for QuickStay hotel booking platform",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}

