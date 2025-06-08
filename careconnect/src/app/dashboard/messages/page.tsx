/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Send } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard-header"

export default function MessagesPage() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your CareConnect AI assistant. I am here to help you understand your health data, answer questions about your vital signs, and provide personalized health insights. How can I assist you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { sender: "user", text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/bedrock-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      })

      const data = await res.json()
      const botMessage = {
        sender: "ai",
        text: data?.response || "Sorry, I couldn't get a response.",
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "There was an error. Please try again." },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="ml-64">
        <DashboardHeader />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="text-gray-500">Chat with your AI health assistant</p>
          </div>

          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader>
              <CardTitle>AI Health Assistant</CardTitle>
              <CardDescription>Ask questions about your health data and get personalized insights</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto border-t p-6">
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex gap-4 ${msg.sender === "user" ? "justify-end" : ""}`}>
                    {msg.sender === "ai" && (
                      <div className="flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-teal-100 text-teal-600 font-semibold">
                        AI
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-4 max-w-[80%] ${
                        msg.sender === "user" ? "bg-teal-100" : "bg-gray-100"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    {msg.sender === "user" && (
                      <div className="flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-teal-600 text-white font-semibold">
                        You
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-teal-100 text-teal-600 font-semibold">
                      AI
                    </div>
                    <div className="rounded-lg bg-gray-100 p-4 max-w-[80%]">
                      <p className="text-sm italic">Thinking...</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <div className="border-t p-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message here..."
                  className="flex-1 rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Button onClick={sendMessage} className="bg-teal-600 hover:bg-teal-700 px-6">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}
