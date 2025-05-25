import type { Metadata } from "next"
import { Activity, Heart, Bell, Calendar, Thermometer, Droplets } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard-header"

export const metadata: Metadata = {
  title: "CareConnect Dashboard",
  description: "Monitor your health data and connect with healthcare providers",
}

export default function DashboardPage() {
  // Mock health data
  const healthData = {
    heartRate: 0,
    bloodPressure: "0/0",
    bloodGlucose: 0,
    temperatureF: 0,
    temperatureC: 0,
    oxygenLevel: 0,
    steps: 0,
  }

  // Mock notifications
  const notifications = [
    {
      id: 1,
      message: "Your heart rate was elevated during your workout. Great job!",
      time: "2 hours ago",
      type: "info",
    },
    { id: 2, message: "Time to take your medication. Don't forget!", time: "30 minutes ago", type: "reminder" },
    { id: 3, message: "Your doctor has reviewed your latest readings.", time: "1 day ago", type: "update" },
  ]

  // Mock upcoming appointments
  const appointments = [
    { id: 1, title: "Dr. Smith - Follow-up", date: "May 22, 2025", time: "10:00 AM" },
    { id: 2, title: "Nutritionist Consultation", date: "May 25, 2025", time: "2:30 PM" },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />

        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Welcome back, User</h1>
            <p className="text-gray-500">Here is an overview of your health today</p>
          </div>

          <div className="space-y-6">
            {/* Health metrics cards - 2x2 grid matching the design */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600">Heart Rate</h3>
                  <p className="text-xs text-gray-500">Current BPM</p>
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-500" />
                    <span className="text-3xl font-bold">{healthData.heartRate}</span>
                    <span className="text-gray-500">bpm</span>
                  </div>
                  <div className="h-16 w-full bg-teal-50 rounded-lg flex items-center justify-center mt-4">
                    <Activity className="h-8 w-8 text-teal-500" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600">Blood Pressure</h3>
                  <p className="text-xs text-gray-500">Systolic/Diastolic</p>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-teal-500" />
                    <span className="text-3xl font-bold">{healthData.bloodPressure}</span>
                    <span className="text-gray-500">mmHg</span>
                  </div>
                  <div className="h-16 w-full bg-teal-50 rounded-lg flex items-center justify-center mt-4">
                    <Activity className="h-8 w-8 text-teal-500" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600">Blood Glucose</h3>
                  <p className="text-xs text-gray-500">Current Level</p>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <span className="text-3xl font-bold">{healthData.bloodGlucose}</span>
                    <span className="text-gray-500">mg/dL</span>
                  </div>
                  <div className="h-16 w-full bg-teal-50 rounded-lg flex items-center justify-center mt-4">
                    <Activity className="h-8 w-8 text-teal-500" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600">Body Temperature</h3>
                  <p className="text-xs text-gray-500">Current Reading</p>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-orange-500" />
                    <span className="text-3xl font-bold">{healthData.temperatureF}</span>
                    <span className="text-gray-500">°F</span>
                    <span className="text-lg text-gray-400">({healthData.temperatureC}°C)</span>
                  </div>
                  <div className="h-16 w-full bg-teal-50 rounded-lg flex items-center justify-center mt-4">
                    <Thermometer className="h-8 w-8 text-orange-500" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Notifications */}
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Recent Notifications</h3>
                  <p className="text-sm text-gray-500">Updates and alerts</p>
                </div>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-3">
                      <Bell className="h-5 w-5 text-teal-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4">
                    View All Notifications
                  </Button>
                </div>
              </div>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
                  <p className="text-sm text-gray-500">Scheduled consultations</p>
                </div>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-teal-500" />
                        <div>
                          <p className="font-medium">{appointment.title}</p>
                          <p className="text-sm text-gray-500">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4">
                    Schedule New Appointment
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
