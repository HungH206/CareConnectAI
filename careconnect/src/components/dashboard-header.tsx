"use client"

import { Bell, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-xl font-bold">Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="default" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-[10px] font-medium text-white">
              3
            </span>
          </Button>
          <Button variant="default" size="sm">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-600">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </header>
  )
}
