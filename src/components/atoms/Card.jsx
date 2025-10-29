import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ 
  className = "", 
  children,
  hoverable = false,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-surface rounded-xl border border-gray-200 card-shadow p-6",
        hoverable && "hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card