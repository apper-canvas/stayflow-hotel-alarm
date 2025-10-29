import React, { useState, useRef, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"

const SearchBar = ({ onSearch, className = "" }) => {
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState({ adults: 2, children: 0 })
  const [showGuestDropdown, setShowGuestDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowGuestDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = () => {
    if (!destination || !checkIn || !checkOut) return
    
    onSearch({
      destination,
      checkIn,
      checkOut,
      guests
    })
  }

  const updateGuestCount = (type, increment) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + increment)
    }))
  }

  const totalGuests = guests.adults + guests.children

  return (
    <div className={`bg-surface rounded-2xl card-shadow p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Destination */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary">Destination</label>
          <div className="relative">
            <ApperIcon name="MapPin" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Where are you going?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary">Check-in</label>
          <div className="relative">
            <ApperIcon name="Calendar" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="pl-10"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-secondary">Check-out</label>
          <div className="relative">
            <ApperIcon name="Calendar" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="pl-10"
              min={checkIn || new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {/* Guests */}
        <div className="space-y-2 relative" ref={dropdownRef}>
          <label className="text-sm font-medium text-secondary">Guests</label>
          <div className="relative">
            <ApperIcon name="Users" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <button
              type="button"
              onClick={() => setShowGuestDropdown(!showGuestDropdown)}
              className="w-full px-3 py-2 pl-10 text-sm bg-white border border-gray-300 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200"
            >
              {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
            </button>

            {showGuestDropdown && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-surface rounded-lg border border-gray-200 card-shadow z-50 p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-secondary">Adults</div>
                      <div className="text-sm text-gray-500">Ages 13+</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateGuestCount("adults", -1)}
                        disabled={guests.adults <= 1}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ApperIcon name="Minus" size={14} />
                      </button>
                      <span className="w-8 text-center font-medium">{guests.adults}</span>
                      <button
                        type="button"
                        onClick={() => updateGuestCount("adults", 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <ApperIcon name="Plus" size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-secondary">Children</div>
                      <div className="text-sm text-gray-500">Ages 0-12</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateGuestCount("children", -1)}
                        disabled={guests.children <= 0}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ApperIcon name="Minus" size={14} />
                      </button>
                      <span className="w-8 text-center font-medium">{guests.children}</span>
                      <button
                        type="button"
                        onClick={() => updateGuestCount("children", 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        <ApperIcon name="Plus" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Button 
          onClick={handleSearch}
          size="lg"
          className="w-full md:w-auto px-8"
          disabled={!destination || !checkIn || !checkOut}
        >
          <ApperIcon name="Search" size={20} className="mr-2" />
          Search Hotels
        </Button>
      </div>
    </div>
  )
}

export default SearchBar