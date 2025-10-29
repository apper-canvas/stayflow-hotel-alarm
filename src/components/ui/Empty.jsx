import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No results found",
  description = "Try adjusting your search criteria",
  actionLabel,
  onAction,
  icon = "SearchX",
  className = ""
}) => {
  return (
    <div className={`min-h-[400px] flex items-center justify-center p-8 ${className}`}>
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name={icon} size={40} className="text-gray-400" />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-secondary">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-3 gradient-bg text-white rounded-lg hover:opacity-90 transition-opacity duration-200 font-medium"
          >
            <ApperIcon name="Plus" size={18} />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export default Empty