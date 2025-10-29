import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

export default function RoomCard({ room, onSelect, className = "" }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(price)
  }

  const calculatePricing = () => {
    const base = room.basePrice || 0
    const tax = base * (room.taxRate || 0)
    const fee = room.serviceFee || 0
    const total = base + tax + fee
    return { base, tax, fee, total }
  }

  const pricing = calculatePricing()

  return (
<Card hoverable className={`overflow-hidden p-0 ${className}`}>
      <div className="flex flex-col lg:flex-row">
        {/* Room Image */}
        <div className="w-full lg:w-80 h-64 lg:h-auto relative">
          <img
            src={room.images?.[0] || "/api/placeholder/400/300"}
            alt={room.roomType}
            className="w-full h-full object-cover"
          />
          {room.availableRooms && (
            <div className="absolute top-4 left-4">
              <Badge variant="default" className="bg-white text-secondary shadow-md">
                {room.availableRooms} {room.availableRooms === 1 ? 'room' : 'rooms'} available
              </Badge>
            </div>
          )}
        </div>

        <div className="flex-1 p-6 flex flex-col">
          {/* Room Header */}
          <div className="mb-4">
            <h3 className="font-display text-2xl font-semibold text-secondary mb-2">
              {room.roomType}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <ApperIcon name="Square" size={18} className="text-primary" />
                <span className="font-medium">{room.size} sq ft</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Users" size={18} className="text-primary" />
                <span className="font-medium">Up to {room.maxOccupancy} guests</span>
              </div>
              <div className="flex items-center gap-2">
                <ApperIcon name="Bed" size={18} className="text-primary" />
                <span className="font-medium">{room.bedConfiguration}</span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {room.amenities?.slice(0, 5).map((amenity, index) => (
                <Badge key={index} variant="default" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {amenity}
                </Badge>
              ))}
              {room.amenities?.length > 5 && (
                <Badge variant="default" className="text-xs bg-gray-100 text-gray-700">
                  +{room.amenities.length - 5} more
                </Badge>
              )}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mt-auto">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base price per night</span>
                  <span className="font-medium text-gray-900">{formatPrice(pricing.base)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes ({((room.taxRate || 0) * 100).toFixed(0)}%)</span>
                  <span className="font-medium text-gray-900">{formatPrice(pricing.tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service fees</span>
                  <span className="font-medium text-gray-900">{formatPrice(pricing.fee)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-secondary">Total per night</span>
                    <span className="text-2xl font-bold gradient-text">{formatPrice(pricing.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={() => onSelect(room)} size="lg" className="w-full">
              <ApperIcon name="Calendar" size={18} className="mr-2" />
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
