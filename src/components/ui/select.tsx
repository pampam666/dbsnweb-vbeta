import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectTrigger = SelectPrimitive.Trigger
const SelectContent = SelectPrimitive.Content
const SelectItem = SelectPrimitive.Item

interface SelectProps
  extends React.ComponentPropsWithoutRef<typeof Select>,
  VariantProps {
    placeholder?: string
  }
> {
  placeholder = "Select an option",
  ...props
}

const Select = React.forwardRef<
  HTMLDivElement,
  SelectProps
>(({ className, placeholder, ...props }, ref) => {
  return (
    <Select ref={ref} className={cn("w-full", className)}>
      <SelectTrigger className="flex h-9 w-full items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm bg-transparent hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary">
        {placeholder && (
          <span className="text-slate-500">{placeholder}</span>
        )}
        <ChevronDown className="h-4 w-4 ml-2" />
      </SelectTrigger>
      <SelectContent className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white shadow-md">
        <SelectViewport className="p-1">
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectViewport>
      </SelectContent>
    </Select>
  )
})

Select.displayName = "Select"

export { Select }
