"use client"

import type React from "react"

import { useState } from "react"
import { Camera } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AvatarUploaderProps {
  currentImage?: string
  name: string
  onImageChange?: (file: File) => void
  size?: "sm" | "md" | "lg"
  editable?: boolean
}

export default function AvatarUploader({
  currentImage,
  name,
  onImageChange,
  size = "md",
  editable = false,
}: AvatarUploaderProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-32 w-32",
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setPreviewImage(previewUrl)

      // Call parent callback
      onImageChange?.(file)
    }
  }

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={previewImage || currentImage || "/placeholder.svg"} alt={name} />
        <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">{getInitials(name)}</AvatarFallback>
      </Avatar>

      {editable && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <Camera className="h-6 w-6 text-white" />
            <input id="avatar-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      )}
    </div>
  )
}
