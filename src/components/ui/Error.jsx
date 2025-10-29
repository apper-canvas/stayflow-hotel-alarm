import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  className = ""
}) => {
  return (
    <div className={`min-h-[400px] flex items-center justify-center p-8 ${className}`}>
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name="AlertCircle" size={40} className="text-error" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-secondary">Oops! Something went wrong</h3>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
          >
            <ApperIcon name="RotateCcw" size={18} />
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}

export default Error