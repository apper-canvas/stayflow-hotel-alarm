import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Input from "@/components/atoms/Input"
import Label from "@/components/atoms/Label"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { hotelService } from "@/services/api/hotelService"
import { roomService } from "@/services/api/roomService"
import { bookingService } from "@/services/api/bookingService"

const BookingFlow = () => {
  const { hotelId, roomId } = useParams()
  const navigate = useNavigate()
  
  const [hotel, setHotel] = useState(null)
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)

  const [bookingData, setBookingData] = useState({
    checkInDate: "",
    checkOutDate: "",
    guestCount: { adults: 2, children: 0 },
    guestDetails: {
      primaryGuest: {
        name: "",
        email: "",
        phone: ""
      }
    },
    specialRequests: "",
    paymentInfo: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
      billingAddress: ""
    }
  })

  useEffect(() => {
    loadBookingData()
  }, [hotelId, roomId])

  const loadBookingData = async () => {
    try {
      setError("")
      setLoading(true)
      
      const [hotelData, roomData] = await Promise.all([
        hotelService.getById(hotelId),
        roomService.getById(roomId)
      ])
      
      setHotel(hotelData)
      setRoom(roomData)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load booking information")
    } finally {
      setLoading(false)
    }
  }

  const updateBookingData = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setBookingData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else if (field === "guestDetails.primaryGuest") {
      setBookingData(prev => ({
        ...prev,
        guestDetails: {
          ...prev.guestDetails,
          primaryGuest: value
        }
      }))
    } else {
      setBookingData(prev => ({ ...prev, [field]: value }))
    }
  }

  const calculateNights = () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate) return 0
    const checkIn = new Date(bookingData.checkInDate)
    const checkOut = new Date(bookingData.checkOutDate)
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
  }

  const calculateTotal = () => {
    const nights = calculateNights()
    const basePrice = room?.basePrice || 0
    const subtotal = basePrice * nights
    const taxes = subtotal * 0.12 // 12% taxes
    const fees = 25 // Service fee
    return {
      subtotal,
      taxes,
      fees,
      total: subtotal + taxes + fees
    }
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return bookingData.checkInDate && bookingData.checkOutDate && calculateNights() > 0
      case 2:
        return bookingData.guestDetails.primaryGuest.name && 
               bookingData.guestDetails.primaryGuest.email && 
               bookingData.guestDetails.primaryGuest.phone
      case 3:
        return bookingData.paymentInfo.cardNumber && 
               bookingData.paymentInfo.expiryDate && 
               bookingData.paymentInfo.cvv && 
               bookingData.paymentInfo.cardholderName
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    } else {
      toast.error("Please fill in all required fields")
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setSubmitting(true)
      
      const booking = await bookingService.create({
        userId: "user1", // Mock user ID
        hotelId: parseInt(hotelId),
        roomId: parseInt(roomId),
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        guestCount: bookingData.guestCount,
        guestDetails: bookingData.guestDetails,
        specialRequests: bookingData.specialRequests,
        totalPrice: calculateTotal().total
      })

      toast.success("Booking confirmed successfully!")
      navigate(`/booking-confirmation/${booking.Id}`)
    } catch (err) {
      toast.error("Failed to complete booking")
    } finally {
      setSubmitting(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2
    }).format(price)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadBookingData} />
  if (!hotel || !room) return <Error message="Booking information not found" />

  const steps = ["Dates & Guests", "Guest Information", "Payment", "Confirmation"]
  const pricing = calculateTotal()

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const stepNumber = index + 1
                const isActive = currentStep === stepNumber
                const isCompleted = currentStep > stepNumber
                
                return (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold ${
                      isCompleted 
                        ? "bg-success text-white border-success" 
                        : isActive 
                          ? "bg-primary text-white border-primary" 
                          : "bg-white text-gray-400 border-gray-300"
                    }`}>
                      {isCompleted ? (
                        <ApperIcon name="Check" size={18} />
                      ) : (
                        stepNumber
                      )}
                    </div>
                    <div className={`ml-2 ${isActive ? "text-primary font-semibold" : "text-gray-600"}`}>
                      <div className="text-sm hidden sm:block">{step}</div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-px bg-gray-300 mx-4 flex-1 ${isCompleted ? "bg-success" : ""}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                {/* Step 1: Dates & Guests */}
                {currentStep === 1 && (
                  <div>
                    <h2 className="font-display text-2xl font-bold text-secondary mb-6">
                      Select Dates & Guests
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Check-in Date</Label>
                          <Input
                            type="date"
                            value={bookingData.checkInDate}
                            onChange={(e) => updateBookingData("checkInDate", e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Check-out Date</Label>
                          <Input
                            type="date"
                            value={bookingData.checkOutDate}
                            onChange={(e) => updateBookingData("checkOutDate", e.target.value)}
                            min={bookingData.checkInDate || new Date().toISOString().split("T")[0]}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Adults</Label>
                          <select
                            value={bookingData.guestCount.adults}
                            onChange={(e) => updateBookingData("guestCount", {
                              ...bookingData.guestCount,
                              adults: parseInt(e.target.value)
                            })}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            {[1, 2, 3, 4, 5, 6].map(num => (
                              <option key={num} value={num}>{num} {num === 1 ? "Adult" : "Adults"}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Children</Label>
                          <select
                            value={bookingData.guestCount.children}
                            onChange={(e) => updateBookingData("guestCount", {
                              ...bookingData.guestCount,
                              children: parseInt(e.target.value)
                            })}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            {[0, 1, 2, 3, 4].map(num => (
                              <option key={num} value={num}>{num} {num === 1 ? "Child" : "Children"}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {calculateNights() > 0 && (
                        <div className="p-4 bg-primary/10 rounded-lg">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">
                              {calculateNights()} {calculateNights() === 1 ? "Night" : "Nights"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {bookingData.checkInDate} to {bookingData.checkOutDate}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Guest Information */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="font-display text-2xl font-bold text-secondary mb-6">
                      Guest Information
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-secondary">Primary Guest</h3>
                        
                        <div className="space-y-2">
                          <Label>Full Name *</Label>
                          <Input
                            value={bookingData.guestDetails.primaryGuest.name}
                            onChange={(e) => updateBookingData("guestDetails.primaryGuest", {
                              ...bookingData.guestDetails.primaryGuest,
                              name: e.target.value
                            })}
                            placeholder="Enter full name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Email Address *</Label>
                          <Input
                            type="email"
                            value={bookingData.guestDetails.primaryGuest.email}
                            onChange={(e) => updateBookingData("guestDetails.primaryGuest", {
                              ...bookingData.guestDetails.primaryGuest,
                              email: e.target.value
                            })}
                            placeholder="Enter email address"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Phone Number *</Label>
                          <Input
                            type="tel"
                            value={bookingData.guestDetails.primaryGuest.phone}
                            onChange={(e) => updateBookingData("guestDetails.primaryGuest", {
                              ...bookingData.guestDetails.primaryGuest,
                              phone: e.target.value
                            })}
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Special Requests (Optional)</Label>
                        <textarea
                          rows="4"
                          value={bookingData.specialRequests}
                          onChange={(e) => updateBookingData("specialRequests", e.target.value)}
                          placeholder="Any special requests or preferences..."
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="font-display text-2xl font-bold text-secondary mb-6">
                      Payment Information
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label>Card Number *</Label>
                        <Input
                          value={bookingData.paymentInfo.cardNumber}
                          onChange={(e) => updateBookingData("paymentInfo.cardNumber", e.target.value)}
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Expiry Date *</Label>
                          <Input
                            value={bookingData.paymentInfo.expiryDate}
                            onChange={(e) => updateBookingData("paymentInfo.expiryDate", e.target.value)}
                            placeholder="MM/YY"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>CVV *</Label>
                          <Input
                            value={bookingData.paymentInfo.cvv}
                            onChange={(e) => updateBookingData("paymentInfo.cvv", e.target.value)}
                            placeholder="123"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Cardholder Name *</Label>
                        <Input
                          value={bookingData.paymentInfo.cardholderName}
                          onChange={(e) => updateBookingData("paymentInfo.cardholderName", e.target.value)}
                          placeholder="Name as it appears on card"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Billing Address</Label>
                        <Input
                          value={bookingData.paymentInfo.billingAddress}
                          onChange={(e) => updateBookingData("paymentInfo.billingAddress", e.target.value)}
                          placeholder="Enter billing address"
                        />
                      </div>

                      <div className="p-4 bg-info/10 rounded-lg">
                        <div className="flex items-center gap-2 text-info">
                          <ApperIcon name="Shield" size={20} />
                          <span className="font-medium">Secure Payment</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Your payment information is encrypted and secure
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    <ApperIcon name="ChevronLeft" size={16} className="mr-2" />
                    Previous
                  </Button>

                  {currentStep < 3 ? (
                    <Button onClick={handleNext} disabled={!validateStep(currentStep)}>
                      Next
                      <ApperIcon name="ChevronRight" size={16} className="ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!validateStep(3) || submitting}
                      className="px-8"
                    >
                      {submitting ? (
                        <>
                          <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="CreditCard" size={16} className="mr-2" />
                          Complete Booking
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            </div>

            {/* Booking Summary */}
            <div>
              <Card className="p-6 sticky top-24">
                <h3 className="font-semibold text-lg text-secondary mb-4">Booking Summary</h3>
                
                {/* Hotel & Room Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="font-medium text-secondary">{hotel.name}</h4>
                    <p className="text-sm text-gray-600">{hotel.location?.city}, {hotel.location?.state}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-secondary">{room.roomType}</h4>
                    <p className="text-sm text-gray-600">{room.bedConfiguration}</p>
                  </div>
                </div>

                {/* Stay Details */}
                {calculateNights() > 0 && (
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium">{bookingData.checkInDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium">{bookingData.checkOutDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Nights:</span>
                      <span className="font-medium">{calculateNights()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Guests:</span>
                      <span className="font-medium">
                        {bookingData.guestCount.adults + bookingData.guestCount.children}
                      </span>
                    </div>
                  </div>
                )}

                {/* Price Breakdown */}
                {calculateNights() > 0 && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {formatPrice(room.basePrice)} × {calculateNights()} nights
                      </span>
                      <span className="font-medium">{formatPrice(pricing.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxes & fees</span>
                      <span className="font-medium">{formatPrice(pricing.taxes + pricing.fees)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-secondary pt-3 border-t border-gray-200">
                      <span>Total</span>
                      <span className="gradient-text">{formatPrice(pricing.total)}</span>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingFlow