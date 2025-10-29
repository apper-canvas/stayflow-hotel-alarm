import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import BookingCard from "@/components/molecules/BookingCard"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { bookingService } from "@/services/api/bookingService"

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    loadBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [activeTab, bookings])

  const loadBookings = async () => {
    try {
      setError("")
      setLoading(true)
      
      // Mock user ID
      const userBookings = await bookingService.getByUserId("user1")
      setBookings(userBookings)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    const now = new Date()
    let filtered = []

    switch (activeTab) {
      case "upcoming":
        filtered = bookings.filter(booking => {
          const checkInDate = new Date(booking.checkInDate)
          return checkInDate >= now && booking.status === "confirmed"
        })
        break
      case "past":
        filtered = bookings.filter(booking => {
          const checkOutDate = new Date(booking.checkOutDate)
          return checkOutDate < now && booking.status === "confirmed"
        })
        break
      case "cancelled":
        filtered = bookings.filter(booking => booking.status === "cancelled")
        break
      default:
        filtered = bookings
        break
    }

    // Sort by check-in date
    filtered.sort((a, b) => new Date(b.checkInDate) - new Date(a.checkInDate))
    setFilteredBookings(filtered)
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    try {
      await bookingService.cancel(bookingId, "Cancelled by guest")
      toast.success("Booking cancelled successfully")
      loadBookings()
    } catch (err) {
      toast.error("Failed to cancel booking")
    }
  }

  const tabs = [
    { 
      id: "upcoming", 
      label: "Upcoming", 
      count: bookings.filter(b => {
        const checkInDate = new Date(b.checkInDate)
        return checkInDate >= new Date() && b.status === "confirmed"
      }).length,
      icon: "Calendar"
    },
    { 
      id: "past", 
      label: "Past Stays", 
      count: bookings.filter(b => {
        const checkOutDate = new Date(b.checkOutDate)
        return checkOutDate < new Date() && b.status === "confirmed"
      }).length,
      icon: "History"
    },
    { 
      id: "cancelled", 
      label: "Cancelled", 
      count: bookings.filter(b => b.status === "cancelled").length,
      icon: "X"
    }
  ]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadBookings} />

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-2">
              My Bookings
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your hotel reservations and view booking history
            </p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex gap-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <ApperIcon name={tab.icon} size={18} />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Bookings List */}
          <div>
            {filteredBookings.length === 0 ? (
              <Empty
                title={getEmptyStateTitle(activeTab)}
                description={getEmptyStateDescription(activeTab)}
                icon={getEmptyStateIcon(activeTab)}
                actionLabel={activeTab === "upcoming" ? "Find Hotels" : undefined}
                onAction={activeTab === "upcoming" ? () => window.location.href = "/" : undefined}
              />
            ) : (
              <div className="space-y-6">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.Id}
                    booking={booking}
                    onCancel={booking.status === "confirmed" ? handleCancelBooking : undefined}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Stats Summary */}
          {bookings.length > 0 && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface rounded-lg p-6 text-center">
                <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="MapPin" className="text-white" size={24} />
                </div>
                <div className="text-2xl font-bold text-secondary mb-1">
                  {new Set(bookings.map(b => b.hotelId)).size}
                </div>
                <div className="text-gray-600 text-sm">Hotels Visited</div>
              </div>
              
              <div className="bg-surface rounded-lg p-6 text-center">
                <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Calendar" className="text-white" size={24} />
                </div>
                <div className="text-2xl font-bold text-secondary mb-1">
                  {bookings.filter(b => b.status === "confirmed").length}
                </div>
                <div className="text-gray-600 text-sm">Total Bookings</div>
              </div>
              
              <div className="bg-surface rounded-lg p-6 text-center">
                <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="DollarSign" className="text-white" size={24} />
                </div>
                <div className="text-2xl font-bold text-secondary mb-1">
                  ${bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0).toLocaleString()}
                </div>
                <div className="text-gray-600 text-sm">Total Spent</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper functions for empty states
const getEmptyStateTitle = (activeTab) => {
  switch (activeTab) {
    case "upcoming":
      return "No upcoming bookings"
    case "past":
      return "No past stays"
    case "cancelled":
      return "No cancelled bookings"
    default:
      return "No bookings found"
  }
}

const getEmptyStateDescription = (activeTab) => {
  switch (activeTab) {
    case "upcoming":
      return "Ready for your next adventure? Search and book amazing hotels now!"
    case "past":
      return "Your travel history will appear here once you complete your stays"
    case "cancelled":
      return "You haven't cancelled any bookings yet"
    default:
      return "Start booking to see your reservations here"
  }
}

const getEmptyStateIcon = (activeTab) => {
  switch (activeTab) {
    case "upcoming":
      return "Calendar"
    case "past":
      return "History"
    case "cancelled":
      return "X"
    default:
      return "Calendar"
  }
}

export default MyBookings