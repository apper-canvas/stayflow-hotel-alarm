import reviewsData from "@/services/mockData/reviews.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const reviewService = {
  async getAll() {
    await delay(300)
    return [...reviewsData]
  },

  async getById(id) {
    await delay(200)
    const review = reviewsData.find(review => review.Id === parseInt(id))
    if (!review) {
      throw new Error("Review not found")
    }
    return { ...review }
  },

  async getByHotelId(hotelId) {
    await delay(300)
    return reviewsData.filter(review => review.hotelId === parseInt(hotelId))
  },

  async getByUserId(userId) {
    await delay(300)
    return reviewsData.filter(review => review.userId === userId)
  },

  async create(review) {
    await delay(400)
    const maxId = Math.max(...reviewsData.map(r => r.Id))
    const newReview = {
      ...review,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      helpfulCount: 0
    }
    reviewsData.push(newReview)
    return { ...newReview }
  },

  async update(id, reviewData) {
    await delay(300)
    const index = reviewsData.findIndex(review => review.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Review not found")
    }
    reviewsData[index] = { ...reviewsData[index], ...reviewData }
    return { ...reviewsData[index] }
  },

  async markHelpful(id) {
    await delay(200)
    const index = reviewsData.findIndex(review => review.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Review not found")
    }
    reviewsData[index].helpfulCount += 1
    return { ...reviewsData[index] }
  },

  async delete(id) {
    await delay(200)
    const index = reviewsData.findIndex(review => review.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Review not found")
    }
    const deletedReview = reviewsData.splice(index, 1)[0]
    return { ...deletedReview }
  }
}