import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"

const RoomCard = ({ room, onSelect, className = "" }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <Card hoverable className={`overflow-hidden p-0 ${className}`}>
      <div className="flex flex-col sm:flex-row">
        {/* Room Image */}
        <div className="w-full sm:w-64 h-48 sm:h-auto">
          <img
            src={room.images?.[0] || "/api/placeholder/400/300"}
            alt={room.roomType}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 p-6">
          <div className="flex flex-col h-full">
            {/* Room Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display text-xl font-semibold text-secondary mb-1">
                    {room.roomType}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Bed" size={16} />
                      <span>{room.bedConfiguration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Users" size={16} />
                      <span>Up to {room.maxOccupancy} guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Square" size={16} />
                      <span>{room.size} sq ft</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {room.amenities?.slice(0, 4).map((amenity, index) => (
                    <Badge key={index} variant="default" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {room.amenities?.length > 4 && (
                    <Badge variant="default" className="text-xs">
                      +{room.amenities.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex items-end justify-between pt-4 border-t border-gray-100">
              <div>
                <div className="text-2xl font-bold gradient-text">
                  {formatPrice(room.basePrice)}
                </div>
                <div className="text-sm text-gray-600">per night</div>
              </div>
              <Button onClick={() => onSelect(room)} size="md">
                Select Room
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default RoomCard