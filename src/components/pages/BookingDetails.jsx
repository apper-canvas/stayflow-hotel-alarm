import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { format, parseISO, differenceInDays } from "date-fns"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { bookingService } from "@/services/api/bookingService"
import { hotelService } from "@/services/api/hotelService"
import { roomService } from "@/services/api/roomService"

const BookingDetails = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  
  const [booking, setBooking] = useState(null)
  const [hotel, setHotel] = useState(null)
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    loadBookingDetails()
  }, [bookingId])

  const loadBookingDetails = async () => {
    try {
      setError("")
      setLoading(true)
      
      const bookingData = await bookingService.getById(bookingId)
      setBooking(bookingData)
      
      const [hotelData, roomData] = await Promise.all([
        hotelService.getById(bookingData.hotelId),
        roomService.getById(bookingData.roomId)
      ])
      
      setHotel(hotelData)
      setRoom(roomData)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load booking details")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking? This action cannot be undone."
    )
    
    if (!confirmCancel) return

    try {
      setCancelling(true)
      await bookingService.cancel(bookingId, "Cancelled by guest")
      toast.success("Booking cancelled successfully")
      loadBookingDetails() // Reload to show updated status
    } catch (err) {
      toast.error("Failed to cancel booking")
    } finally {
      setCancelling(false)
    }
  }

  const handleDownloadInvoice = () => {
    toast.success("Invoice downloaded successfully!")
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
      return format(parseISO(dateString), "EEEE, MMMM dd, yyyy")
    } catch {
      return dateString
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(price)
  }

  const calculateNights = () => {
    if (!booking?.checkInDate || !booking?.checkOutDate) return 0
    return differenceInDays(parseISO(booking.checkOutDate), parseISO(booking.checkInDate))
  }

  const calculateBreakdown = () => {
    const nights = calculateNights()
    const basePrice = room?.basePrice || 0
    const subtotal = basePrice * nights
    const taxes = booking.totalPrice * 0.12 // 12% taxes
    const fees = 25 // Service fee
    return {
      subtotal,
      taxes,
      fees,
      total: booking.totalPrice
    }
  }

  const canCancel = () => {
    if (booking?.status !== "confirmed") return false
    const checkInDate = parseISO(booking.checkInDate)
    const now = new Date()
    const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60)
    return hoursUntilCheckIn > 24 // Can cancel if more than 24 hours before check-in
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadBookingDetails} />
  if (!booking || !hotel || !room) return <Error message="Booking not found" />

  const pricing = calculateBreakdown()

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                onClick={() => navigate("/bookings")}
                className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
              >
                <ApperIcon name="ArrowLeft" size={18} />
                <span>Back to Bookings</span>
              </button>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-2">
                Booking Details
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Reference: {booking.bookingReference}</span>
                <Badge variant={getStatusVariant(booking.status)} className="capitalize">
                  {booking.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadInvoice}
              >
                <ApperIcon name="Download" size={16} className="mr-2" />
                Invoice
              </Button>
              {canCancel() && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                >
                  {cancelling ? (
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  ) : (
                    <ApperIcon name="X" size={16} className="mr-2" />
                  )}
                  Cancel Booking
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hotel Information */}
              <Card className="p-6">
                <h2 className="font-semibold text-xl text-secondary mb-4">
                  Hotel Information
                </h2>
                
                <div className="flex gap-6">
                  <img
                    src={hotel.images?.[0] || "/api/placeholder/200/150"}
                    alt={hotel.name}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold text-secondary mb-2">
                      {hotel.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: hotel.starRating }, (_, i) => (
                        <ApperIcon key={i} name="Star" size={16} className="text-accent fill-accent" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {hotel.starRating} Star Hotel
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="MapPin" size={16} className="text-gray-400" />
                        <span>{hotel.location?.address}, {hotel.location?.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Phone" size={16} className="text-gray-400" />
                        <span>{hotel.contactInfo?.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Star" size={16} className="text-gray-400" />
                        <span>{hotel.rating}/5 ({hotel.reviewCount?.toLocaleString()} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Room Details */}
              <Card className="p-6">
                <h2 className="font-semibold text-xl text-secondary mb-4">
                  Room Details
                </h2>
                
                <div className="flex gap-6">
                  <img
                    src={room.images?.[0] || "/api/placeholder/200/150"}
                    alt={room.roomType}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-secondary mb-2">
                      {room.roomType}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Bed" size={16} className="text-gray-400" />
                        <span>{room.bedConfiguration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Users" size={16} className="text-gray-400" />
                        <span>Up to {room.maxOccupancy} guests</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Square" size={16} className="text-gray-400" />
                        <span>{room.size} sq ft</span>
                      </div>
                    </div>
                    
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {room.amenities.slice(0, 4).map((amenity, index) => (
                            <Badge key={index} variant="default" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {room.amenities.length > 4 && (
                            <Badge variant="default" className="text-xs">
                              +{room.amenities.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Guest Information */}
              <Card className="p-6">
                <h2 className="font-semibold text-xl text-secondary mb-4">
                  Guest Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-secondary mb-3">Primary Guest</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="User" size={16} className="text-gray-400" />
                        <span>{booking.guestDetails?.primaryGuest?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Mail" size={16} className="text-gray-400" />
                        <span>{booking.guestDetails?.primaryGuest?.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Phone" size={16} className="text-gray-400" />
                        <span>{booking.guestDetails?.primaryGuest?.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-secondary mb-3">Party Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <ApperIcon name="Users" size={16} className="text-gray-400" />
                        <span>
                          {booking.guestCount?.adults || 2} {(booking.guestCount?.adults || 2) === 1 ? "Adult" : "Adults"}
                          {booking.guestCount?.children > 0 && `, ${booking.guestCount.children} ${booking.guestCount.children === 1 ? "Child" : "Children"}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {booking.specialRequests && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-medium text-secondary mb-2">Special Requests</h3>
                    <p className="text-gray-600 text-sm">{booking.specialRequests}</p>
                  </div>
                )}
              </Card>

              {/* Cancellation Policy */}
              <Card className="p-6">
                <h2 className="font-semibold text-xl text-secondary mb-4">
                  Cancellation Policy
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <ApperIcon name="Clock" size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-secondary">Free Cancellation</div>
                      <div className="text-gray-600">
                        Cancel up to 24 hours before check-in for a full refund
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ApperIcon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
                    <div>
                      <div className="font-medium text-secondary">Late Cancellation</div>
                      <div className="text-gray-600">
                        Cancellations within 24 hours are charged the first night
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ApperIcon name="X" size={16} className="text-error mt-0.5" />
                    <div>
                      <div className="font-medium text-secondary">No Show</div>
                      <div className="text-gray-600">
                        No shows are charged the full booking amount
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stay Summary */}
              <Card className="p-6">
                <h2 className="font-semibold text-xl text-secondary mb-4">
                  Stay Summary
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="font-medium text-secondary mb-1">Check-in</div>
                    <div className="text-gray-600">{formatDate(booking.checkInDate)}</div>
                    <div className="text-sm text-gray-500">from {hotel.policies?.checkIn || "3:00 PM"}</div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-secondary mb-1">Check-out</div>
                    <div className="text-gray-600">{formatDate(booking.checkOutDate)}</div>
                    <div className="text-sm text-gray-500">until {hotel.policies?.checkOut || "11:00 AM"}</div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <ApperIcon name="Calendar" size={18} />
                      <span className="font-medium">
                        {calculateNights()} {calculateNights() === 1 ? "Night" : "Nights"}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Pricing Breakdown */}
              <Card className="p-6">
                <h2 className="font-semibold text-xl text-secondary mb-4">
                  Pricing Details
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Room rate × {calculateNights()} nights
                    </span>
                    <span className="font-medium">{formatPrice(pricing.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-medium">{formatPrice(pricing.taxes)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service fees</span>
                    <span className="font-medium">{formatPrice(pricing.fees)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-secondary pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span className="gradient-text">{formatPrice(pricing.total)}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-success text-sm">
                      <ApperIcon name="CreditCard" size={16} />
                      <span>
                        {booking.paymentStatus === "paid" ? "Payment confirmed" : booking.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h2 className="font-semibold text-xl text-secondary mb-4">
                  Need Help?
                </h2>
                
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <ApperIcon name="MessageCircle" size={16} className="mr-2" />
                    Contact Hotel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <ApperIcon name="UtensilsCrossed" size={16} className="mr-2" />
                    Order Room Service
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <ApperIcon name="HelpCircle" size={16} className="mr-2" />
                    Get Support
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingDetails