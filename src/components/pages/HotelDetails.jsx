import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { hotelService } from "@/services/api/hotelService";
import { roomService } from "@/services/api/roomService";
import { reviewService } from "@/services/api/reviewService";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import RoomCard from "@/components/molecules/RoomCard";
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
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0)
  const [virtualTourOpen, setVirtualTourOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return
      
      if (e.key === "Escape") {
        setIsLightboxOpen(false)
      } else if (e.key === "ArrowLeft") {
        handlePreviousLightboxImage()
      } else if (e.key === "ArrowRight") {
        handleNextLightboxImage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isLightboxOpen, lightboxImageIndex, hotel?.images])
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

const handleOpenLightbox = (index) => {
    setLightboxImageIndex(index)
    setIsLightboxOpen(true)
  }

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false)
  }

  const handleNextLightboxImage = () => {
    if (hotel?.images && lightboxImageIndex < hotel.images.length - 1) {
      setLightboxImageIndex(prev => prev + 1)
    } else if (hotel?.images) {
      setLightboxImageIndex(0)
    }
  }

  const handlePreviousLightboxImage = () => {
    if (lightboxImageIndex > 0) {
      setLightboxImageIndex(prev => prev - 1)
    } else if (hotel?.images) {
      setLightboxImageIndex(hotel.images.length - 1)
    }
  }

  const handleOpenVirtualTour = () => {
    if (hotel?.virtualTourUrl) {
      setVirtualTourOpen(true)
    } else {
      toast.info("Virtual tour coming soon for this property")
    }
  }

const getCategorizedAmenitiesCount = () => {
    if (!hotel.categorizedAmenities) return hotel.amenities?.length || 0
    const categories = hotel.categorizedAmenities
    return Object.values(categories).reduce((total, items) => total + (items?.length || 0), 0)
  }

  const tabs = [
    { id: "rooms", label: "Rooms", count: rooms.length },
    { id: "amenities", label: "Amenities", count: getCategorizedAmenitiesCount() },
    { id: "reviews", label: "Reviews", count: reviews.length },
    { id: "location", label: "Location" }
  ]

  return (
    <div className="min-h-screen bg-background">
{/* Hotel Images Gallery */}
      <section className="relative">
        <div className="relative">
          {/* Main Featured Image */}
          <div className="h-96 md:h-[500px] relative overflow-hidden cursor-pointer" onClick={() => handleOpenLightbox(selectedImageIndex)}>
            <img
              src={hotel.images?.[selectedImageIndex] || "/api/placeholder/1200/600"}
              alt={hotel.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            {/* View All Photos Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleOpenLightbox(0)
              }}
              className="absolute bottom-6 right-6 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-lg flex items-center gap-2 hover:bg-white transition-colors shadow-lg"
            >
              <ApperIcon name="Images" size={20} className="text-secondary" />
              <span className="font-medium text-secondary">View All {hotel.images?.length || 0} Photos</span>
            </button>

            {/* Virtual Tour Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleOpenVirtualTour()
              }}
              className="absolute bottom-6 left-6 px-6 py-3 bg-primary/90 backdrop-blur-sm rounded-lg flex items-center gap-2 hover:bg-primary transition-colors shadow-lg text-white"
            >
              <ApperIcon name="Video" size={20} />
              <span className="font-medium">Virtual Tour</span>
            </button>

            {/* Image Navigation */}
            {hotel.images?.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImageIndex(prev => prev === 0 ? hotel.images.length - 1 : prev - 1)
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
                >
                  <ApperIcon name="ChevronLeft" size={24} className="text-secondary" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedImageIndex(prev => prev === hotel.images.length - 1 ? 0 : prev + 1)
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
                >
                  <ApperIcon name="ChevronRight" size={24} className="text-secondary" />
                </button>
              </>
            )}

            {/* Back Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(-1)
              }}
              className="absolute top-6 left-6 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/90 transition-colors"
            >
              <ApperIcon name="ArrowLeft" size={24} className="text-secondary" />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {hotel.images?.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-lg">
              {hotel.images.slice(0, 5).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex ? "border-white scale-110" : "border-white/30 hover:border-white/60"
                  }`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              {hotel.images.length > 5 && (
                <button
                  onClick={() => handleOpenLightbox(5)}
                  className="w-16 h-16 rounded-md overflow-hidden border-2 border-white/30 hover:border-white/60 bg-black/50 flex items-center justify-center text-white text-sm font-medium"
                >
                  +{hotel.images.length - 5}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={handleCloseLightbox}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors z-10"
            >
              <ApperIcon name="X" size={24} className="text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white font-medium z-10">
              {lightboxImageIndex + 1} / {hotel.images?.length || 0}
            </div>

            {/* Main Image */}
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={hotel.images?.[lightboxImageIndex] || "/api/placeholder/1200/800"}
                alt={`${hotel.name} - Image ${lightboxImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>

            {/* Navigation Buttons */}
            {hotel.images?.length > 1 && (
              <>
                <button
                  onClick={handlePreviousLightboxImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                >
                  <ApperIcon name="ChevronLeft" size={28} className="text-white" />
                </button>
                <button
                  onClick={handleNextLightboxImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors"
                >
                  <ApperIcon name="ChevronRight" size={28} className="text-white" />
                </button>
              </>
            )}

            {/* Thumbnail Navigation */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg max-w-2xl overflow-x-auto scrollbar-hide">
              {hotel.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setLightboxImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                    index === lightboxImageIndex ? "border-white scale-110" : "border-white/30 hover:border-white/60"
                  }`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Keyboard Hint */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              Press ESC to close • Use arrow keys to navigate
            </div>
          </div>
        )}

        {/* Virtual Tour Modal */}
        {virtualTourOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
            <button
              onClick={() => setVirtualTourOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors z-10"
            >
              <ApperIcon name="X" size={24} className="text-white" />
            </button>

            <div className="w-full max-w-6xl h-[80vh] bg-white rounded-lg overflow-hidden mx-4">
              {hotel?.virtualTourUrl ? (
                <iframe
                  src={hotel.virtualTourUrl}
                  className="w-full h-full"
                  title="Virtual Tour"
                  allowFullScreen
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <ApperIcon name="Video" size={64} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Virtual tour coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
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
                    <span className="font-medium">{hotel.location?.address}, {hotel.location?.city}, {hotel.location?.state}</span>
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
                        <>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                              <ApperIcon name="Info" size={20} className="text-blue-600 mt-0.5" />
                              <div>
                                <h4 className="font-semibold text-blue-900 mb-1">Room Availability</h4>
                                <p className="text-sm text-blue-700">
                                  Showing {rooms.length} room {rooms.length === 1 ? 'type' : 'types'} available for your selected dates. 
                                  Prices include all taxes and fees.
                                </p>
                              </div>
                            </div>
                          </div>
                          {rooms.map((room) => (
                            <RoomCard
                              key={room.Id}
                              room={room}
                              onSelect={handleRoomSelect}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  )}

{activeTab === "amenities" && (
                    <div className="space-y-8">
                      {hotel.categorizedAmenities ? (
                        <>
                          {/* Room Amenities */}
                          {hotel.categorizedAmenities.roomAmenities?.length > 0 && (
                            <div>
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                                  <ApperIcon name="Bed" className="text-white" size={22} />
                                </div>
                                <h3 className="font-display text-xl font-semibold text-secondary">Room Amenities</h3>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {hotel.categorizedAmenities.roomAmenities.map((amenity, index) => (
                                  <div key={index} className="flex items-center gap-3 p-4 bg-surface rounded-lg border border-gray-100 hover:border-primary transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <span className="font-medium text-secondary">{amenity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Bathroom Amenities */}
                          {hotel.categorizedAmenities.bathroomAmenities?.length > 0 && (
                            <div>
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                                  <ApperIcon name="Bath" className="text-white" size={22} />
                                </div>
                                <h3 className="font-display text-xl font-semibold text-secondary">Bathroom Amenities</h3>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {hotel.categorizedAmenities.bathroomAmenities.map((amenity, index) => (
                                  <div key={index} className="flex items-center gap-3 p-4 bg-surface rounded-lg border border-gray-100 hover:border-primary transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <span className="font-medium text-secondary">{amenity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Hotel Facilities */}
                          {hotel.categorizedAmenities.hotelFacilities?.length > 0 && (
                            <div>
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                                  <ApperIcon name="Building2" className="text-white" size={22} />
                                </div>
                                <h3 className="font-display text-xl font-semibold text-secondary">Hotel Facilities</h3>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {hotel.categorizedAmenities.hotelFacilities.map((amenity, index) => (
                                  <div key={index} className="flex items-center gap-3 p-4 bg-surface rounded-lg border border-gray-100 hover:border-primary transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <span className="font-medium text-secondary">{amenity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Services */}
                          {hotel.categorizedAmenities.services?.length > 0 && (
                            <div>
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                                  <ApperIcon name="Concierge" className="text-white" size={22} />
                                </div>
                                <h3 className="font-display text-xl font-semibold text-secondary">Services</h3>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {hotel.categorizedAmenities.services.map((amenity, index) => (
                                  <div key={index} className="flex items-center gap-3 p-4 bg-surface rounded-lg border border-gray-100 hover:border-primary transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    <span className="font-medium text-secondary">{amenity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {hotel.amenities?.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-3 p-4 bg-surface rounded-lg border border-gray-100">
                              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                                <ApperIcon name="Check" className="text-white" size={18} />
                              </div>
                              <span className="font-medium text-secondary">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      )}
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
                    <div className="space-y-6">
                      <Card className="p-6">
                        <h3 className="font-semibold text-lg text-secondary mb-4">Location & Contact</h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <ApperIcon name="MapPin" size={20} className="text-primary mt-1 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-secondary">{hotel.location?.address}</div>
                              <div className="text-gray-600">{hotel.location?.city}, {hotel.location?.state} {hotel.location?.zipCode}</div>
                              <div className="text-gray-600">{hotel.location?.country}</div>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t space-y-3">
                            <div className="flex items-center gap-3">
                              <ApperIcon name="Phone" size={20} className="text-primary flex-shrink-0" />
                              <a href={`tel:${hotel.contactInfo?.phone}`} className="text-secondary hover:text-primary transition-colors font-medium">
                                {hotel.contactInfo?.phone}
                              </a>
                            </div>
                            <div className="flex items-center gap-3">
                              <ApperIcon name="Mail" size={20} className="text-primary flex-shrink-0" />
                              <a href={`mailto:${hotel.contactInfo?.email}`} className="text-secondary hover:text-primary transition-colors font-medium">
                                {hotel.contactInfo?.email}
                              </a>
                            </div>
                            {hotel.contactInfo?.website && (
                              <div className="flex items-center gap-3">
                                <ApperIcon name="Globe" size={20} className="text-primary flex-shrink-0" />
                                <a 
                                  href={hotel.contactInfo.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-secondary hover:text-primary transition-colors font-medium"
                                >
                                  Visit Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>

                      <Card className="p-0 overflow-hidden">
                        <div className="bg-secondary text-white px-6 py-4">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <ApperIcon name="MapPin" size={20} />
                            Map Location
                          </h3>
                        </div>
                        <div className="relative w-full h-96">
                          {hotel.location?.coordinates?.lat && hotel.location?.coordinates?.lng ? (
                            <iframe
                              title="Hotel Location Map"
                              src={`https://maps.google.com/maps?q=${hotel.location.coordinates.lat},${hotel.location.coordinates.lng}&z=15&output=embed`}
                              className="w-full h-full border-0"
                              loading="lazy"
                              allowFullScreen
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <div className="text-center">
                                <ApperIcon name="MapPin" size={48} className="text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">Map location not available</p>
                                <p className="text-sm text-gray-500 mt-1">{hotel.location?.address}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  )}
                </div>
              </div>

{/* Sidebar */}
              <div className="lg:w-80 space-y-6">
                {/* Pricing Card */}
                <Card className="sticky top-24 p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold gradient-text mb-2">
                      {formatPrice(250)}
                    </div>
                    <div className="text-gray-600">per night</div>
                  </div>

                  <div className="space-y-4 mb-6 pb-6 border-b">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <ApperIcon name="Clock" size={16} />
                        Check-in:
                      </span>
                      <span className="font-semibold text-secondary">{hotel.policies?.checkIn}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 flex items-center gap-2">
                        <ApperIcon name="Clock" size={16} />
                        Check-out:
                      </span>
                      <span className="font-semibold text-secondary">{hotel.policies?.checkOut}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="text-sm font-medium text-secondary">Cancellation Policy</div>
                    <div className="text-sm text-gray-600">{hotel.policies?.cancellation}</div>
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

                {/* Contact Information Card */}
                <Card className="p-6">
                  <h3 className="font-semibold text-lg text-secondary mb-4 flex items-center gap-2">
                    <ApperIcon name="Phone" size={20} />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <a 
                      href={`tel:${hotel.contactInfo?.phone}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <ApperIcon name="Phone" size={18} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500">Phone</div>
                        <div className="font-medium text-secondary">{hotel.contactInfo?.phone}</div>
                      </div>
                    </a>

                    <a 
                      href={`mailto:${hotel.contactInfo?.email}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <ApperIcon name="Mail" size={18} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-gray-500">Email</div>
                        <div className="font-medium text-secondary break-all">{hotel.contactInfo?.email}</div>
                      </div>
                    </a>

                    {hotel.contactInfo?.website && (
                      <a 
                        href={hotel.contactInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <ApperIcon name="Globe" size={18} className="text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs text-gray-500">Website</div>
                          <div className="font-medium text-secondary">Visit Website</div>
                        </div>
                        <ApperIcon name="ExternalLink" size={16} className="text-gray-400" />
                      </a>
)}
                  </div>
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