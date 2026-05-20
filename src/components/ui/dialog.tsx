import * as React from "react"
import { Root, Trigger, Content } from "@radix-ui/react-dialog"
import { X } from "lucide-react"

const Dialog = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, children, ...props }, ref) => (
  <Root ref={ref} className={cn("bg-white", className)}>
    <Trigger asChild>
      <button className="flex h-9 w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-2 text-left hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary">
        <span>Dialog Trigger</span>
        <X className="h-4 w-4" />
      </button>
    </Trigger>
    <Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] p-4">
      {children}
      <div className="absolute right-4 top-4">
        <button
          onClick={window => document.dispatchEvent(new CustomEvent("close-dialog", { detail: {} }))}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </Content>
  </Root>
)})

Dialog.displayName = "Dialog"

export { Dialog }
