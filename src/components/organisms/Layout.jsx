import React from "react"
import { Outlet } from "react-router-dom"
import Header from "@/components/organisms/Header"

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-secondary text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SF</span>
                </div>
                <div className="font-display font-bold text-lg">StayFlow</div>
              </div>
              <p className="text-gray-300 text-sm">
                Premium hotel booking platform for exceptional travel experiences.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Search Hotels</a></li>
                <li><a href="/bookings" className="text-gray-300 hover:text-white transition-colors">My Bookings</a></li>
                <li><a href="/rewards" className="text-gray-300 hover:text-white transition-colors">Loyalty Program</a></li>
                <li><a href="/room-service" className="text-gray-300 hover:text-white transition-colors">Room Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cancellation Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-sm">f</span>
                </a>
                <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-sm">t</span>
                </a>
                <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <span className="text-sm">i</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 mt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 StayFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout