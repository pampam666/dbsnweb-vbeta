import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "outline"
}

const cardVariants = cva(
  variants: {
    variant: {
      default: "bg-white border-slate-200 shadow-sm",
      hover: "bg-slate-50 border-slate-300 shadow-md",
      outline: "border-2 border-slate-200 bg-white",
    },
  },
  defaultVariants: ["variant"],
})

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, className }),
          "rounded-lg",
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = "Card"

export { Card }
