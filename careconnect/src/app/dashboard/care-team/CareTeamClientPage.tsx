/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef } from "react"
import {
  Wifi,
  Video,
  Users,
  Signal,
  Zap,
  Share2,
  MessageSquare,
  Calendar,
  Send,
  Paperclip,
  MoreVertical,
  Activity,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard-header"
import { getAssignedAvatar } from "@/lib/avatar-util"

export default function CareTeamClientPage() {
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isJoiningCall, setIsJoiningCall] = useState(false)

  // Mock care team members with Twilio integration support
  const careTeam = [
    {
      id: 1,
      name: "Dr. Sarah Smith",
      role: "Primary Care Physician",
      specialty: "Family Medicine",
      availability: "Available Now",
      image: getAssignedAvatar("Dr. Sarah Smith", "doctor"),
      lastContact: "2 hours ago",
      nextAppointment: "June 15, 2025",
      connectionQuality: "Excellent",
      isOnline: true,
      unreadMessages: 2,
      twilioChannelId: "dr-sarah-smith-channel",
      preferredCommunication: "video",
    },
    {
      id: 2,
      name: "Dr. Phil Deckerson",
      role: "Cardiologist",
      specialty: "Cardiology",
      availability: "Available in 15 min",
      image: getAssignedAvatar("Dr. Phil Deckerson", "doctor"),
      lastContact: "1 day ago",
      nextAppointment: "June 22, 2025",
      connectionQuality: "Good",
      isOnline: true,
      unreadMessages: 0,
      twilioChannelId: "dr-phil-d-channel",
      preferredCommunication: "chat",
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "Nurse Practitioner",
      specialty: "General Care",
      availability: "Available Now",
      image: getAssignedAvatar("Emma Davis", "nurse"),
      lastContact: "30 minutes ago",
      nextAppointment: "June 18, 2025",
      connectionQuality: "Excellent",
      isOnline: true,
      unreadMessages: 1,
      twilioChannelId: "emma-davis-channel",
      preferredCommunication: "chat",
    }
  ]

   // User avatar
  const userAvatar = getAssignedAvatar("Tom Johnson", "patient")

  // Selected care team member for chat
  const selectedMember = careTeam[0] // Dr. Sarah Smith by default

  // Twilio integration functions
  const sendMessageToTwilio = async (to: string, body: string) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, body }),
      })

      const data = await response.json()
      if (data.status === "success") {
        console.log("Message sent:", data.sid)
        return data
      } else {
        console.error("Twilio error:", data.error)
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Network error:", error)
      throw error
    }
  }

  const fetchMessagesFromTwilio = async (channelId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/get-messages/${channelId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()
      if (data.status === "success") {
        return data.messages
      } else {
        console.error("Error fetching messages:", data.error)
        return []
      }
    } catch (error) {
      console.error("Network error:", error)
      return []
    }
  }

  // Zoom integration functions
  const joinVideoCall = async () => {
    setIsJoiningCall(true)
    try {
      // Try to fetch existing meeting or create new one
      let meetingUrl = null

      // First try to get existing meeting
      try {
        const response = await fetch(`https://us05web.zoom.us/j/89976486740?pwd=chKXMa2NqORuEiQisFCcy8hwkkqjOO.1`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        const data = await response.json()
        if (data.status === "success" && data.meeting) {
          meetingUrl = data.meeting.join_url
        }
      } catch (error) {
        console.log("No existing meeting found, creating new one...")
      }

      // If no existing meeting, create a new one
      if (!meetingUrl) {
        const response = await fetch("http://127.0.0.1:5000/api/zoom/create-meeting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            providerId: selectedMember.id,
            patientId: "patient-tom-johnson",
            providerName: selectedMember.name,
            patientName: "Tom Johnson",
          }),
        })

        const data = await response.json()
        if (data.status === "success" && data.meeting) {
          meetingUrl = data.meeting.join_url
        }
      }

      // Redirect to Zoom meeting
      if (meetingUrl) {
        window.open(meetingUrl, "_blank")
      } else {
        // Fallback to a mock Zoom URL if backend fails
        const fallbackUrl = `https://us05web.zoom.us/j/89976486740?pwd=chKXMa2NqORuEiQisFCcy8hwkkqjOO.1`
        window.open(fallbackUrl, "_blank")
      }
    } catch (error) {
      console.error("Failed to join video call:", error)
      // Fallback to mock URL
      const fallbackUrl = `https://us05web.zoom.us/j/89976486740?pwd=chKXMa2NqORuEiQisFCcy8hwkkqjOO.1`
      window.open(fallbackUrl, "_blank")
    } finally {
      setIsJoiningCall(false)
    }
  }

  // Load messages on component mount
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true)
      try {
        const messages = await fetchMessagesFromTwilio(selectedMember.twilioChannelId)
        setChatMessages(
          messages.map((msg: any) => ({
            id: msg.sid || msg.id,
            sender: msg.author === "patient-tom-johnson" ? "You" : msg.author,
            message: msg.body,
            timestamp: new Date(msg.dateCreated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isProvider: msg.author !== "patient-tom-johnson",
            avatar: msg.author === "patient-tom-johnson" ? userAvatar : getAssignedAvatar(msg.author, "doctor"),
            twilioMessageSid: msg.sid,
            channelId: msg.channelSid,
          })),
        )
      } catch (error) {
        console.error("Failed to load messages:", error)
        // Fallback to mock data if backend is unavailable
        setChatMessages([
          {
            id: 1,
            sender: "Dr. Sarah Smith",
            message:
              "Hi Tom! I've reviewed your latest blood pressure readings. They look much better than last month.",
            timestamp: "2:30 PM",
            isProvider: true,
            avatar: getAssignedAvatar("Dr. Sarah Smith", "doctor"),
            twilioMessageSid: "SM1234567890abcdef",
            channelId: "dr-sarah-smith-channel",
          },
          {
            id: 2,
            sender: "You",
            message: "Thank you! I've been following the diet plan you recommended.",
            timestamp: "2:32 PM",
            isProvider: false,
            avatar: userAvatar,
            twilioMessageSid: "SM0987654321fedcba",
            channelId: "dr-sarah-smith-channel",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [selectedMember.twilioChannelId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  // Handle sending new messages
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const tempMessage = {
      id: Date.now(),
      sender: "You",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isProvider: false,
      avatar: userAvatar,
      twilioMessageSid: "pending",
      channelId: selectedMember.twilioChannelId,
    }

    // Optimistically add message to UI
    setChatMessages((prev) => [...prev, tempMessage])
    const messageToSend = newMessage
    setNewMessage("")

    try {
      // Send to Twilio backend
      const result = await sendMessageToTwilio( "+1234567890", messageToSend)

      // Update the message with the actual Twilio SID
      setChatMessages((prev) =>
        prev.map((msg) => (msg.id === tempMessage.id ? { ...msg, twilioMessageSid: result.sid } : msg)),
      )
    } catch (error) {
      console.error("Failed to send message:", error)
      // Remove the failed message or mark it as failed
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id ? { ...msg, twilioMessageSid: "failed", sender: "You (Failed)" } : msg,
        ),
      )
    }
  }

  // Poll for new messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const messages = await fetchMessagesFromTwilio(selectedMember.twilioChannelId)
        const formattedMessages = messages.map((msg: any) => ({
          id: msg.sid || msg.id,
          sender: msg.author === "patient-tom-johnson" ? "You" : msg.author,
          message: msg.body,
          timestamp: new Date(msg.dateCreated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isProvider: msg.author !== "patient-tom-johnson",
          avatar: msg.author === "patient-tom-johnson" ? userAvatar : getAssignedAvatar(msg.author, "doctor"),
          twilioMessageSid: msg.sid,
          channelId: msg.channelSid,
        }))

        // Only update if there are new messages
        if (formattedMessages.length !== chatMessages.length) {
          setChatMessages(formattedMessages)
        }
      } catch (error) {
        console.error("Failed to poll messages:", error)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [selectedMember.twilioChannelId, chatMessages.length])

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
                <p className="text-gray-500">
                  Connect with your healthcare providers through secure messaging and video calls
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-teal-600 hover:bg-teal-700" onClick={joinVideoCall} disabled={isJoiningCall}>
                  <Video className="h-4 w-4 mr-2" />
                  {isJoiningCall ? "Joining..." : "Join Video Call"}
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
                    <p className="text-sm text-gray-600">HD video calls and real-time messaging via Twilio</p>
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
            {/* Care Team List - Simplified */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Your Care Team
                  </CardTitle>
                  <CardDescription>Click to start a conversation</CardDescription>
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
                            <AvatarImage
                              src={member.image || "/placeholder.svg"}
                              alt={member.name}
                              className="object-cover"
                            />
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
                            <div className="flex items-center gap-2">
                              {member.unreadMessages > 0 && (
                                <Badge className="bg-teal-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center">
                                  {member.unreadMessages}
                                </Badge>
                              )}
                              {member.preferredCommunication === "video" && <Video className="h-4 w-4 text-teal-600" />}
                            </div>
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
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{member.lastContact}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">Houston Methodist Hospital Care Team</h3>
                    </div>
                    <div className="flex items-center gap-2">
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
                  </TabsList>

                  <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
                    {/* Chat Messages with Twilio Integration */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-32">
                          <div className="text-gray-500">Loading messages...</div>
                        </div>
                      ) : (
                        <>
                          {chatMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex gap-3 ${message.isProvider ? "justify-start" : "justify-end"}`}
                            >
                              {message.isProvider && (
                                <Avatar className="h-8 w-8 mt-1">
                                  <AvatarImage
                                    src={message.avatar || "/placeholder.svg"}
                                    alt={message.sender}
                                    className="object-cover"
                                  />
                                </Avatar>
                              )}
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  message.isProvider ? "bg-gray-100 text-gray-900" : "bg-teal-600 text-white"
                                }`}
                              >
                                <p className="text-sm">{message.message}</p>
                                <div
                                  className={`flex items-center justify-between mt-1 ${message.isProvider ? "text-gray-500" : "text-teal-100"}`}
                                >
                                  <p className="text-xs">{message.timestamp}</p>
                                  {message.twilioMessageSid && message.twilioMessageSid !== "pending" && (
                                    <span className="text-xs opacity-50">
                                      {message.twilioMessageSid === "failed"
                                        ? "Failed"
                                        : `✓ ${message.twilioMessageSid.slice(-4)}`}
                                    </span>
                                  )}
                                  {message.twilioMessageSid === "pending" && (
                                    <span className="text-xs opacity-50">Sending...</span>
                                  )}
                                </div>
                              </div>
                              {!message.isProvider && (
                                <Avatar className="h-8 w-8 mt-1">
                                  <AvatarImage
                                    src={message.avatar || "/placeholder.svg"}
                                    alt={message.sender}
                                    className="object-cover"
                                  />
                                </Avatar>
                              )}
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </div>

                    {/* Enhanced Chat Input */}
                    <div className="border-t p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="default" size="md" className="h-8 w-8 p-0">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            placeholder={`Message ${selectedMember.name}...`}
                            className="w-full rounded-lg border border-gray-300 p-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                            via Twilio
                          </div>
                        </div>
                        <Button
                          className="bg-teal-600 hover:bg-teal-700"
                          size="sm"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>Channel: {selectedMember.twilioChannelId}</span>
                        <span className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          Connected to Backend
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="video" className="flex-1 flex flex-col mt-0">
                    <div className="flex-1 bg-gray-900 rounded-lg m-6 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Video className="h-16 w-16 mx-auto mb-4 text-blue-400" />
                          <h3 className="text-xl font-semibold mb-2">Video Call with {selectedMember.name}</h3>
                          <p className="text-gray-300 mb-2">Click the button below to join the video consultation</p>
                          <p className="text-sm text-gray-400 mb-6">Powered by Zoom • 5G Optimized</p>

                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
                            onClick={joinVideoCall}
                            disabled={isJoiningCall}
                          >
                            <Video className="h-5 w-5 mr-2" />
                            {isJoiningCall ? "Joining Meeting..." : "Join Video Call Now"}
                          </Button>

                          <div className="mt-6 text-sm text-gray-400">
                            <p>• HD video quality with 5G connection</p>
                            <p>• Secure end-to-end encryption</p>
                            <p>• No downloads required</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>

          {/* Quick Actions - Simplified */}
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
