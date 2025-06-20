/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-empty-object-type */
"use client"

import * as React from "react"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Avatar: React.FC<AvatarProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  )
}

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const AvatarImage: React.FC<AvatarImageProps> = ({ src, alt, className, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className || ""}`}
      {...props}
    />
  )
}

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={`flex items-center justify-center bg-gray-200 text-gray-600 ${className || "w-full h-full"}`}
      {...props}
    >
      {children}
    </div>
  )
}