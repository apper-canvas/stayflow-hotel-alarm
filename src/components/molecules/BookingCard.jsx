import React from "react"
import { useNavigate } from "react-router-dom"
import { format, parseISO, differenceInDays } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"

const BookingCard = ({ booking, onCancel, className = "" }) => {
  const navigate = useNavigate()

  const handleViewDetails = () => {
    navigate(`/booking/${booking.Id}`)
  }

  const handleCancelBooking = () => {
    if (onCancel) {
      onCancel(booking.Id)
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "confirmed":
        return "success"
      case "cancelled":
        return "error"
      case "pending":
        return "warning"
      default:
        return "default"
    }
  }

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy")
    } catch {
      return dateString
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(price)
  }

  const nights = differenceInDays(parseISO(booking.checkOutDate), parseISO(booking.checkInDate))

  return (
    <Card hoverable className={`p-0 overflow-hidden ${className}`}>
      <div className="flex flex-col sm:flex-row">
        {/* Hotel Image */}
        <div className="w-full sm:w-48 h-32 sm:h-auto">
          <img
            src="/api/placeholder/300/200"
            alt="Hotel"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            {/* Booking Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-display text-lg font-semibold text-secondary">
                  Booking #{booking.bookingReference}
                </h3>
                <Badge variant={getStatusVariant(booking.status)} className="capitalize">
                  {booking.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Calendar" size={16} />
                  <span>
                    {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)} ({nights} {nights === 1 ? "night" : "nights"})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Users" size={16} />
                  <span>
                    {booking.guestCount?.adults} {booking.guestCount?.adults === 1 ? "Adult" : "Adults"}
                    {booking.guestCount?.children > 0 && `, ${booking.guestCount.children} ${booking.guestCount.children === 1 ? "Child" : "Children"}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Bed" size={16} />
                  <span>Room Type: Standard</span>
                </div>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="text-right sm:min-w-[160px]">
              <div className="mb-4">
                <div className="text-2xl font-bold gradient-text">
                  {formatPrice(booking.totalPrice)}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleViewDetails}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  <ApperIcon name="Eye" size={16} className="mr-2" />
                  View Details
                </Button>
                {booking.status === "confirmed" && (
                  <Button
                    onClick={handleCancelBooking}
                    size="sm"
                    variant="ghost"
                    className="w-full text-error hover:bg-error/10"
                  >
                    <ApperIcon name="X" size={16} className="mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default BookingCard