import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"
import RoomCard from "@/components/molecules/RoomCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { hotelService } from "@/services/api/hotelService"
import { roomService } from "@/services/api/roomService"
import { reviewService } from "@/services/api/reviewService"

const HotelDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hotel, setHotel] = useState(null)
  const [rooms, setRooms] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("rooms")
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    loadHotelDetails()
  }, [id])

  const loadHotelDetails = async () => {
    try {
      setError("")
      setLoading(true)
      
      const [hotelData, roomsData, reviewsData] = await Promise.all([
        hotelService.getById(id),
        roomService.getRoomsByHotelId(id),
        reviewService.getByHotelId(id)
      ])
      
      setHotel(hotelData)
      setRooms(roomsData)
      setReviews(reviewsData)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load hotel details")
    } finally {
      setLoading(false)
    }
  }

  const handleRoomSelect = (room) => {
    navigate(`/book/${hotel.Id}/${room.Id}`)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(price)
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

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadHotelDetails} />
  if (!hotel) return <Error message="Hotel not found" />

  const tabs = [
    { id: "rooms", label: "Rooms", count: rooms.length },
    { id: "amenities", label: "Amenities", count: hotel.amenities?.length || 0 },
    { id: "reviews", label: "Reviews", count: reviews.length },
    { id: "location", label: "Location" }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hotel Images */}
      <section className="relative">
        <div className="h-96 md:h-[500px] relative overflow-hidden">
          <img
            src={hotel.images?.[selectedImageIndex] || "/api/placeholder/1200/600"}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* Image Navigation */}
          {hotel.images?.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImageIndex(prev => 
                  prev === 0 ? hotel.images.length - 1 : prev - 1
                )}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
              >
                <ApperIcon name="ChevronLeft" size={24} className="text-secondary" />
              </button>
              <button
                onClick={() => setSelectedImageIndex(prev => 
                  prev === hotel.images.length - 1 ? 0 : prev + 1
                )}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
              >
                <ApperIcon name="ChevronRight" size={24} className="text-secondary" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          {hotel.images?.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {hotel.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === selectedImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={24} className="text-secondary" />
          </button>
        </div>
      </section>

      {/* Hotel Info */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-1">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-2">
                        {hotel.name}
                      </h1>
                      <div className="flex items-center gap-4 text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <ApperIcon name="MapPin" size={18} />
                          <span>{hotel.location?.address}, {hotel.location?.city}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {renderStars(hotel.starRating)}
                          <span className="text-sm text-gray-600 ml-1">
                            {hotel.starRating} Star Hotel
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-secondary">{hotel.rating}</span>
                          <span className="text-gray-600 text-sm">
                            ({hotel.reviewCount?.toLocaleString()} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-3xl font-bold gradient-text mb-1">
                        {formatPrice(250)}
                      </div>
                      <div className="text-sm text-gray-600">per night</div>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    {hotel.description}
                  </p>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="flex gap-8 overflow-x-auto">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                          activeTab === tab.id
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab.label}
                        {tab.count !== undefined && (
                          <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                            {tab.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="mb-8">
                  {activeTab === "rooms" && (
                    <div className="space-y-6">
                      {rooms.length === 0 ? (
                        <Empty
                          title="No rooms available"
                          description="Please check back later or contact the hotel directly"
                          icon="Bed"
                        />
                      ) : (
                        rooms.map((room) => (
                          <RoomCard
                            key={room.Id}
                            room={room}
                            onSelect={handleRoomSelect}
                          />
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === "amenities" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {hotel.amenities?.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-surface rounded-lg">
                          <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                            <ApperIcon name="Check" className="text-white" size={18} />
                          </div>
                          <span className="font-medium text-secondary">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-6">
                      {reviews.length === 0 ? (
                        <Empty
                          title="No reviews yet"
                          description="Be the first to leave a review for this hotel"
                          icon="MessageCircle"
                        />
                      ) : (
                        reviews.map((review) => (
                          <Card key={review.Id} className="p-6">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">
                                  {review.guestDetails?.name?.[0] || "G"}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-secondary">Guest Review</h4>
                                  <div className="flex items-center gap-1">
                                    {renderStars(review.ratings.overall)}
                                    <span className="text-sm text-gray-600 ml-1">
                                      {review.ratings.overall}/5
                                    </span>
                                  </div>
                                </div>
                                <p className="text-gray-700 mb-3">{review.reviewText}</p>
                                <div className="text-sm text-gray-500">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === "location" && (
                    <Card className="p-6">
                      <h3 className="font-semibold text-lg text-secondary mb-4">Location Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <ApperIcon name="MapPin" size={18} className="text-primary mt-1" />
                          <div>
                            <div className="font-medium text-secondary">{hotel.location?.address}</div>
                            <div className="text-gray-600">{hotel.location?.city}, {hotel.location?.state} {hotel.location?.country}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <ApperIcon name="Phone" size={18} className="text-primary" />
                          <span className="text-gray-700">{hotel.contactInfo?.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <ApperIcon name="Mail" size={18} className="text-primary" />
                          <span className="text-gray-700">{hotel.contactInfo?.email}</span>
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:w-80">
                <Card className="sticky top-24 p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold gradient-text mb-2">
                      {formatPrice(250)}
                    </div>
                    <div className="text-gray-600">per night</div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium">{hotel.policies?.checkIn}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium">{hotel.policies?.checkOut}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Cancellation:</span>
                      <span className="font-medium">{hotel.policies?.cancellation}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => rooms.length > 0 && handleRoomSelect(rooms[0])}
                    size="lg" 
                    className="w-full"
                    disabled={rooms.length === 0}
                  >
                    {rooms.length === 0 ? "No Rooms Available" : "Book Now"}
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HotelDetails