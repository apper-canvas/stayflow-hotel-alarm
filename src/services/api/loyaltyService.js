import loyaltyTransactionsData from "@/services/mockData/loyaltyTransactions.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock user loyalty data
const userLoyaltyData = {
  user1: {
    userId: "user1",
    currentPoints: 2239,
    totalPointsEarned: 2739,
    currentTier: "Gold",
    nextTier: "Platinum",
    pointsToNextTier: 1261,
    memberSince: "2023-06-15"
  }
}

// Mock rewards catalog
const rewardsData = [
  {
    Id: 1,
    name: "Free Night Stay",
    description: "One complimentary night at participating hotels",
    pointsCost: 2500,
    category: "accommodation",
    terms: "Valid for 12 months, blackout dates apply"
  },
  {
    Id: 2,
    name: "Room Upgrade",
    description: "Complimentary room upgrade (subject to availability)",
    pointsCost: 500,
    category: "upgrade",
    terms: "Valid at check-in, one-time use"
  },
  {
    Id: 3,
    name: "Late Checkout",
    description: "Late checkout until 4 PM",
    pointsCost: 250,
    category: "service",
    terms: "Subject to availability, advance notice required"
  },
  {
    Id: 4,
    name: "Spa Credit",
    description: "$100 spa services credit",
    pointsCost: 1000,
    category: "amenity",
    terms: "Valid at hotel spa facilities only"
  }
]

export const loyaltyService = {
  async getUserLoyaltyInfo(userId) {
    await delay(300)
    const userInfo = userLoyaltyData[userId]
    if (!userInfo) {
      throw new Error("User loyalty information not found")
    }
    return { ...userInfo }
  },

  async getTransactionHistory(userId) {
    await delay(300)
    return loyaltyTransactionsData.filter(transaction => transaction.userId === userId)
  },

  async getRewardsCatalog() {
    await delay(250)
    return [...rewardsData]
  },

  async redeemReward(userId, rewardId) {
    await delay(400)
    const reward = rewardsData.find(r => r.Id === parseInt(rewardId))
    if (!reward) {
      throw new Error("Reward not found")
    }

    const userInfo = userLoyaltyData[userId]
    if (!userInfo) {
      throw new Error("User not found")
    }

    if (userInfo.currentPoints < reward.pointsCost) {
      throw new Error("Insufficient points")
    }

    // Deduct points
    userInfo.currentPoints -= reward.pointsCost

    // Create transaction record
    const maxId = Math.max(...loyaltyTransactionsData.map(t => t.Id))
    const transaction = {
      Id: maxId + 1,
      userId: userId,
      bookingId: null,
      pointsEarned: 0,
      pointsSpent: reward.pointsCost,
      transactionType: "reward",
      description: `Redeemed: ${reward.name}`,
      createdAt: new Date().toISOString()
    }
    loyaltyTransactionsData.push(transaction)

    return {
      success: true,
      remainingPoints: userInfo.currentPoints,
      transaction: { ...transaction }
    }
  },

  async calculatePointsForBooking(bookingAmount) {
    await delay(200)
    // 1 point per dollar spent
    const pointsEarned = Math.floor(bookingAmount)
    return { pointsEarned }
  },

  async addPointsForBooking(userId, bookingId, amount) {
    await delay(300)
    const pointsEarned = Math.floor(amount)
    
    const userInfo = userLoyaltyData[userId]
    if (userInfo) {
      userInfo.currentPoints += pointsEarned
      userInfo.totalPointsEarned += pointsEarned
    }

    // Create transaction record
    const maxId = Math.max(...loyaltyTransactionsData.map(t => t.Id))
    const transaction = {
      Id: maxId + 1,
      userId: userId,
      bookingId: parseInt(bookingId),
      pointsEarned: pointsEarned,
      pointsSpent: 0,
      transactionType: "booking",
      description: `Points earned from booking`,
      createdAt: new Date().toISOString()
    }
    loyaltyTransactionsData.push(transaction)

    return { ...transaction }
  }
}