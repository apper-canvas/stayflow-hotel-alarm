import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { hotelService } from "@/services/api/hotelService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import HotelCard from "@/components/molecules/HotelCard";
import SearchBar from "@/components/molecules/SearchBar";
import FilterSidebar from "@/components/molecules/FilterSidebar";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [hotels, setHotels] = useState([])
  const [filteredHotels, setFilteredHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sortBy, setSortBy] = useState("recommended")
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("hotelFavorites")
    return saved ? JSON.parse(saved) : []
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

// Get search criteria from URL params
  const searchCriteria = {
    destination: searchParams.get("destination") || "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    adults: parseInt(searchParams.get("adults")) || 2,
    children: parseInt(searchParams.get("children")) || 0
  }

useEffect(() => {
    // Validate search criteria before executing search
    if (searchCriteria.destination && searchCriteria.destination.trim().length > 0) {
      searchHotels()
    } else if (searchParams.get('destination')) {
      // If URL has destination but criteria doesn't, trigger search
      searchHotels()
    }
  }, [searchParams])

  useEffect(() => {
applySorting()
  }, [sortBy, hotels])

  useEffect(() => {
    localStorage.setItem("hotelFavorites", JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    setCurrentPage(1)
  }, [filteredHotels, itemsPerPage])

  const toggleFavorite = (hotelId) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(hotelId)
      if (isFavorite) {
        toast.info("Removed from favorites")
        return prev.filter(id => id !== hotelId)
      } else {
        toast.success("Added to favorites")
        return [...prev, hotelId]
      }
    })
  }

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedHotels = filteredHotels.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
      
// Set results even if empty - let Empty component handle display
      setHotels(results)
      setFilteredHotels(results)
      setLoading(false)
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
      case "recommended":
        sorted.sort((a, b) => {
          const scoreA = (a.rating * 0.4) + (a.starRating * 0.3) + ((5 - a.distanceFromCenter) * 0.3)
          const scoreB = (b.rating * 0.4) + (b.starRating * 0.3) + ((5 - b.distanceFromCenter) * 0.3)
          return scoreB - scoreA
        })
        break
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case "price-low":
        sorted.sort((a, b) => a.pricePerNight - b.pricePerNight)
        break
      case "price-high":
        sorted.sort((a, b) => b.pricePerNight - a.pricePerNight)
        break
      case "stars":
        sorted.sort((a, b) => b.starRating - a.starRating)
        break
      default:
        break
    }

    setFilteredHotels(sorted)
  }

  const SkeletonCard = () => (
    <Card className="overflow-hidden animate-pulse">
      <div className="relative h-48 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded w-16" />
          <div className="h-6 bg-gray-200 rounded w-16" />
          <div className="h-6 bg-gray-200 rounded w-16" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-8 bg-gray-200 rounded w-24" />
          <div className="h-10 bg-gray-200 rounded w-28" />
        </div>
      </div>
    </Card>
  )

  const MapView = () => (
    <Card className="h-[600px] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <ApperIcon name="MapPin" size={48} className="mx-auto text-primary" />
          <div>
            <h3 className="text-xl font-semibold text-secondary mb-2">Interactive Map View</h3>
            <p className="text-gray-600 max-w-md">
              Map integration with price markers will be displayed here. Hotels will appear as pins with prices.
            </p>
          </div>
          <Button onClick={() => setShowMap(false)} variant="outline">
            <ApperIcon name="Grid" size={16} className="mr-2" />
            Back to Grid View
          </Button>
        </div>
      </div>
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
        <h4 className="font-semibold text-secondary mb-3">Hotels on Map</h4>
        <div className="space-y-2">
          {filteredHotels.slice(0, 5).map((hotel) => (
            <div key={hotel.Id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <img src={hotel.images[0]} alt="" className="w-12 h-12 rounded object-cover" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-secondary truncate">{hotel.name}</div>
                <div className="text-xs text-primary font-semibold">${hotel.pricePerNight}/night</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )

  const formatSearchSummary = () => {
    if (!searchCriteria.destination) return ""
    
    const totalGuests = searchCriteria.adults + searchCriteria.children
    const dates = searchCriteria.checkIn && searchCriteria.checkOut 
      ? `${searchCriteria.checkIn} - ${searchCriteria.checkOut}`
      : "Flexible dates"
    
    return `${filteredHotels.length} hotels in ${searchCriteria.destination} • ${dates} • ${totalGuests} ${totalGuests === 1 ? "guest" : "guests"}`
  }

if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <SearchBar />
          </div>
          <div className="flex gap-6">
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="h-12 bg-gray-200 rounded mb-6 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-secondary mb-2">
                    {searchCriteria.destination ? `Hotels in ${searchCriteria.destination}` : "Search Results"}
                  </h1>
                  {searchCriteria.destination && (
                    <p className="text-gray-600">{formatSearchSummary()}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
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

                  {/* View Mode Toggles */}
                  <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => { setViewMode("grid"); setShowMap(false); }}
                      className={`px-3 py-2 text-sm transition-colors ${
                        viewMode === "grid" && !showMap ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <ApperIcon name="Grid" size={16} />
                    </button>
                    <button
                      onClick={() => { setViewMode("list"); setShowMap(false); }}
                      className={`px-3 py-2 text-sm transition-colors border-x border-gray-300 ${
                        viewMode === "list" && !showMap ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <ApperIcon name="List" size={16} />
                    </button>
                    <button
                      onClick={() => setShowMap(!showMap)}
                      className={`px-3 py-2 text-sm transition-colors ${
                        showMap ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <ApperIcon name="Map" size={16} />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="rating">Guest Rating</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="stars">Star Rating</option>
                  </select>
                </div>
              </div>

              {/* Results */}
              {showMap ? (
                <MapView />
              ) : filteredHotels.length === 0 ? (
                <Empty
                  title="No hotels found"
                  description="Try adjusting your search criteria or filters to find more options"
                  icon="SearchX"
                  actionLabel="Clear Filters"
                  onAction={() => window.location.reload()}
                />
              ) : (
                <>
                  <div className={`grid gap-6 ${
                    viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                  }`}>
                    {paginatedHotels.map((hotel) => (
                      <HotelCard 
                        key={hotel.Id} 
                        hotel={hotel}
                        isFavorite={favorites.includes(hotel.Id)}
                        onToggleFavorite={toggleFavorite}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Show:</span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                          className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="12">12</option>
                          <option value="24">24</option>
                          <option value="48">48</option>
                        </select>
                        <span className="text-sm text-gray-600">
                          {startIndex + 1}-{Math.min(endIndex, filteredHotels.length)} of {filteredHotels.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ApperIcon name="ChevronLeft" size={16} />
                        </Button>
                        
                        <div className="flex gap-1">
                          {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1
                            if (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                              return (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors ${
                                    currentPage === page
                                      ? "bg-primary text-white"
                                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                                  }`}
                                >
                                  {page}
                                </button>
                              )
                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                              return <span key={page} className="px-2 text-gray-400">...</span>
                            }
                            return null
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <ApperIcon name="ChevronRight" size={16} />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
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