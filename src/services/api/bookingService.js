import bookingsData from "@/services/mockData/bookings.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const bookingService = {
  async getAll() {
    await delay(300)
    return [...bookingsData]
  },

  async getById(id) {
    await delay(200)
    const booking = bookingsData.find(booking => booking.Id === parseInt(id))
    if (!booking) {
      throw new Error("Booking not found")
    }
    return { ...booking }
  },

  async getByUserId(userId) {
    await delay(300)
    return bookingsData.filter(booking => booking.userId === userId)
  },

  async getByBookingReference(reference) {
    await delay(250)
    const booking = bookingsData.find(booking => booking.bookingReference === reference)
    if (!booking) {
      throw new Error("Booking not found")
    }
    return { ...booking }
  },

  async create(booking) {
    await delay(400)
    const maxId = Math.max(...bookingsData.map(b => b.Id))
    const bookingRef = `SF${String(maxId + 1).padStart(3, "0")}-2024`
    
    const newBooking = {
      ...booking,
      Id: maxId + 1,
      bookingReference: bookingRef,
      status: "confirmed",
      paymentStatus: "paid",
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    }
    bookingsData.push(newBooking)
    return { ...newBooking }
  },

  async update(id, bookingData) {
    await delay(300)
    const index = bookingsData.findIndex(booking => booking.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Booking not found")
    }
    bookingsData[index] = { 
      ...bookingsData[index], 
      ...bookingData,
      modifiedAt: new Date().toISOString()
    }
    return { ...bookingsData[index] }
  },

  async cancel(id, reason = "") {
    await delay(300)
    const index = bookingsData.findIndex(booking => booking.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Booking not found")
    }
    
    bookingsData[index] = {
      ...bookingsData[index],
      status: "cancelled",
      paymentStatus: "refunded",
      modifiedAt: new Date().toISOString(),
      cancellationReason: reason
    }
    return { ...bookingsData[index] }
  },

  async delete(id) {
    await delay(200)
    const index = bookingsData.findIndex(booking => booking.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Booking not found")
    }
    const deletedBooking = bookingsData.splice(index, 1)[0]
    return { ...deletedBooking }
  }
}