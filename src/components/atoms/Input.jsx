import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Input = forwardRef(({ 
  className = "", 
  type = "text",
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        error && "border-error focus:ring-error/50 focus:border-error",
        className
      )}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input