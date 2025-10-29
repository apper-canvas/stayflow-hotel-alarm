import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
const FilterSidebar = ({ onFiltersChange, className = "", resultCount = 0 }) => {
const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    starRating: [],
    amenities: [],
    propertyTypes: [],
    guestRating: 0,
    distanceFromCenter: 10
  })

const starRatings = [5, 4, 3, 2, 1]
  const amenities = ["WiFi", "Pool", "Gym", "Spa", "Parking", "Restaurant", "Room Service", "Pet-Friendly"]
  const propertyTypes = ["Hotels", "Resorts", "Apartments", "Villas"]

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
      propertyTypes: [],
      guestRating: 0,
      distanceFromCenter: 10
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
            onChange={(e) => updateFilter("priceRange", [filters.priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex items-center gap-4 mt-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Min Price</label>
              <input
                type="number"
                min="0"
                max={filters.priceRange[1]}
                value={filters.priceRange[0]}
                onChange={(e) => updateFilter("priceRange", [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">Max Price</label>
              <input
                type="number"
                min={filters.priceRange[0]}
                max="1000"
                value={filters.priceRange[1]}
                onChange={(e) => updateFilter("priceRange", [filters.priceRange[0], parseInt(e.target.value) || 1000])}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
              />
            </div>
          </div>
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
{/* Property Type */}
        <div className="space-y-3 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-secondary">Property Type</h3>
          </div>
          <div className="space-y-2">
            {propertyTypes.map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.propertyTypes.includes(type)}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...filters.propertyTypes, type]
                      : filters.propertyTypes.filter(t => t !== type)
                    updateFilter("propertyTypes", newTypes)
                  }}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span className="text-sm text-secondary">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Distance from Center */}
        <div className="space-y-3 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-secondary">Distance from Center</h3>
            <span className="text-sm text-gray-500">{filters.distanceFromCenter} km</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={filters.distanceFromCenter}
            onChange={(e) => updateFilter("distanceFromCenter", parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 km</span>
            <span>20 km</span>
          </div>
        </div>

        {/* Results Counter */}
        <div className="bg-primary/5 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{resultCount}</div>
          <div className="text-sm text-secondary mt-1">
            {resultCount === 1 ? 'Property' : 'Properties'} Found
          </div>
        </div>
      </Card>
    </div>
  )
}

export default FilterSidebar