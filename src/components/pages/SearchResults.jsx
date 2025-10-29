import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import HotelCard from "@/components/molecules/HotelCard"
import FilterSidebar from "@/components/molecules/FilterSidebar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { hotelService } from "@/services/api/hotelService"

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [hotels, setHotels] = useState([])
  const [filteredHotels, setFilteredHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [showFilters, setShowFilters] = useState(false)

  // Get search criteria from URL params
  const searchCriteria = {
    destination: searchParams.get("destination") || "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    adults: parseInt(searchParams.get("adults")) || 2,
    children: parseInt(searchParams.get("children")) || 0
  }

  useEffect(() => {
    if (searchCriteria.destination) {
      searchHotels()
    }
  }, [searchParams])

  useEffect(() => {
    applySorting()
  }, [sortBy, hotels])

  const searchHotels = async () => {
    try {
      setError("")
      setLoading(true)
      
      const results = await hotelService.searchHotels({
        city: searchCriteria.destination,
        minRating: 0,
        starRating: [],
        amenities: []
      })
      
      setHotels(results)
      setFilteredHotels(results)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to search hotels")
    } finally {
      setLoading(false)
    }
  }

  const handleNewSearch = (newCriteria) => {
    const params = new URLSearchParams({
      destination: newCriteria.destination,
      checkIn: newCriteria.checkIn,
      checkOut: newCriteria.checkOut,
      adults: newCriteria.guests.adults.toString(),
      children: newCriteria.guests.children.toString()
    })
    setSearchParams(params)
  }

  const handleFiltersChange = (filters) => {
    let filtered = [...hotels]

    // Apply price filter
    if (filters.priceRange[1] < 1000) {
      filtered = filtered.filter(hotel => 250 <= filters.priceRange[1]) // Using estimated price
    }

    // Apply star rating filter
    if (filters.starRating.length > 0) {
      filtered = filtered.filter(hotel => filters.starRating.includes(hotel.starRating))
    }

    // Apply amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(hotel =>
        filters.amenities.every(amenity => hotel.amenities.includes(amenity))
      )
    }

    // Apply guest rating filter
    if (filters.guestRating > 0) {
      filtered = filtered.filter(hotel => hotel.rating >= filters.guestRating)
    }

    setFilteredHotels(filtered)
  }

  const applySorting = () => {
    let sorted = [...filteredHotels]

    switch (sortBy) {
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case "price-low":
        sorted.sort((a, b) => 250 - 350) // Using estimated prices
        break
      case "price-high":
        sorted.sort((a, b) => 350 - 250)
        break
      case "stars":
        sorted.sort((a, b) => b.starRating - a.starRating)
        break
      default:
        break
    }

    setFilteredHotels(sorted)
  }

  const formatSearchSummary = () => {
    if (!searchCriteria.destination) return ""
    
    const totalGuests = searchCriteria.adults + searchCriteria.children
    const dates = searchCriteria.checkIn && searchCriteria.checkOut 
      ? `${searchCriteria.checkIn} - ${searchCriteria.checkOut}`
      : "Flexible dates"
    
    return `${filteredHotels.length} hotels in ${searchCriteria.destination} • ${dates} • ${totalGuests} ${totalGuests === 1 ? "guest" : "guests"}`
  }

  if (loading) return <Loading />

  return (
    <div className="min-h-screen bg-background">
      {/* Search Bar */}
      <section className="bg-surface border-b border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <SearchBar 
            onSearch={handleNewSearch}
            className="max-w-6xl mx-auto"
          />
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {error ? (
          <Error message={error} onRetry={searchHotels} />
        ) : (
          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar onFiltersChange={handleFiltersChange} />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-secondary mb-2">
                    {searchCriteria.destination ? `Hotels in ${searchCriteria.destination}` : "Search Results"}
                  </h1>
                  {searchCriteria.destination && (
                    <p className="text-gray-600">{formatSearchSummary()}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile Filter Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden"
                  >
                    <ApperIcon name="Filter" size={16} className="mr-2" />
                    Filters
                  </Button>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="rating">Best Rating</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="stars">Star Rating</option>
                  </select>
                </div>
              </div>

              {/* Results */}
              {filteredHotels.length === 0 ? (
                <Empty
                  title="No hotels found"
                  description="Try adjusting your search criteria or filters to find more options"
                  icon="SearchX"
                  actionLabel="Clear Filters"
                  onAction={() => window.location.reload()}
                />
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredHotels.map((hotel) => (
                    <HotelCard key={hotel.Id} hotel={hotel} />
                  ))}
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-surface overflow-y-auto">
            <div className="sticky top-0 bg-surface border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="font-semibold text-lg">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
            <div className="p-4">
              <FilterSidebar onFiltersChange={handleFiltersChange} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchResults