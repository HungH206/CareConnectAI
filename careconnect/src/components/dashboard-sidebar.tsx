"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Activity,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  Users,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

export default function DashboardSidebar() {
  const isMobile = useMobile()
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Activity, label: "Health Metrics", href: "/dashboard/health" },
    { icon: Calendar, label: "Appointments", href: "/dashboard/appointments" },
    { icon: FileText, label: "Reports", href: "/dashboard/reports" },
    { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
    { icon: Users, label: "Care Team", href: "/dashboard/care-team" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    { icon: HelpCircle, label: "Help & Support", href: "/dashboard/help" },
  ]

  if (isMobile) {
    return (
      <>
        <Button variant="default" size="sm" className="fixed top-3 left-3 z-50" onClick={() => setMobileOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
            <div className="absolute left-0 top-0 h-full w-72 bg-white p-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-teal-600" />
                  <span className="text-xl font-bold">CareConnect</span>
                </div>
                <Button variant="default" size="sm" onClick={() => setMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                        isActive ? "text-teal-600 bg-teal-50" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="absolute bottom-4 left-0 w-full px-4">
                <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600">
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="fixed left-0 top-0 z-30 w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
        <Heart className="h-6 w-6 text-teal-600" />
        <span className="text-xl font-bold text-gray-900">CareConnect</span>
      </div>

      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive ? "text-teal-600 bg-teal-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-teal-600" : "text-gray-500"}`} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="border-t border-gray-200 p-4">
        <button className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors w-full">
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}


