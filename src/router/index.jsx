import React, { lazy, Suspense } from "react"
import { createBrowserRouter } from "react-router-dom"
import Layout from "@/components/organisms/Layout"

// Lazy load all page components
const Home = lazy(() => import("@/components/pages/Home"))
const SearchResults = lazy(() => import("@/components/pages/SearchResults"))
const HotelDetails = lazy(() => import("@/components/pages/HotelDetails"))
const BookingFlow = lazy(() => import("@/components/pages/BookingFlow"))
const BookingConfirmation = lazy(() => import("@/components/pages/BookingConfirmation"))
const MyBookings = lazy(() => import("@/components/pages/MyBookings"))
const BookingDetails = lazy(() => import("@/components/pages/BookingDetails"))
const RoomService = lazy(() => import("@/components/pages/RoomService"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

// Professional loading fallback matching brand aesthetics
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <p className="text-secondary font-medium">Loading...</p>
    </div>
  </div>
)

// Wrapper for lazy loaded components with Suspense
const withSuspense = (Component) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
)

// Main routes configuration
const mainRoutes = [
  {
    path: "",
    index: true,
    element: withSuspense(Home)
  },
  {
path: "search-results",
    element: withSuspense(SearchResults)
  },
  {
    path: "hotels",
    element: withSuspense(lazy(() => import("@/components/pages/AllHotels")))
  },
  {
    path: "hotel/:id",
    element: withSuspense(HotelDetails)
  },
  {
    path: "booking/:hotelId",
    element: withSuspense(BookingFlow)
  },
  {
    path: "booking-confirmation/:bookingId",
    element: withSuspense(BookingConfirmation)
  },
  {
    path: "my-bookings",
    element: withSuspense(MyBookings)
  },
  {
    path: "booking/:id",
    element: withSuspense(BookingDetails)
  },
  {
    path: "room-service",
    element: withSuspense(RoomService)
  },
  {
    path: "*",
    element: withSuspense(NotFound)
  }
]

// Routes array with Layout parent
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
]

export const router = createBrowserRouter(routes)