import React from 'react'
import { useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiLogOut, FiUser, FiPackage, FiHeart, FiShoppingCart } from 'react-icons/fi'
import './ProfileUi.css'

const ProfileUi = () => {
  const user = useSelector((state) => state.auth.user)
  const orders = useSelector((state) => state.orders.orders)
  const wishlist = useSelector((state) => state.wishlist.wishlist)
  const cart = useSelector((state) => state.cart.cart)
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="profile-page">
        <div className="empty-profile">
          <div className="empty-icon">🔒</div>
          <p className="empty-text">Please login to view your profile</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const imgSrc = user.image || user.avatar || user.photo || 'https://via.placeholder.com/150'

  const stats = [
    { label: 'Orders', value: orders.length, icon: FiPackage, color: 'stat-blue' },
    { label: 'Wishlist', value: wishlist.length, icon: FiHeart, color: 'stat-red' },
    { label: 'Cart Items', value: cart.length, icon: FiShoppingCart, color: 'stat-green' }
  ]

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header-section">
        <h1>My Profile</h1>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/products')}>
          <FiArrowRight /> Back to Shopping
        </button>
      </div>

      <div className="profile-container">
        {/* Profile Card */}
        <div className="profile-card fade-in">
          {user.isPremium && (
            <div className="premium-badge">
              ⭐ Premium Member
            </div>
          )}

        
          <div className="profile-avatar-section">
            <img 
              src={imgSrc} 
              alt={user.username}
              className="profile-image avatar-image"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/150'
              }} 
            />
          </div>

          <div className="profile-info">
            <h2 className="profile-username">
              {user.username || user.firstName || user.name || 'User'}
            </h2>
            <p className="profile-email">
              <FiUser className="inline-icon" />
              {user.email || 'No email'}
            </p>
            {user.phone && (
              <p className="profile-phone">📞 {user.phone}</p>
            )}
            {user.address && (
              <p className="profile-address">📍 {user.address}</p>
            )}
          </div>

          
          {import.meta.env.DEV && (
            <pre className="user-debug">{JSON.stringify(user, null, 2)}</pre>
          )}

          <button className="btn btn-outline btn-sm profile-logout logout-btn">
            <FiLogOut /> Logout
          </button>
        </div>

        
        <div className="profile-stats-grid">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div className={`stat-card ${stat.color} fade-in`} key={index}>
                <div className="stat-icon">
                  <IconComponent />
                </div>
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            )
          })}
        </div>

       
        <div className="quick-links-section">
          <h3 className="section-title">Quick Links</h3>
          <div className="quick-links-grid">
            <button 
              className="quick-link-btn"
              onClick={() => navigate('/orders')}
            >
              <FiPackage className="link-icon" />
              <span>My Orders</span>
              <span className="link-badge">{orders.length}</span>
            </button>

            <button 
              className="quick-link-btn"
              onClick={() => navigate('/wishlist')}
            >
              <FiHeart className="link-icon" />
              <span>Wishlist</span>
              <span className="link-badge">{wishlist.length}</span>
            </button>

            <button 
              className="quick-link-btn"
              onClick={() => navigate('/cart')}
            >
              <FiShoppingCart className="link-icon" />
              <span>Shopping Cart</span>
              <span className="link-badge">{cart.length}</span>
            </button>

            <button 
              className="quick-link-btn"
              onClick={() => navigate('/products')}
            >
              <FiArrowRight className="link-icon" />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>

       
        {orders.length > 0 && (
          <div className="recent-orders-section">
            <h3 className="section-title">Recent Orders</h3>
            <div className="recent-orders-list">
              {orders.slice(-3).reverse().map((order, index) => (
                <div className="recent-order-item" key={index}>
                  <div className="order-date">
                    {new Date(order.date || new Date().getTime()).toLocaleDateString()}
                  </div>
                  <div className="order-summary">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </div>
                  <div className="order-amount">
                    ${order.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="btn btn-secondary btn-full"
              onClick={() => navigate('/orders')}
            >
              View All Orders
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileUi


