import React, { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"

const FilterSidebar = ({ onFiltersChange, className = "" }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    starRating: [],
    amenities: [],
    guestRating: 0
  })

  const starRatings = [5, 4, 3, 2, 1]
  const amenities = ["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Parking", "Beach Access"]

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const toggleArrayFilter = (key, value) => {
    const currentArray = filters[key]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray)
  }

  const clearAllFilters = () => {
    const clearedFilters = {
      priceRange: [0, 1000],
      starRating: [],
      amenities: [],
      guestRating: 0
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-secondary">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="text-primary hover:text-primary/80"
        >
          Clear All
        </Button>
      </div>

      {/* Price Range */}
      <Card className="p-4">
        <h4 className="font-medium text-secondary mb-3">Price Range</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}+</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={filters.priceRange[1]}
            onChange={(e) => updateFilter("priceRange", [0, parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </Card>

      {/* Star Rating */}
      <Card className="p-4">
        <h4 className="font-medium text-secondary mb-3">Star Rating</h4>
        <div className="space-y-2">
          {starRatings.map(rating => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.starRating.includes(rating)}
                onChange={() => toggleArrayFilter("starRating", rating)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary/50"
              />
              <div className="flex items-center gap-1">
                {Array.from({ length: rating }, (_, i) => (
                  <ApperIcon key={i} name="Star" size={14} className="text-accent fill-accent" />
                ))}
                <span className="text-sm text-gray-600 ml-1">& up</span>
              </div>
            </label>
          ))}
        </div>
      </Card>

      {/* Guest Rating */}
      <Card className="p-4">
        <h4 className="font-medium text-secondary mb-3">Guest Rating</h4>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 3.0].map(rating => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="guestRating"
                value={rating}
                checked={filters.guestRating === rating}
                onChange={() => updateFilter("guestRating", rating)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary/50"
              />
              <span className="text-sm text-gray-700">{rating}+ Excellent</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Amenities */}
      <Card className="p-4">
        <h4 className="font-medium text-secondary mb-3">Amenities</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {amenities.map(amenity => (
            <label key={amenity} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => toggleArrayFilter("amenities", amenity)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary/50"
              />
              <span className="text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default FilterSidebar