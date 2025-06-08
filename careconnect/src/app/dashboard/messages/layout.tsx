import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Messages - CareConnect",
  description: "Chat with your AI health assistant",
}

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 