import React, { useState, useRef, useEffect } from "react"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import { hotelService } from "@/services/api/hotelService"
const SearchBar = ({ onSearch, onToggleFilters, className = "" }) => {
  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState({ adults: 2, children: 0, rooms: 1 })
  const [showGuestDropdown, setShowGuestDropdown] = useState(false)
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false)
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [showCheckInCalendar, setShowCheckInCalendar] = useState(false)
  const [showCheckOutCalendar, setShowCheckOutCalendar] = useState(false)
  const dropdownRef = useRef(null)
  const destinationRef = useRef(null)
  const checkInRef = useRef(null)
  const checkOutRef = useRef(null)

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
    const minValues = { adults: 1, children: 0, rooms: 1 }
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(minValues[type], prev[type] + increment)
    }))
  }

  const handleDestinationChange = async (value) => {
    setDestination(value)
    if (value.length >= 2) {
      const hotels = await hotelService.getAll()
const cities = [...new Set(hotels.map(h => h.location?.city).filter(Boolean))]
      const suggestions = [
        ...cities.filter(city => city?.toLowerCase().includes(value.toLowerCase())).map(city => ({ type: 'city', name: city })),
        ...hotels.filter(hotel => hotel.name.toLowerCase().includes(value.toLowerCase())).map(hotel => ({ type: 'hotel', name: hotel.name, location: hotel.location }))
      ].slice(0, 8)
      setDestinationSuggestions(suggestions)
      setShowDestinationDropdown(true)
    } else {
      setShowDestinationDropdown(false)
    }
  }

  const selectDestination = (suggestion) => {
    setDestination(suggestion.type === 'city' ? suggestion.name : `${suggestion.name}, ${suggestion.location}`)
    setShowDestinationDropdown(false)
  }

  const generateCalendarDates = (startDate) => {
    const dates = []
    const start = new Date(startDate || new Date())
    for (let i = 0; i < 42; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      const price = Math.floor(Math.random() * 200) + 100
      dates.push({
        date: date.toISOString().split('T')[0],
        displayDate: date.getDate(),
        month: date.getMonth(),
        available: Math.random() > 0.2,
        price
      })
    }
    return dates
  }

  const [calendarDates] = useState(generateCalendarDates())

const totalGuests = guests.adults + guests.children

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowGuestDropdown(false)
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setShowDestinationDropdown(false)
      }
      if (checkInRef.current && !checkInRef.current.contains(event.target)) {
        setShowCheckInCalendar(false)
      }
      if (checkOutRef.current && !checkOutRef.current.contains(event.target)) {
        setShowCheckOutCalendar(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  return (
<div className={`bg-surface rounded-2xl card-shadow p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Destination */}
        <div className="space-y-2 relative" ref={destinationRef}>
          <label className="text-sm font-medium text-secondary">Destination</label>
          <div className="relative">
            <ApperIcon name="MapPin" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
            <Input
              placeholder="Search cities or hotels..."
              value={destination}
              onChange={(e) => handleDestinationChange(e.target.value)}
              onFocus={() => destination.length >= 2 && setShowDestinationDropdown(true)}
              className="pl-10"
            />
            {showDestinationDropdown && destinationSuggestions.length > 0 && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-surface rounded-lg border border-gray-200 card-shadow z-50 max-h-64 overflow-y-auto">
                {destinationSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectDestination(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0 flex items-start gap-3"
                  >
                    <ApperIcon name={suggestion.type === 'city' ? 'MapPin' : 'Building2'} size={18} className="text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-secondary">{suggestion.name}</div>
                      {suggestion.location && <div className="text-xs text-gray-500">{suggestion.location}</div>}
                      <div className="text-xs text-primary mt-1">{suggestion.type === 'city' ? 'City' : 'Hotel'}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Check-in */}
        <div className="space-y-2 relative" ref={checkInRef}>
          <label className="text-sm font-medium text-secondary">Check-in</label>
          <div className="relative">
            <ApperIcon name="Calendar" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
            <Input
              placeholder="Select date"
              value={checkIn}
              onFocus={() => setShowCheckInCalendar(true)}
              readOnly
              className="pl-10 cursor-pointer"
            />
            {showCheckInCalendar && (
              <div className="absolute top-full mt-2 left-0 bg-surface rounded-lg border border-gray-200 card-shadow z-50 p-4 w-80">
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDates.slice(0, 21).map((dateObj, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (dateObj.available) {
                          setCheckIn(dateObj.date)
                          setShowCheckInCalendar(false)
                        }
                      }}
                      disabled={!dateObj.available}
                      className={`p-2 text-center rounded-lg text-sm ${
                        dateObj.available 
                          ? 'hover:bg-primary/10 cursor-pointer' 
                          : 'text-gray-300 cursor-not-allowed'
                      } ${checkIn === dateObj.date ? 'bg-primary text-white' : ''}`}
                    >
                      <div className="font-medium">{dateObj.displayDate}</div>
                      {dateObj.available && <div className="text-xs text-primary">${dateObj.price}</div>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Check-out */}
        <div className="space-y-2 relative" ref={checkOutRef}>
          <label className="text-sm font-medium text-secondary">Check-out</label>
          <div className="relative">
            <ApperIcon name="Calendar" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
            <Input
              placeholder="Select date"
              value={checkOut}
              onFocus={() => setShowCheckOutCalendar(true)}
              readOnly
              className="pl-10 cursor-pointer"
            />
            {showCheckOutCalendar && (
              <div className="absolute top-full mt-2 left-0 bg-surface rounded-lg border border-gray-200 card-shadow z-50 p-4 w-80">
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {calendarDates.slice(0, 21).map((dateObj, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (dateObj.available && (!checkIn || dateObj.date > checkIn)) {
                          setCheckOut(dateObj.date)
                          setShowCheckOutCalendar(false)
                        }
                      }}
                      disabled={!dateObj.available || (checkIn && dateObj.date <= checkIn)}
                      className={`p-2 text-center rounded-lg text-sm ${
                        dateObj.available && (!checkIn || dateObj.date > checkIn)
                          ? 'hover:bg-primary/10 cursor-pointer' 
                          : 'text-gray-300 cursor-not-allowed'
                      } ${checkOut === dateObj.date ? 'bg-primary text-white' : ''}`}
                    >
                      <div className="font-medium">{dateObj.displayDate}</div>
                      {dateObj.available && <div className="text-xs text-primary">${dateObj.price}</div>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Guests & Rooms */}
        <div className="space-y-2 relative" ref={dropdownRef}>
          <label className="text-sm font-medium text-secondary">Guests & Rooms</label>
          <div className="relative">
            <ApperIcon name="Users" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
            <button
              type="button"
              onClick={() => setShowGuestDropdown(!showGuestDropdown)}
              className="w-full px-3 py-2 pl-10 text-sm bg-white border border-gray-300 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors duration-200"
            >
              {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}, {guests.rooms} {guests.rooms === 1 ? "Room" : "Rooms"}
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

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-secondary">Rooms</div>
                      <div className="text-sm text-gray-500">Number of rooms</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateGuestCount("rooms", -1)}
                        disabled={guests.rooms <= 1}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ApperIcon name="Minus" size={14} />
                      </button>
                      <span className="w-8 text-center font-medium">{guests.rooms}</span>
                      <button
                        type="button"
                        onClick={() => updateGuestCount("rooms", 1)}
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

<div className="mt-6 flex gap-4">
        <Button 
          onClick={handleSearch}
          size="lg"
          className="flex-1 md:flex-initial px-8"
          disabled={!destination || !checkIn || !checkOut}
        >
          <ApperIcon name="Search" size={20} className="mr-2" />
          Search Hotels
        </Button>
        <Button
          onClick={onToggleFilters}
          variant="outline"
          size="lg"
          className="px-6"
        >
          <ApperIcon name="SlidersHorizontal" size={20} className="mr-2" />
          Advanced Filters
        </Button>
      </div>
</div>
  )
}

export default SearchBar