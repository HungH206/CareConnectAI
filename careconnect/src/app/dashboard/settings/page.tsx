"use client"
import { User, Mail, Phone, MapPin, Calendar, Shield, Bell, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard-header"
import AvatarUploader from "@/components/avatar-uploader"
import { getAssignedAvatar } from "@/lib/avatar-util"

export default function SettingsPage() {
  // User profile data
  const userProfile = {
    name: "Tom J.",
    fullName: "Tom Johnson",
    email: "tom.johnson@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "March 15, 1985",
    address: "123 Main Street, Springfield, IL 62701",
    emergencyContact: "Sarah Johnson - (555) 987-6543",
    bloodType: "O+",
    allergies: ["Penicillin", "Shellfish"],
    medications: ["Lisinopril 10mg", "Metformin 500mg"],
    insuranceProvider: "Blue Cross Blue Shield",
    policyNumber: "BC123456789",
    memberSince: "January 2024",
    profileImage: getAssignedAvatar("Tom Johnson", "patient"),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="ml-64">
        <DashboardHeader />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-gray-500">Manage your profile and account preferences</p>
          </div>

          <div className="space-y-6">
            {/* Profile Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>Your personal information and contact details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <AvatarUploader
                      currentImage={userProfile.profileImage}
                      name={userProfile.fullName}
                      size="lg"
                      editable={true}
                      onImageChange={(file) => {
                        console.log("New avatar file:", file)
                        // Handle avatar upload here
                      }}
                    />
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Display Name</label>
                        <p className="text-lg font-semibold">{userProfile.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                        <p className="text-lg">{userProfile.fullName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email Address</label>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <p>{userProfile.email}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone Number</label>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <p>{userProfile.phone}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <p>{userProfile.dateOfBirth}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Member Since</label>
                        <p>{userProfile.memberSince}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <p>{userProfile.address}</p>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Medical Information
                </CardTitle>
                <CardDescription>Important health and medical details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Blood Type</label>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {userProfile.bloodType}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Known Allergies</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {userProfile.allergies.map((allergy) => (
                          <Badge
                            key={allergy}
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-200"
                          >
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Current Medications</label>
                      <div className="space-y-1 mt-1">
                        {userProfile.medications.map((medication) => (
                          <div key={medication} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                            <span className="text-sm">{medication}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
                      <p className="text-sm">{userProfile.emergencyContact}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Medical Center Registered</label>
                      <p className="font-medium">Houston Methodist Hospital</p>
                      <p className="text-sm text-gray-600">6565 Fannin St, Houston, TX 77030</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Insurance Provider</label>
                      <p className="font-medium">{userProfile.insuranceProvider}</p>
                      <p className="text-sm text-gray-600">Policy: {userProfile.policyNumber}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t mt-6">
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Medical Info
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Status
                </CardTitle>
                <CardDescription>Your account verification and security status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Email Verified</p>
                      <p className="text-sm text-gray-500">Confirmed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Phone Verified</p>
                      <p className="text-sm text-gray-500">Confirmed</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border rounded-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                      <User className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium">Profile Complete</p>
                      <p className="text-sm text-gray-500">100%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Manage how you receive updates and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Health Alerts</p>
                      <p className="text-sm text-gray-500">Receive notifications about important health changes</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Appointment Reminders</p>
                      <p className="text-sm text-gray-500">Get reminded about upcoming appointments</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Medication Reminders</p>
                      <p className="text-sm text-gray-500">Daily reminders to take your medications</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Marketing Communications</p>
                      <p className="text-sm text-gray-500">Updates about new features and health tips</p>
                    </div>
                    <Badge variant="outline" className="bg-gray-100 text-gray-700">
                      Disabled
                    </Badge>
                  </div>
                </div>
                <div className="pt-4 border-t mt-6">
                  <Button variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Manage Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
