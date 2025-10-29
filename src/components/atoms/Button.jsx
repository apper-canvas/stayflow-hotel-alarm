import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className = "", 
  variant = "primary", 
  size = "md", 
  disabled = false,
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "gradient-bg text-white hover:opacity-90 focus:ring-primary/50",
    secondary: "bg-white text-secondary border border-gray-300 hover:bg-gray-50 focus:ring-gray-200",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus:ring-primary/50",
    ghost: "text-secondary hover:bg-gray-100 focus:ring-gray-200",
    danger: "bg-error text-white hover:bg-error/90 focus:ring-error/50"
  }
  
  const sizes = {
    sm: "px-3 py-2 text-sm h-9",
    md: "px-4 py-2 text-sm h-10",
    lg: "px-6 py-3 text-base h-12",
    xl: "px-8 py-4 text-lg h-14"
  }
  
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button