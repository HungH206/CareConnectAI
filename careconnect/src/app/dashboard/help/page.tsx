import type { Metadata } from "next"
import { HelpCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard-header"

export const metadata: Metadata = {
  title: "Help & Support - CareConnect",
  description: "Get help and support for your CareConnect experience",
}

export default function HelpSupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="ml-64">
        <DashboardHeader />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Help & Support</h1>
            <p className="text-gray-500">Get assistance with your CareConnect experience</p>
          </div>

          {/* Development Notice */}
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <HelpCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-800">Help and Support Portion is in Development</h3>
                  <p className="text-amber-700">
                    We are working hard to bring you comprehensive help and support features. Check back soon for
                    updates!
                  </p>
                </div>
                <Badge className="bg-amber-100 text-amber-700 border-amber-300">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
