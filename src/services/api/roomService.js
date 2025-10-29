import roomsData from "@/services/mockData/rooms.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const roomService = {
  async getAll() {
    await delay(300)
    return [...roomsData]
  },

  async getById(id) {
    await delay(200)
    const room = roomsData.find(room => room.Id === parseInt(id))
    if (!room) {
      throw new Error("Room not found")
    }
    return { ...room }
  },

  async getRoomsByHotelId(hotelId) {
    await delay(300)
    return roomsData.filter(room => room.hotelId === parseInt(hotelId))
  },

  async searchAvailableRooms(criteria) {
    await delay(400)
    let results = [...roomsData]

    if (criteria.hotelId) {
      results = results.filter(room => room.hotelId === parseInt(criteria.hotelId))
    }

    if (criteria.maxOccupancy) {
      results = results.filter(room => room.maxOccupancy >= criteria.maxOccupancy)
    }

    if (criteria.maxPrice) {
      results = results.filter(room => room.basePrice <= criteria.maxPrice)
    }

    if (criteria.minPrice) {
      results = results.filter(room => room.basePrice >= criteria.minPrice)
    }

    if (criteria.checkInDate && criteria.checkOutDate) {
      results = results.filter(room => {
        // Check if room is available for the date range
        return room.availability.includes(criteria.checkInDate)
      })
    }

    return results
  },

  async create(room) {
    await delay(250)
    const maxId = Math.max(...roomsData.map(r => r.Id))
    const newRoom = {
      ...room,
      Id: maxId + 1
    }
    roomsData.push(newRoom)
    return { ...newRoom }
  },

  async update(id, roomData) {
    await delay(300)
    const index = roomsData.findIndex(room => room.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Room not found")
    }
    roomsData[index] = { ...roomsData[index], ...roomData }
    return { ...roomsData[index] }
  },

  async delete(id) {
    await delay(200)
    const index = roomsData.findIndex(room => room.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Room not found")
    }
    const deletedRoom = roomsData.splice(index, 1)[0]
    return { ...deletedRoom }
  }
}