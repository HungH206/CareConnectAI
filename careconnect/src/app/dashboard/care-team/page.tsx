import type { Metadata } from "next"
import {
  Wifi,
  Video,
  Users,
  Signal,
  Zap,
  Share2,
  MessageSquare,
  Phone,
  Calendar,
  FileText,
  Send,
  Paperclip,
  MoreVertical,
  Mic,
  PhoneCall,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateExternalAvatar } from "@/lib/avatar-util"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard-header"

export const metadata: Metadata = {
  title: "Care Team - CareConnect",
  description: "Connect with your healthcare providers through 5G technology",
}

export default function CareTeamPage() {
  // Mock care team members
  const careTeam = [
    {
      id: 1,
      name: "Dr. Sarah Smith",
      role: "Primary Care Physician",
      specialty: "Family Medicine",
      availability: "Available Now",
      image: generateExternalAvatar("Dr. Sarah Smith"),
      lastContact: "2 hours ago",
      nextAppointment: "June 15, 2025",
      connectionQuality: "Excellent",
      isOnline: true,
      unreadMessages: 2,
    },
    {
      id: 2,
      name: "Dr. Phil Deckerson",
      role: "Emergency Physician, Cardiologist",
      specialty: "Emergency Assistance, Cardiology",
      availability: "Available in 15 min",
      image: generateExternalAvatar("Phil Deckerson"),
      lastContact: "1 day ago",
      nextAppointment: "June 22, 2025",
      connectionQuality: "Good",
      isOnline: true,
      unreadMessages: 0,
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "Nurse Practitioner",
      specialty: "General Care",
      availability: "Available Now",
      image: generateExternalAvatar("Phil Deckerson"),
      lastContact: "30 minutes ago",
      nextAppointment: "June 18, 2025",
      connectionQuality: "Excellent",
      isOnline: true,
      unreadMessages: 1,
    }
  ]

  // Mock chat messages
  const chatMessages = [
    {
      id: 1,
      sender: "Dr. Sarah Smith",
      message: "Hi Tom! I've reviewed your latest blood pressure readings. They look much better now.",
      timestamp: "2:30 PM",
      isProvider: true,
    },
    {
      id: 2,
      sender: "You",
      message: "Thank you! I've been following the diet plan you recommended.",
      timestamp: "2:32 PM",
      isProvider: false,
    },
    {
      id: 3,
      sender: "Dr. Sarah Smith",
      message:
        "That's excellent! Keep up the good work. Would you like to schedule a video call to discuss your progress?",
      timestamp: "2:35 PM",
      isProvider: true,
    },
    {
      id: 4,
      sender: "You",
      message: "Yes, that would be great. When are you available?",
      timestamp: "2:36 PM",
      isProvider: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="ml-64">
        <DashboardHeader />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">Care Team</h1>
                  <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 flex items-center gap-1">
                    <Signal className="h-3.5 w-3.5" />
                    5G Connected
                  </Badge>
                </div>
                <p className="text-gray-500">Connect with your healthcare providers through high-speed 5G technology</p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Video className="h-4 w-4 mr-2" />
                  Start Video Call
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </div>
          </div>

          {/* 5G Status Bar */}
          <Card className="mb-6 bg-gradient-to-r from-teal-50 to-blue-50 border-teal-100">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100">
                    <Wifi className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">5G Ultra-Fast Connection</h3>
                    <p className="text-sm text-gray-600">HD video calls and instant messaging enabled</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-medium text-gray-500">Latency</div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-green-600">8ms</span>
                      <Zap className="h-3 w-3 text-amber-500" />
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-medium text-gray-500">Speed</div>
                    <div className="text-sm font-bold text-green-600">1.4 Gbps</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-medium text-gray-500">Quality</div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Signal key={i} className={`h-3 w-3 ${i < 4 ? "text-teal-600" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <Activity className="h-3 w-3 mr-1" />
                    Optimal
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Care Team List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Your Care Team
                  </CardTitle>
                  <CardDescription>Healthcare professionals monitoring your health</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {careTeam.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.image || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                              member.isOnline ? "bg-green-500" : "bg-gray-400"
                            }`}
                          ></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">{member.name}</h3>
                            {member.unreadMessages > 0 && (
                              <Badge className="bg-teal-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                {member.unreadMessages}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{member.specialty}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                member.availability.includes("Available")
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {member.availability}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                member.connectionQuality === "Excellent"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              5G {member.connectionQuality}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button variant="default" size="md" className="h-8 w-8 p-0">
                            <Video className="h-4 w-4" />
                          </Button>
                          <Button variant="default" size="md" className="h-8 w-8 p-0">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat and Video Interface */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Dr. Sarah Smith" />
                        <AvatarFallback>SS</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">Dr. Sarah Smith</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span className="text-sm text-gray-600">Online • 5G Connected</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Audio Call
                      </Button>
                      <Button className="bg-teal-600 hover:bg-teal-700" size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        Video Call
                      </Button>
                      <Button variant="default" size="md" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                  <TabsList className="mx-6 w-fit">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="video">Video Call</TabsTrigger>
                    <TabsTrigger value="files">Shared Files</TabsTrigger>
                  </TabsList>

                  <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isProvider ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.isProvider ? "bg-gray-100 text-gray-900" : "bg-teal-600 text-white"
                            }`}
                          >
                            <p className="text-sm">{message.message}</p>
                            <p className={`text-xs mt-1 ${message.isProvider ? "text-gray-500" : "text-teal-100"}`}>
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="border-t p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="default" size="md" className="h-8 w-8 p-0">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <input
                          type="text"
                          placeholder="Type your message..."
                          className="flex-1 rounded-lg border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <Button className="bg-teal-600 hover:bg-teal-700" size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="video" className="flex-1 flex flex-col mt-0">
                    {/* Video Call Interface */}
                    <div className="flex-1 bg-gray-900 rounded-lg m-6 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <h3 className="text-xl font-semibold mb-2">Ready for Video Call</h3>
                          <p className="text-gray-300 mb-6">5G connection ensures HD quality with minimal latency</p>
                          <div className="flex justify-center gap-4">
                            <Button className="bg-green-600 hover:bg-green-700">
                              <Video className="h-4 w-4 mr-2" />
                              Start Call
                            </Button>
                            <Button
                              variant="outline"
                              className="text-white border-white hover:bg-white hover:text-gray-900"
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Video Controls */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-black/50 border-white/20 text-white hover:bg-white/20"
                        >
                          <Mic className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-black/50 border-white/20 text-white hover:bg-white/20"
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-600 border-red-600 text-white hover:bg-red-700"
                        >
                          <PhoneCall className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="files" className="flex-1 mt-0">
                    <div className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                          <FileText className="h-8 w-8 text-blue-500" />
                          <div className="flex-1">
                            <p className="font-medium">Blood Pressure Report.pdf</p>
                            <p className="text-sm text-gray-500">Shared by Dr. Sarah Smith • 2 days ago</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                          <FileText className="h-8 w-8 text-green-500" />
                          <div className="flex-1">
                            <p className="font-medium">Medication Schedule.pdf</p>
                            <p className="text-sm text-gray-500">Shared by Emma Davis • 1 week ago</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                          <FileText className="h-8 w-8 text-purple-500" />
                          <div className="flex-1">
                            <p className="font-medium">Lab Results.pdf</p>
                            <p className="text-sm text-gray-500">Shared by Dr. Michael Johnson • 2 weeks ago</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks with your care team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="default" className="h-20 flex flex-col gap-2">
                  <Video className="h-6 w-6 text-teal-600" />
                  <span>Emergency Video Call</span>
                </Button>
                <Button variant="default" className="h-20 flex flex-col gap-2">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                  <span>Send Health Update</span>
                </Button>
                <Button variant="default" className="h-20 flex flex-col gap-2">
                  <Calendar className="h-6 w-6 text-green-600" />
                  <span>Schedule Appointment</span>
                </Button>
                <Button variant="default" className="h-20 flex flex-col gap-2">
                  <Share2 className="h-6 w-6 text-purple-600" />
                  <span>Share Test Results</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
