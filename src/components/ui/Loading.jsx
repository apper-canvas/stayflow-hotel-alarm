import React from "react"

const Loading = ({ className = "" }) => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface ${className}`}>
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-accent rounded-full animate-spin mx-auto" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-secondary">Loading StayFlow</h3>
          <p className="text-gray-600">Finding your perfect stay...</p>
        </div>
      </div>
    </div>
  )
}

export default Loading