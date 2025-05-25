"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Home,
  Heart,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  Users,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardSidebar() {
  const isMobile = useMobile()
  const [mobileOpen, setMobileOpen] = useState(false)

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Heart, label: "Health Metrics", href: "/dashboard/health" },
     { icon: MessageSquare, label: "AI Health Messages", href: "/dashboard/messages" },
    { icon: Calendar, label: "Appointments", href: "/dashboard/appointments" },
    { icon: FileText, label: "Reports", href: "/dashboard/reports" },
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
                <Button variant="default" size="sm" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-700"
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
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
    <SidebarProvider>
      <Sidebar className="border-r w-64 shrink-0">
        <SidebarHeader className="border-b">
          <div className="flex h-16 items-center px-4">
            <Heart className="h-6 w-6 text-teal-600 mr-2" />
            <span className="text-xl font-bold">CareConnect</span>
            <SidebarTrigger className="ml-auto" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild tooltip={item.label} className="py-3">
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="ml-2">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Sign Out" className="py-3">
                <button className="w-full text-red-500 hover:text-red-600">
                  <LogOut className="h-5 w-5" />
                  <span className="ml-2">Sign Out</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
