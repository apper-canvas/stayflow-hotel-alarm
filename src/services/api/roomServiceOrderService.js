import roomServiceMenuData from "@/services/mockData/roomServiceMenu.json"

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Mock orders data
const ordersData = [
  {
    Id: 1,
    bookingId: 1,
    roomNumber: "1205",
    items: [
      { Id: 1, name: "Continental Breakfast", price: 28, quantity: 2 },
      { Id: 7, name: "Fresh Orange Juice", price: 8, quantity: 2 }
    ],
    specialInstructions: "Please deliver by 8 AM",
    totalAmount: 72,
    status: "delivered",
    orderedAt: "2024-01-21T07:30:00Z",
    estimatedDelivery: "2024-01-21T08:00:00Z"
  }
]

export const roomServiceOrderService = {
  async getMenu() {
    await delay(300)
    return [...roomServiceMenuData]
  },

  async getMenuByCategory(category) {
    await delay(250)
    return roomServiceMenuData.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    )
  },

  async getMenuItemById(id) {
    await delay(200)
    const item = roomServiceMenuData.find(item => item.Id === parseInt(id))
    if (!item) {
      throw new Error("Menu item not found")
    }
    return { ...item }
  },

  async getOrdersByBookingId(bookingId) {
    await delay(300)
    return ordersData.filter(order => order.bookingId === parseInt(bookingId))
  },

  async getOrderById(id) {
    await delay(200)
    const order = ordersData.find(order => order.Id === parseInt(id))
    if (!order) {
      throw new Error("Order not found")
    }
    return { ...order }
  },

  async createOrder(orderData) {
    await delay(400)
    const maxId = ordersData.length > 0 ? Math.max(...ordersData.map(o => o.Id)) : 0
    const deliveryTime = new Date()
    deliveryTime.setMinutes(deliveryTime.getMinutes() + 30)
    
    const newOrder = {
      ...orderData,
      Id: maxId + 1,
      status: "preparing",
      orderedAt: new Date().toISOString(),
      estimatedDelivery: deliveryTime.toISOString()
    }
    ordersData.push(newOrder)
    return { ...newOrder }
  },

  async updateOrderStatus(id, status) {
    await delay(250)
    const index = ordersData.findIndex(order => order.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Order not found")
    }
    
    ordersData[index] = {
      ...ordersData[index],
      status: status
    }
    return { ...ordersData[index] }
  },

  async cancelOrder(id) {
    await delay(300)
    const index = ordersData.findIndex(order => order.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Order not found")
    }
    
    ordersData[index] = {
      ...ordersData[index],
      status: "cancelled"
    }
    return { ...ordersData[index] }
  }
}