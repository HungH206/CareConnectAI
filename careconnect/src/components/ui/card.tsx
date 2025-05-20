import * as React from "react"
import { twMerge } from "tailwind-merge"

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge(
      "rounded-lg border bg-white shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={twMerge("px-4 py-2 border-b", className)}
    {...props}
  />
)

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h3
    className={twMerge("text-lg font-semibold", className)}
    {...props}
  />
)

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  ...props
}) => (
  <p
    className={twMerge("text-sm text-gray-500", className)}
    {...props}
  />
)

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div className={twMerge("p-4", className)} {...props} />
)