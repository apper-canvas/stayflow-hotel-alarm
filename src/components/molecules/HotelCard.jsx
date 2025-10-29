import React from "react"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"

const HotelCard = ({ hotel, className = "" }) => {
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
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.images?.[0] || "/api/placeholder/400/300"}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="primary" className="backdrop-blur-sm">
            {hotel.starRating} ★
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <div className="bg-surface/90 backdrop-blur-sm px-2 py-1 rounded-lg text-sm font-semibold text-secondary">
            {hotel.rating} / 5
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Hotel Name & Location */}
        <div className="mb-3">
          <h3 className="font-display text-xl font-semibold text-secondary mb-1 line-clamp-1">
            {hotel.name}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <ApperIcon name="MapPin" size={14} className="mr-1" />
            <span>{hotel.location?.city}, {hotel.location?.state}</span>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-3">
          {renderStars(hotel.starRating)}
          <span className="text-sm text-gray-500 ml-1">
            ({hotel.reviewCount?.toLocaleString()} reviews)
          </span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-4">
          {hotel.amenities?.slice(0, 4).map((amenity, index) => (
            <Badge key={index} variant="default" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {hotel.amenities?.length > 4 && (
            <Badge variant="default" className="text-xs">
              +{hotel.amenities.length - 4} more
            </Badge>
          )}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold gradient-text">
              {formatPrice(250)}
            </div>
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