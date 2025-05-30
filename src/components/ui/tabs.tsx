import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

export const Tabs = TabsPrimitive.Root

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={twMerge(
      "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> &
    VariantProps<typeof triggerStyles>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={twMerge(triggerStyles(), className)}
    {...props}
  />
))
TabsTrigger.displayName = "TabsTrigger"

const triggerStyles = cva(
  "px-3 py-1.5 text-sm font-medium leading-none rounded-[0.25rem] focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "data-[state=active]:bg-white data-[state=active]:text-teal-600 hover:bg-white/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={twMerge("mt-2 focus:outline-none", className)}
    {...props}
  />
))
TabsContent.displayName = "TabsContent"