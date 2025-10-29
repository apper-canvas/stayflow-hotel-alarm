import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Label = forwardRef(({ 
  className = "", 
  ...props 
}, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-secondary leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  )
})

Label.displayName = "Label"

export default Label