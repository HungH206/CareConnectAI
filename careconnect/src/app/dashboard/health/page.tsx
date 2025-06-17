"use client"

//import type { Metadata } from "next"
import { Activity, Heart, Thermometer, Droplets, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard-header"
import { useEffect, useState } from "react"

//export const metadata: Metadata = {
  //title: "Health Metrics - CareConnect",
  //description: "Detailed view of your health metrics and vital signs",
//}

export default function HealthMetricsPage() {
  const [healthData, setHealthData] = useState({
    heartRate: 0,
    bloodPressure: "0/0",
    bloodGlucose: 0,
    temperatureF: 0,
    temperatureC: 0,
    oxygenLevel: 0,
    steps: 0,
  })

  const fetchVitals = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/vitals") // or your deployed backend
      const data = await res.json()
      setHealthData({
        heartRate: data.heart_rate,
        bloodPressure: data.blood_pressure,
        bloodGlucose: Math.floor(Math.random() * (110 - 70 + 1)) + 70, // simulate
        temperatureF: data.temperature,
        temperatureC: ((data.temperature - 32) * 5) / 9,
        oxygenLevel: data.spo2,
        steps: Math.floor(Math.random() * 10000), // simulate
      })
    } catch (err) {
      console.error("Failed to fetch vitals:", err)
    }
  }

  useEffect(() => {
    fetchVitals()
    const interval = setInterval(fetchVitals, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="ml-64">
        <DashboardHeader />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Health Metrics</h1>
            <p className="text-gray-500">Detailed view of your vital signs and health data</p>
          </div>

          <div className="space-y-6">
            {/* Vital Signs Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Vital Signs</CardTitle>
                <CardDescription>Current health metrics and readings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col gap-3 rounded-lg border p-4 bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                      <Heart className="h-6 w-6 text-rose-500" />
                      <span className="font-semibold">Heart Rate</span>
                    </div>
                    <span className="text-3xl font-bold">
                      {healthData.heartRate} <span className="text-lg text-gray-500">bpm</span>
                    </span>
                    <span className="text-sm text-gray-500">Normal range: 60-100 bpm</span>
                    <div className="h-20 w-full bg-rose-50 rounded-lg flex items-center justify-center mt-2">
                      <Activity className="h-10 w-10 text-rose-500" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 rounded-lg border p-4 bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                      <Activity className="h-6 w-6 text-teal-500" />
                      <span className="font-semibold">Blood Pressure</span>
                    </div>
                    <span className="text-3xl font-bold">
                      {healthData.bloodPressure} <span className="text-lg text-gray-500">mmHg</span>
                    </span>
                    <span className="text-sm text-gray-500">Normal range: 90-120/60-80 mmHg</span>
                    <div className="h-20 w-full bg-teal-50 rounded-lg flex items-center justify-center mt-2">
                      <BarChart3 className="h-10 w-10 text-teal-500" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 rounded-lg border p-4 bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-6 w-6 text-blue-500" />
                      <span className="font-semibold">Blood Glucose</span>
                    </div>
                    <span className="text-3xl font-bold">
                      {healthData.bloodGlucose} <span className="text-lg text-gray-500">mg/dL</span>
                    </span>
                    <span className="text-sm text-gray-500">Normal range: 70-99 mg/dL</span>
                    <div className="h-20 w-full bg-blue-50 rounded-lg flex items-center justify-center mt-2">
                      <BarChart3 className="h-10 w-10 text-blue-500" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 rounded-lg border p-4 bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-6 w-6 text-orange-500" />
                      <span className="font-semibold">Body Temperature</span>
                    </div>
                    <span className="text-3xl font-bold">
                      {healthData.temperatureF} <span className="text-lg text-gray-500">°F</span>
                    </span>
                    <span className="text-sm text-gray-500">({healthData.temperatureC}°C) • Normal: 97.8-99.1°F</span>
                    <div className="h-20 w-full bg-orange-50 rounded-lg flex items-center justify-center mt-2">
                      <Thermometer className="h-10 w-10 text-orange-500" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 rounded-lg border p-4 bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                      <Activity className="h-6 w-6 text-purple-500" />
                      <span className="font-semibold">Oxygen Level</span>
                    </div>
                    <span className="text-3xl font-bold">
                      {healthData.oxygenLevel} <span className="text-lg text-gray-500">%</span>
                    </span>
                    <span className="text-sm text-gray-500">Normal range: 95-100%</span>
                    <div className="h-20 w-full bg-purple-50 rounded-lg flex items-center justify-center mt-2">
                      <BarChart3 className="h-10 w-10 text-purple-500" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 rounded-lg border p-4 bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                      <Activity className="h-6 w-6 text-green-500" />
                      <span className="font-semibold">Daily Steps</span>
                    </div>
                    <span className="text-3xl font-bold">
                      {healthData.steps} <span className="text-lg text-gray-500">steps</span>
                    </span>
                    <span className="text-sm text-gray-500">Daily goal: 10,000 steps</span>
                    <div className="h-20 w-full bg-green-50 rounded-lg flex items-center justify-center mt-2">
                      <BarChart3 className="h-10 w-10 text-green-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Health Trends</CardTitle>
                <CardDescription>Track your health metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Weekly Heart Rate Trend</h4>
                    <div className="h-32 bg-rose-50 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-gray-500">Chart placeholder - Connect to data source</p>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Blood Pressure History</h4>
                    <div className="h-32 bg-teal-50 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-gray-500">Chart placeholder - Connect to data source</p>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Glucose Levels</h4>
                    <div className="h-32 bg-blue-50 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-gray-500">Chart placeholder - Connect to data source</p>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Activity Summary</h4>
                    <div className="h-32 bg-green-50 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-gray-500">Chart placeholder - Connect to data source</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
