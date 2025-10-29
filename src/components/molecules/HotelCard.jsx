import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import { cn } from "@/utils/cn"

const HotelCard = ({ hotel, isFavorite = false, onToggleFavorite, viewMode = "grid", className = "" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate(`/hotel/${hotel.Id}`)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <ApperIcon
        key={index}
        name="Star"
        size={16}
        className={index < rating ? "text-accent fill-accent" : "text-gray-300"}
      />
    ))
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <Card hoverable className={`overflow-hidden p-0 ${className}`}>
      {/* Hotel Image */}
{/* Image Carousel */}
      <div className="relative h-64 overflow-hidden group">
        <img
          src={hotel.images?.[currentImageIndex] || "/api/placeholder/400/300"}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Favorite Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite?.(hotel.Id)
          }}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg z-10"
        >
          <ApperIcon 
            name={isFavorite ? "Heart" : "Heart"} 
            size={20} 
            className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"}
          />
        </button>

        {/* Star Rating Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="primary" className="backdrop-blur-sm">
            {hotel.starRating} ★
          </Badge>
        </div>

        {/* Carousel Navigation */}
        {hotel.images && hotel.images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setCurrentImageIndex((prev) => 
                  prev === 0 ? hotel.images.length - 1 : prev - 1
                )
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setCurrentImageIndex((prev) => 
                  prev === hotel.images.length - 1 ? 0 : prev + 1
                )
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <ApperIcon name="ChevronRight" size={16} />
            </button>
            
            {/* Carousel Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {hotel.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentImageIndex(index)
                  }}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    currentImageIndex === index 
                      ? "bg-white w-6" 
                      : "bg-white/60 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-6">
        {/* Hotel Name & Location */}
        <div className="mb-3">
          <h3 className="font-display text-xl font-semibold text-secondary mb-1 line-clamp-1">
            {hotel.name}
          </h3>
<div className="flex items-center gap-3 text-gray-600 text-sm">
            <div className="flex items-center">
              <ApperIcon name="MapPin" size={14} className="mr-1" />
              <span>{hotel.location?.city}, {hotel.location?.state}</span>
            </div>
            {hotel.distanceFromCenter && (
              <div className="flex items-center text-xs">
                <span className="text-gray-500">{hotel.distanceFromCenter} km from center</span>
              </div>
            )}
          </div>
        </div>

        {/* Star Rating */}
<div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {renderStars(hotel.starRating)}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded">
              {hotel.rating}
            </div>
            <span className="text-sm text-gray-600">
              ({hotel.reviewCount?.toLocaleString()} reviews)
            </span>
          </div>
        </div>

        {/* Amenities */}
{/* Amenity Icons */}
        <div className="flex flex-wrap gap-3 mb-4">
          {hotel.amenities?.slice(0, 6).map((amenity, index) => {
            const iconMap = {
              "Free WiFi": "Wifi",
              "Swimming Pool": "Waves",
              "Gym": "Dumbbell",
              "Spa": "Sparkles",
              "Free Parking": "Car",
              "Restaurant": "UtensilsCrossed",
              "Room Service": "BellRing",
              "Airport Shuttle": "Plane",
              "Pet-Friendly": "PawPrint",
              "Air Conditioning": "Wind",
              "Bar": "Wine",
              "Business Center": "Briefcase"
            }
            const icon = iconMap[amenity] || "Check"
            return (
              <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                <ApperIcon name={icon} size={14} className="text-primary" />
                <span>{amenity}</span>
              </div>
            )
          })}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
<div>
            <div className="text-xs text-gray-500 mb-1">Starting from</div>
            <div className="text-3xl font-bold gradient-text">
              ${hotel.pricePerNight}
            </div>
            <div className="text-xs text-gray-500">per night</div>
            <div className="text-sm text-gray-600">per night</div>
          </div>
          <Button onClick={handleViewDetails} size="md">
            View Details
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default HotelCard