"use client"

import { useState } from "react"
import {
  Activity,
  Heart,
  MessageSquare,
  Bell,
  User,
  Settings,
  Calendar,
  BarChart3,
  Thermometer,
  Droplets,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMobile } from "@/hooks/use-mobile"

export default function DashboardPreview() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isMobile = useMobile()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState("overview")

  // Mock health data
  const healthData = {
    heartRate: 72,
    bloodPressure: "120/80",
    bloodGlucose: 95,
    temperature: 98.6,
    oxygenLevel: 98,
    steps: 8432,
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
    <div className="rounded-xl border bg-white shadow-lg overflow-hidden max-w-5xl mx-auto">
      {/* Dashboard Header */}
      <div className="bg-teal-600 p-4 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6" />
            <span className="text-xl font-bold">CareConnect Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 cursor-pointer" />
            <User className="h-5 w-5 cursor-pointer" />
            <Settings className="h-5 w-5 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-4 md:p-6">
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="chat">AI Assistant</TabsTrigger>
            <TabsTrigger value="appointments" className="hidden md:inline-flex">
              Appointments
            </TabsTrigger>
            <TabsTrigger value="reports" className="hidden lg:inline-flex">
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
                  <CardDescription>Current BPM</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Heart className="mr-2 h-4 w-4 text-rose-500" />
                    <span className="text-2xl font-bold">{healthData.heartRate}</span>
                    <span className="ml-1 text-gray-500">bpm</span>
                  </div>
                  <div className="mt-2 h-[60px] w-full">
                    {/* Placeholder for heart rate chart */}
                    <div className="h-full w-full rounded-md bg-teal-50 flex items-center justify-center">
                      <Activity className="h-8 w-8 text-teal-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
                  <CardDescription>Systolic/Diastolic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Activity className="mr-2 h-4 w-4 text-teal-500" />
                    <span className="text-2xl font-bold">{healthData.bloodPressure}</span>
                    <span className="ml-1 text-gray-500">mmHg</span>
                  </div>
                  <div className="mt-2 h-[60px] w-full">
                    {/* Placeholder for blood pressure chart */}
                    <div className="h-full w-full rounded-md bg-teal-50 flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-teal-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Blood Glucose</CardTitle>
                  <CardDescription>Current Level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Droplets className="mr-2 h-4 w-4 text-blue-500" />
                    <span className="text-2xl font-bold">{healthData.bloodGlucose}</span>
                    <span className="ml-1 text-gray-500">mg/dL</span>
                  </div>
                  <div className="mt-2 h-[60px] w-full">
                    {/* Placeholder for glucose chart */}
                    <div className="h-full w-full rounded-md bg-teal-50 flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-teal-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Notifications</CardTitle>
                  <CardDescription>Updates and alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start gap-4 rounded-lg border p-3">
                        <Bell className="h-5 w-5 text-teal-500 mt-0.5" />
                        <div>
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Scheduled consultations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-start gap-4 rounded-lg border p-3">
                        <Calendar className="h-5 w-5 text-teal-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{appointment.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2">
                      Schedule New Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vitals" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Vital Signs</CardTitle>
                <CardDescription>Detailed health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col gap-1 rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-rose-500" />
                      <span className="font-medium">Heart Rate</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {healthData.heartRate} <span className="text-sm text-gray-500">bpm</span>
                    </span>
                    <span className="text-xs text-gray-500">Normal range: 60-100 bpm</span>
                  </div>

                  <div className="flex flex-col gap-1 rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-teal-500" />
                      <span className="font-medium">Blood Pressure</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {healthData.bloodPressure} <span className="text-sm text-gray-500">mmHg</span>
                    </span>
                    <span className="text-xs text-gray-500">Normal range: 90-120/60-80 mmHg</span>
                  </div>

                  <div className="flex flex-col gap-1 rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Blood Glucose</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {healthData.bloodGlucose} <span className="text-sm text-gray-500">mg/dL</span>
                    </span>
                    <span className="text-xs text-gray-500">Normal range: 70-99 mg/dL</span>
                  </div>

                  <div className="flex flex-col gap-1 rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                      <span className="font-medium">Temperature</span>
                    </div>
                    <span className="text-2xl font-bold">
                      {healthData.temperature} <span className="text-sm text-gray-500">°F</span>
                    </span>
                    <span className="text-xs text-gray-500">Normal range: 97.8-99.1 °F</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <Card className="h-[400px] flex flex-col">
              <CardHeader>
                <CardTitle>AI Health Assistant</CardTitle>
                <CardDescription>Ask questions about your health data</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto border-t p-4">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-teal-100 text-teal-600">
                      AI
                    </div>
                    <div className="rounded-lg bg-gray-100 p-3">
                      <p className="text-sm">
                        Hello! I am your CareConnect AI assistant. How can I help you understand your health data today?
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <div className="rounded-lg bg-teal-100 p-3">
                      <p className="text-sm">Can you explain what my blood pressure readings mean?</p>
                    </div>
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-teal-600 text-white">
                      You
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-teal-100 text-teal-600">
                      AI
                    </div>
                    <div className="rounded-lg bg-gray-100 p-3">
                      <p className="text-sm">
                        Your blood pressure is 120/80 mmHg, which is considered normal. The first number (120) is your
                        systolic pressure, measuring the pressure when your heart beats. The second number (80) is your
                        diastolic pressure, measuring the pressure when your heart rests between beats.
                        <br />
                        <br />
                        Maintaining this level is great for your heart health. Would you like some tips on how to
                        maintain healthy blood pressure?
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your question here..."
                    className="flex-1 rounded-md border border-gray-300 p-2 text-sm"
                  />
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Management</CardTitle>
                <CardDescription>Schedule and manage your healthcare appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Upcoming Appointments</h3>
                    <div className="mt-3 space-y-3">
                      {appointments.map((appointment) => (
                        <div key={appointment.id} className="flex justify-between items-center rounded-lg border p-3">
                          <div>
                            <p className="font-medium">{appointment.title}</p>
                            <p className="text-sm text-gray-500">
                              {appointment.date} at {appointment.time}
                            </p>
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
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Schedule New Appointment</h3>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="appointment-type" className="text-sm font-medium">
                          Appointment Type
                        </label>
                        <select id="appointment-type" className="w-full rounded-md border border-gray-300 p-2">
                          <option>Regular Check-up</option>
                          <option>Specialist Consultation</option>
                          <option>Follow-up</option>
                          <option>Vaccination</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="doctor" className="text-sm font-medium">
                          Healthcare Provider
                        </label>
                        <select id="doctor" className="w-full rounded-md border border-gray-300 p-2">
                          <option>Dr. Smith (Primary Care)</option>
                          <option>Dr. Johnson (Cardiologist)</option>
                          <option>Dr. Williams (Endocrinologist)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="date" className="text-sm font-medium">
                          Date
                        </label>
                        <input type="date" id="date" className="w-full rounded-md border border-gray-300 p-2" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="time" className="text-sm font-medium">
                          Time
                        </label>
                        <input type="time" id="time" className="w-full rounded-md border border-gray-300 p-2" />
                      </div>
                    </div>
                    <Button className="mt-4 bg-teal-600 hover:bg-teal-700">Schedule Appointment</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Reports</CardTitle>
                <CardDescription>View and download your health reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Recent Reports</h3>
                    <div className="mt-3 space-y-3">
                      <div className="flex justify-between items-center rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <BarChart3 className="h-5 w-5 text-teal-500" />
                          <div>
                            <p className="font-medium">Monthly Health Summary</p>
                            <p className="text-sm text-gray-500">Generated on May 1, 2025</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>

                      <div className="flex justify-between items-center rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <Activity className="h-5 w-5 text-teal-500" />
                          <div>
                            <p className="font-medium">Cardiac Assessment</p>
                            <p className="text-sm text-gray-500">Generated on April 15, 2025</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>

                      <div className="flex justify-between items-center rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <Droplets className="h-5 w-5 text-teal-500" />
                          <div>
                            <p className="font-medium">Blood Work Analysis</p>
                            <p className="text-sm text-gray-500">Generated on April 10, 2025</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Generate Custom Report</h3>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="report-type" className="text-sm font-medium">
                          Report Type
                        </label>
                        <select id="report-type" className="w-full rounded-md border border-gray-300 p-2">
                          <option>Comprehensive Health Summary</option>
                          <option>Vital Signs Trends</option>
                          <option>Medication Adherence</option>
                          <option>Nutrition & Exercise</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="time-period" className="text-sm font-medium">
                          Time Period
                        </label>
                        <select id="time-period" className="w-full rounded-md border border-gray-300 p-2">
                          <option>Last 7 days</option>
                          <option>Last 30 days</option>
                          <option>Last 3 months</option>
                          <option>Last 6 months</option>
                          <option>Last year</option>
                        </select>
                      </div>
                    </div>
                    <Button className="mt-4 bg-teal-600 hover:bg-teal-700">Generate Report</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
