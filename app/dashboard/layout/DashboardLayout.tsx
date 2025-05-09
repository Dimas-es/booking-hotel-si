"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  BellIcon,
  CreditCard,
  HotelIcon,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { assets } from "@/app/assets/assets";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen min-w-screen w-screen h-screen overflow-hidden">
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full h-full">
          <AdminSidebar />
          <div className="flex-1 flex flex-col h-full w-full">
            <header
              className="border-b bg-white dark:bg-neutral-900 w-full"
              style={{ flex: "0 0 auto" }}
            >
              <div className="flex items-center justify-between px-6 h-16 w-full">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <div className="flex items-center gap-4">
                  <ModeToggle />
                  <button className="relative">
                    <BellIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-medium text-white">
                      3
                    </span>
                  </button>
                </div>
              </div>
            </header>
            <main
              className="flex-1 overflow-auto bg-gray-50 dark:bg-neutral-950 w-full h-full"
              style={{ minHeight: 0 }}
            >
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}

function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center mb-4">
            <Image
              src={assets.logo}
              alt="QuickStay Logo"
              className="h-9 invert opacity-80"
            />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/hotels">
                    <HotelIcon className="h-4 w-4" />
                    <span>Hotels</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/bookings">
                    <CreditCard className="h-4 w-4" />
                    <span>Bookings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/users">
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/logout">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
