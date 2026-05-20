import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance"

const buttonVariants = cva(
  variants: {
    primary: "bg-primary text-primary hover:bg-primary-600 active:bg-primary-700",
    secondary: "bg-secondary text-secondary hover:bg-secondary-600 active:bg-secondary-700",
    outline: "border border-slate-200 hover:bg-slate-100 active:bg-slate-200",
    ghost: "hover:bg-slate-100 text-slate-500",
  },
  sizes: {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 py-1.5",
    lg: "h-11 px-6 py-2.5",
    icon: "h-10 w-10",
  },
}

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", asChild = false, ...props },
  ref
) => {
  return (
    <Slot
      className={cn(
        buttonVariants({ variant, size, className }),
        asChild && "text-base"
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
