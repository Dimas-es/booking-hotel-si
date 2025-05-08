"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change: string
  icon: LucideIcon
  iconColor: string
  iconBgColor: string
}

export function StatCard({ title, value, change, icon: Icon, iconColor, iconBgColor }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <div className="flex items-center gap-1 mt-1">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{change}</Badge>
              <span className="text-xs text-gray-500">from last month</span>
            </div>
          </div>
          <div className={`h-10 w-10 rounded-md ${iconBgColor} flex items-center justify-center`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 