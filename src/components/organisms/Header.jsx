import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Header = () => {
  const navigate = useNavigate()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const navigationItems = [
    { label: "Search Hotels", path: "/", icon: "Search" },
    { label: "My Bookings", path: "/bookings", icon: "Calendar" },
    { label: "Room Service", path: "/room-service", icon: "UtensilsCrossed" },
    { label: "Rewards", path: "/rewards", icon: "Gift" },
    { label: "Profile", path: "/profile", icon: "User" }
  ]

  return (
    <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
              <ApperIcon name="Hotel" className="text-white" size={24} />
            </div>
            <div>
              <div className="font-display font-bold text-xl gradient-text">StayFlow</div>
              <div className="text-xs text-gray-500 -mt-1">Premium Hotels</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-secondary hover:text-primary transition-colors duration-200"
              >
                <ApperIcon name={item.icon} size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/bookings")}
            >
              <ApperIcon name="Calendar" size={16} className="mr-2" />
              My Trips
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 text-secondary hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            <ApperIcon name={showMobileMenu ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-surface/95 backdrop-blur-md">
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-secondary hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <ApperIcon name={item.icon} size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              <div className="px-4 py-2 mt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setShowMobileMenu(false)
                    navigate("/bookings")
                  }}
                  className="w-full"
                >
                  <ApperIcon name="Calendar" size={16} className="mr-2" />
                  View My Bookings
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header