import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import SearchBar from "@/components/molecules/SearchBar"
import HotelCard from "@/components/molecules/HotelCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { hotelService } from "@/services/api/hotelService"

const Home = () => {
  const navigate = useNavigate()
  const [featuredHotels, setFeaturedHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadFeaturedHotels()
  }, [])

  const loadFeaturedHotels = async () => {
    try {
      setError("")
      setLoading(true)
      const hotels = await hotelService.getAll()
      // Get top-rated featured hotels
      const featured = hotels
        .filter(hotel => hotel.rating >= 4.5)
        .slice(0, 6)
      setFeaturedHotels(featured)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load featured hotels")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchCriteria) => {
    // Navigate to search results with criteria
    const searchParams = new URLSearchParams({
      destination: searchCriteria.destination,
      checkIn: searchCriteria.checkIn,
      checkOut: searchCriteria.checkOut,
      adults: searchCriteria.guests.adults.toString(),
      children: searchCriteria.guests.children.toString()
    })
    navigate(`/search?${searchParams.toString()}`)
  }

  const destinations = [
    {
      name: "New York",
      image: "/api/placeholder/400/300",
      hotels: "245+ Hotels",
      description: "The city that never sleeps"
    },
    {
      name: "Miami",
      image: "/api/placeholder/400/300",
      hotels: "128+ Hotels",
      description: "Sun, sand and sophistication"
    },
    {
      name: "San Francisco",
      image: "/api/placeholder/400/300",
      hotels: "187+ Hotels",
      description: "Golden Gate and great stays"
    },
    {
      name: "Los Angeles",
      image: "/api/placeholder/400/300",
      hotels: "312+ Hotels",
      description: "Hollywood glamour awaits"
    }
  ]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadFeaturedHotels} />

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary via-secondary/90 to-primary/20 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Your Perfect
              <span className="block gradient-text text-white bg-clip-text bg-gradient-to-r from-accent to-primary">
                Hotel Experience
              </span>
            </h1>
            <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto">
              From luxury resorts to boutique hotels, find and book exceptional stays 
              with exclusive rewards and seamless service.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative -mt-12 z-10">
        <div className="container mx-auto px-4">
          <SearchBar onSearch={handleSearch} className="max-w-6xl mx-auto" />
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
              Popular Destinations
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our most loved destinations and discover amazing hotels waiting for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <Card
                key={index}
                hoverable
                className="p-0 overflow-hidden cursor-pointer"
                onClick={() => handleSearch({ 
                  destination: destination.name, 
                  checkIn: "", 
                  checkOut: "", 
                  guests: { adults: 2, children: 0 } 
                })}
              >
                <div className="relative h-48">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-display text-xl font-semibold mb-1">
                      {destination.name}
                    </h3>
                    <p className="text-sm opacity-90">{destination.description}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{destination.hotels}</span>
                    <ApperIcon name="ArrowRight" size={16} className="text-primary" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
                Featured Hotels
              </h2>
              <p className="text-gray-600 text-lg">
                Handpicked premium hotels with exceptional ratings and reviews
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/search")}
              className="hidden md:inline-flex"
            >
              View All Hotels
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>

          {featuredHotels.length === 0 ? (
            <Empty
              title="No featured hotels available"
              description="Check back later for our handpicked hotel recommendations"
              icon="Hotel"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredHotels.map((hotel) => (
                <HotelCard key={hotel.Id} hotel={hotel} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Button
              variant="outline"
              onClick={() => navigate("/search")}
            >
              View All Hotels
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose StayFlow */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-4">
              Why Choose StayFlow?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience the difference with our premium booking platform designed for modern travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Shield" className="text-white" size={32} />
              </div>
              <h3 className="font-display text-xl font-semibold text-secondary mb-3">
                Secure Booking
              </h3>
              <p className="text-gray-600">
                Your bookings are protected with industry-leading security and instant confirmation
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Gift" className="text-white" size={32} />
              </div>
              <h3 className="font-display text-xl font-semibold text-secondary mb-3">
                Loyalty Rewards
              </h3>
              <p className="text-gray-600">
                Earn points on every booking and unlock exclusive benefits as you travel more
              </p>
            </Card>

            <Card className="text-center p-8">
              <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="HeartHandshake" className="text-white" size={32} />
              </div>
              <h3 className="font-display text-xl font-semibold text-secondary mb-3">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Our dedicated support team is always here to help make your stay perfect
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home