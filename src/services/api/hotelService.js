import hotelsData from "@/services/mockData/hotels.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const hotelService = {
  async getAll() {
    await delay(300)
    return [...hotelsData]
  },

  async getById(id) {
    await delay(200)
    const hotel = hotelsData.find(hotel => hotel.Id === parseInt(id))
    if (!hotel) {
      throw new Error("Hotel not found")
    }
    return { ...hotel }
  },

  async searchHotels(criteria) {
    await delay(400)
    let results = [...hotelsData]

    if (criteria.city) {
      results = results.filter(hotel => 
        hotel.location.city.toLowerCase().includes(criteria.city.toLowerCase())
      )
    }

    if (criteria.minRating) {
      results = results.filter(hotel => hotel.rating >= criteria.minRating)
    }

    if (criteria.starRating && criteria.starRating.length > 0) {
      results = results.filter(hotel => 
        criteria.starRating.includes(hotel.starRating)
      )
    }

    if (criteria.amenities && criteria.amenities.length > 0) {
      results = results.filter(hotel =>
        criteria.amenities.every(amenity => hotel.amenities.includes(amenity))
      )
    }

    return results
  },

  async create(hotel) {
    await delay(250)
    const maxId = Math.max(...hotelsData.map(h => h.Id))
    const newHotel = {
      ...hotel,
      Id: maxId + 1
    }
    hotelsData.push(newHotel)
    return { ...newHotel }
  },

  async update(id, hotelData) {
    await delay(300)
    const index = hotelsData.findIndex(hotel => hotel.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Hotel not found")
    }
    hotelsData[index] = { ...hotelsData[index], ...hotelData }
    return { ...hotelsData[index] }
  },

  async delete(id) {
    await delay(200)
    const index = hotelsData.findIndex(hotel => hotel.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Hotel not found")
    }
    const deletedHotel = hotelsData.splice(index, 1)[0]
    return { ...deletedHotel }
  }
}