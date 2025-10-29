import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
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

const BookingConfirmation = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  
  const [booking, setBooking] = useState(null)
  const [hotel, setHotel] = useState(null)
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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
      toast.error("Failed to load booking confirmation")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
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
    const checkIn = new Date(booking.checkInDate)
    const checkOut = new Date(booking.checkOutDate)
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
  }

  const handleDownloadReceipt = () => {
    // Simulate receipt download
    toast.success("Receipt downloaded successfully!")
  }

  const handleViewBookings = () => {
    navigate("/bookings")
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadBookingDetails} />
  if (!booking || !hotel || !room) return <Error message="Booking confirmation not found" />

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Check" className="text-white" size={40} />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Your reservation has been successfully confirmed
            </p>
          </div>

          {/* Booking Reference */}
          <Card className="p-6 mb-8 text-center">
            <div className="mb-4">
              <h2 className="font-semibold text-lg text-secondary mb-2">
                Booking Reference
              </h2>
              <div className="text-3xl font-bold gradient-text font-display">
                {booking.bookingReference}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Please save this reference number for your records
              </p>
            </div>
            <Badge variant="success" className="px-4 py-2 text-sm">
              <ApperIcon name="Shield" size={16} className="mr-2" />
              Confirmed & Protected
            </Badge>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Details */}
            <div className="space-y-6">
              {/* Hotel Information */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg text-secondary mb-4">
                  Hotel Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-secondary text-lg">
                      {hotel.name}
                    </h4>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: hotel.starRating }, (_, i) => (
                        <ApperIcon key={i} name="Star" size={14} className="text-accent fill-accent" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {hotel.starRating} Star Hotel
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <ApperIcon name="MapPin" size={18} className="text-primary mt-1" />
                    <div>
                      <div className="font-medium">{hotel.location?.address}</div>
                      <div className="text-gray-600">
                        {hotel.location?.city}, {hotel.location?.state}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <ApperIcon name="Phone" size={18} className="text-primary" />
                    <span className="text-gray-700">{hotel.contactInfo?.phone}</span>
                  </div>
                </div>
              </Card>

              {/* Room Details */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg text-secondary mb-4">
                  Room Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-secondary">{room.roomType}</div>
                    <div className="text-gray-600">{room.bedConfiguration}</div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Users" size={16} />
                      <span>Up to {room.maxOccupancy} guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Square" size={16} />
                      <span>{room.size} sq ft</span>
                    </div>
                  </div>
                  
                  {room.amenities && room.amenities.length > 0 && (
                    <div>
                      <div className="font-medium text-secondary mb-2">Room Amenities:</div>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {room.amenities.length > 3 && (
                          <Badge variant="default" className="text-xs">
                            +{room.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Guest Information */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg text-secondary mb-4">
                  Guest Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="User" size={18} className="text-primary" />
                    <span className="font-medium">{booking.guestDetails?.primaryGuest?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Mail" size={18} className="text-primary" />
                    <span>{booking.guestDetails?.primaryGuest?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Phone" size={18} className="text-primary" />
                    <span>{booking.guestDetails?.primaryGuest?.phone}</span>
                  </div>
                  
                  {booking.specialRequests && (
                    <div className="pt-2 border-t border-gray-100">
                      <div className="font-medium text-secondary mb-1">Special Requests:</div>
                      <p className="text-gray-600 text-sm">{booking.specialRequests}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Stay Summary */}
            <div className="space-y-6">
              {/* Stay Dates */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg text-secondary mb-4">
                  Your Stay
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-secondary">Check-in</div>
                      <div className="text-gray-600">{formatDate(booking.checkInDate)}</div>
                      <div className="text-sm text-gray-500">from {hotel.policies?.checkIn || "3:00 PM"}</div>
                    </div>
                    <div className="text-center px-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <ApperIcon name="Calendar" className="text-primary" size={24} />
                      </div>
                      <div className="text-sm font-medium mt-1">
                        {calculateNights()} {calculateNights() === 1 ? "Night" : "Nights"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-secondary">Check-out</div>
                      <div className="text-gray-600">{formatDate(booking.checkOutDate)}</div>
                      <div className="text-sm text-gray-500">until {hotel.policies?.checkOut || "11:00 AM"}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                      <ApperIcon name="Users" size={18} />
                      <span>
                        {booking.guestCount?.adults || 2} {(booking.guestCount?.adults || 2) === 1 ? "Adult" : "Adults"}
                        {booking.guestCount?.children > 0 && `, ${booking.guestCount.children} ${booking.guestCount.children === 1 ? "Child" : "Children"}`}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment Summary */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg text-secondary mb-4">
                  Payment Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Room rate ({calculateNights()} nights)</span>
                    <span className="font-medium">{formatPrice(booking.totalPrice * 0.85)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & fees</span>
                    <span className="font-medium">{formatPrice(booking.totalPrice * 0.15)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-secondary pt-3 border-t border-gray-200">
                    <span>Total Paid</span>
                    <span className="gradient-text">{formatPrice(booking.totalPrice)}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-success text-sm">
                      <ApperIcon name="CreditCard" size={16} />
                      <span>Payment confirmed</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Next Steps */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg text-secondary mb-4">
                  What&apos;s Next?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div>
                      <div className="font-medium text-secondary">Confirmation Email</div>
                      <div className="text-sm text-gray-600">
                        Check your email for detailed booking information
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div>
                      <div className="font-medium text-secondary">Prepare for Check-in</div>
                      <div className="text-sm text-gray-600">
                        Bring a valid ID and your booking reference
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div>
                      <div className="font-medium text-secondary">Enjoy Your Stay</div>
                      <div className="text-sm text-gray-600">
                        Experience the best hospitality and amenities
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={handleDownloadReceipt}
              className="px-8"
            >
              <ApperIcon name="Download" size={18} className="mr-2" />
              Download Receipt
            </Button>
            <Button
              size="lg"
              onClick={handleViewBookings}
              className="px-8"
            >
              <ApperIcon name="Calendar" size={18} className="mr-2" />
              View My Bookings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation