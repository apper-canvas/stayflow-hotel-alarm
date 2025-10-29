import React from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto space-y-6 animate-fade-in">
        {/* 404 Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full gradient-bg mb-4">
          <ApperIcon name="AlertCircle" size={48} className="text-white" />
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-6xl font-display font-bold text-secondary">404</h1>
          <h2 className="text-2xl font-display font-semibold text-secondary">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={() => navigate("/")}
            className="w-full gradient-bg text-white hover:opacity-90 transition-opacity"
          >
            <ApperIcon name="Home" size={20} className="mr-2" />
            Back to Home
          </Button>
          
          <p className="text-sm text-gray-500">
            Looking for hotels? Try searching from the homepage.
          </p>
        </div>

        {/* Helpful Links */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Quick Links:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => navigate("/my-bookings")}
              className="text-sm text-primary hover:underline"
            >
              My Bookings
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => navigate("/room-service")}
              className="text-sm text-primary hover:underline"
            >
              Room Service
            </button>
            <span className="text-gray-300">•</span>
            <button
              onClick={() => navigate("/")}
              className="text-sm text-primary hover:underline"
            >
              Search Hotels
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound