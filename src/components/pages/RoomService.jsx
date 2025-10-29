import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Input from "@/components/atoms/Input"
import Label from "@/components/atoms/Label"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { roomServiceOrderService } from "@/services/api/roomServiceOrderService"

const RoomService = () => {
  const [menuItems, setMenuItems] = useState([])
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeCategory, setActiveCategory] = useState("Breakfast")
  const [orderDetails, setOrderDetails] = useState({
    roomNumber: "",
    specialInstructions: ""
  })
  const [submittingOrder, setSubmittingOrder] = useState(false)

  const categories = ["Breakfast", "Lunch", "Dinner", "Beverages", "Desserts"]

  useEffect(() => {
    loadMenu()
  }, [])

  const loadMenu = async () => {
    try {
      setError("")
      setLoading(true)
      const menu = await roomServiceOrderService.getMenu()
      setMenuItems(menu)
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load menu")
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.Id === item.Id)
    
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.Id === item.Id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
    
    toast.success(`${item.name} added to cart`)
  }

  const updateCartItemQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.Id !== itemId))
    } else {
      setCart(cart.map(item =>
        item.Id === itemId ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.Id !== itemId))
  }

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      toast.error("Please add items to your cart")
      return
    }

    if (!orderDetails.roomNumber) {
      toast.error("Please enter your room number")
      return
    }

    try {
      setSubmittingOrder(true)
      
      const order = await roomServiceOrderService.createOrder({
        bookingId: 1, // Mock booking ID
        roomNumber: orderDetails.roomNumber,
        items: cart.map(item => ({
          Id: item.Id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        specialInstructions: orderDetails.specialInstructions,
        totalAmount: calculateTotal()
      })

      toast.success("Order placed successfully!")
      setCart([])
      setOrderDetails({ roomNumber: "", specialInstructions: "" })
      
    } catch (err) {
      toast.error("Failed to place order")
    } finally {
      setSubmittingOrder(false)
    }
  }

  const filteredMenuItems = menuItems.filter(item => item.category === activeCategory)

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadMenu} />

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-2">
              Room Service
            </h1>
            <p className="text-gray-600 text-lg">
              Delicious meals delivered directly to your room
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Menu */}
            <div className="lg:col-span-2">
              {/* Category Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
                      activeCategory === category
                        ? "gradient-bg text-white"
                        : "bg-surface text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                    <span className="ml-2 text-xs opacity-70">
                      ({menuItems.filter(item => item.category === category).length})
                    </span>
                  </button>
                ))}
              </div>

              {/* Menu Items */}
              <div className="space-y-4">
                {filteredMenuItems.length === 0 ? (
                  <Empty
                    title="No items available"
                    description={`No ${activeCategory.toLowerCase()} items are currently available`}
                    icon="UtensilsCrossed"
                  />
                ) : (
                  filteredMenuItems.map((item) => (
                    <Card key={item.Id} className="p-6">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg text-secondary">
                                {item.name}
                              </h3>
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                            {!item.available && (
                              <Badge variant="error" className="ml-4">
                                Unavailable
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4">
                              <div className="text-xl font-bold gradient-text">
                                {formatPrice(item.price)}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <ApperIcon name="Clock" size={16} />
                                <span>{item.preparationTime} min</span>
                              </div>
                            </div>
                            
                            <Button
                              onClick={() => addToCart(item)}
                              disabled={!item.available}
                              size="sm"
                            >
                              <ApperIcon name="Plus" size={16} className="mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            {/* Cart Sidebar */}
            <div>
              <Card className="p-6 sticky top-24">
                <h2 className="font-semibold text-xl text-secondary mb-4 flex items-center gap-2">
                  <ApperIcon name="ShoppingCart" size={20} />
                  Your Order
                  {cart.length > 0 && (
                    <Badge variant="primary" className="ml-2">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </h2>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ApperIcon name="ShoppingCart" size={48} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600">Your cart is empty</p>
                    <p className="text-sm text-gray-500">Add items from the menu</p>
                  </div>
                ) : (
                  <>
                    {/* Cart Items */}
                    <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.Id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-secondary text-sm">
                              {item.name}
                            </div>
                            <div className="text-primary font-semibold">
                              {formatPrice(item.price)}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartItemQuantity(item.Id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              <ApperIcon name="Minus" size={12} />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartItemQuantity(item.Id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              <ApperIcon name="Plus" size={12} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.Id)}
                            className="w-6 h-6 rounded-full bg-error/10 text-error flex items-center justify-center hover:bg-error/20 transition-colors"
                          >
                            <ApperIcon name="X" size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Order Details */}
                    <div className="space-y-4 mb-6">
                      <div className="space-y-2">
                        <Label>Room Number *</Label>
                        <Input
                          placeholder="e.g., 1205"
                          value={orderDetails.roomNumber}
                          onChange={(e) => setOrderDetails({
                            ...orderDetails,
                            roomNumber: e.target.value
                          })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Special Instructions</Label>
                        <textarea
                          rows="3"
                          placeholder="Any special requests or dietary restrictions..."
                          value={orderDetails.specialInstructions}
                          onChange={(e) => setOrderDetails({
                            ...orderDetails,
                            specialInstructions: e.target.value
                          })}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-sm"
                        />
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex justify-between items-center text-lg font-bold text-secondary">
                        <span>Total</span>
                        <span className="gradient-text">{formatPrice(calculateTotal())}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Estimated delivery: 25-35 minutes
                      </p>
                    </div>

                    {/* Place Order Button */}
                    <Button
                      onClick={handleSubmitOrder}
                      disabled={submittingOrder || !orderDetails.roomNumber}
                      size="lg"
                      className="w-full"
                    >
                      {submittingOrder ? (
                        <>
                          <ApperIcon name="Loader2" size={18} className="mr-2 animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <ApperIcon name="Check" size={18} className="mr-2" />
                          Place Order
                        </>
                      )}
                    </Button>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomService