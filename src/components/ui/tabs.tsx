import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
  VariantProps {
    defaultValue?: string
  }
> {
  defaultValue = undefined,
  ...props
}

const Tabs = React.forwardRef<
  HTMLDivElement,
  TabsProps
>(({ className, defaultValue, ...props }, ref) => {
  return (
    <TabsPrimitive.Root
      ref={ref}
      defaultValue={defaultValue}
      className={cn("w-full", className)}
      {...props}
    />
  )
})

Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn("inline-flex h-9 items-center gap-x-1 border-b border-slate-200", className)}
      {...props}
    />
  )
})

TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
  VariantProps<typeof buttonVariants>
>(({ className, variant = "secondary", size = "default", ...props }, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        buttonVariants({ variant, size, className }),
        "px-3 py-2"
      )}
      {...props}
    />
  )
})

TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn("mt-2 p-4 border border-slate-200 rounded-md", className)}
      {...props}
    />
  )
})

TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
