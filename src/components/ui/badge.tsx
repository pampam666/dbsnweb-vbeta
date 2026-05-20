import * as React from "react"
import { cva, type VariantProps } from "class-variance"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps {
  variant?: "default" | "success" | "warning" | "info"
}

const badgeVariants = cva(
  variants: {
    variant: {
      default: "bg-slate-100 text-slate-700 border-slate-200",
      success: "bg-green-100 text-green-700 border-green-200",
      warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
      info: "bg-blue-100 text-blue-700 border-blue-200",
    },
  },
  defaultVariants: ["variant"],
})

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium",
          badgeVariants({ variant, className }),
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = "Badge"

export { Badge }
