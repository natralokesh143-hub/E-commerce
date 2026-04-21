
import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchProducts } from "../Slices/ProductsSlice"
import { useNavigate } from "react-router-dom"
import { addToCart } from "../Slices/CartSlice"
import { CiHeart } from "react-icons/ci"
import { FiSearch, FiX, FiStar, FiShoppingCart } from "react-icons/fi"
import { Toaster, toast } from "react-hot-toast"
import { addToWishlist } from "../Slices/WishlistSlice"
import "./ProductsUi.css"

const ProductsUi = () => {

  const { products, loading, error } = useSelector((state) => state.products)
  const cart = useSelector((state) => state.cart.cart)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  // Filter products
  const filteredProducts = React.useMemo(() => {

    let result = [...products]

    if (searchTerm) {
      result = result.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return result

  }, [products, searchTerm])

  // Add to Cart
  const handleCart = (product) => {

    const exists = cart.find((item) => item.id === product.id)

    if (exists) {
      toast.error("Item already in cart")
      return
    }

    dispatch(addToCart(product))
    toast.success(`${product.title} added to cart`)
  }

  // Wishlist
  const handleWishList = (item) => {
    dispatch(addToWishlist(item))
    toast.success(`${item.title} added to wishlist`)
  }

  const clearSearch = () => setSearchTerm("")

  if (loading)
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    )

  if (error) return <div className="status-msg error">{error}</div>

  return (
    <div className="shop-wrapper">

      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="navbar-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-name">PremiumCart</span>
        </div>

        <div className="navbar-search-filter">

          <div className="search-bar">

            <FiSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />

            {searchTerm && (
              <button className="clear-search" onClick={clearSearch}>
                <FiX />
              </button>
            )}

          </div>

        </div>

        <div className="navbar-actions">

          <button
            className="nav-btn"
            onClick={() => navigate("/cart")}
          >
            <FiShoppingCart /> Cart
            <span className="badge">{cart.length}</span>
          </button>

          <button
            className="nav-btn"
            onClick={() => navigate("/wishlist")}
          >
            ❤️ Wishlist
          </button>

          <button
            className="nav-btn"
            onClick={() => navigate("/orders")}
          >
            🧾 Orders
          </button>

          <button
            className="nav-btn"
            onClick={() => navigate("/profile")}
          >
            👤 Profile
          </button>

        </div>

      </nav>

      {/* HERO SECTION */}

      <section className="hero-banner">

        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="hero-highlight">PremiumCart</span>
          </h1>

          <p className="hero-subtitle">
            Find glowing deals on thousands of products
          </p>
        </div>

      </section>

      {/* RESULTS COUNT */}

      <div className="results-info">
        <p>{filteredProducts.length} products found</p>
      </div>

      {/* PRODUCTS */}

      <section className="products-section">

        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-sub">Handpicked premium selections</p>
        </div>

        {filteredProducts.length === 0 ? (

          <div className="no-products">
            <p>No products found</p>
          </div>

        ) : (

          <div className="products-grid">

            {filteredProducts.map((item) => (

              <div
                className="product-card fade-in"
                key={item.id}
                onClick={() => navigate(`/product/${item.id}`)}
              >

                {/* Wishlist */}

                <button
                  className="wishlist-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleWishList(item)
                  }}
                >
                  <CiHeart size={20} />
                </button>

                {/* Image */}

                <div className="product-img-wrap">

                  <img
                    src={
                      item.image ||
                      item.thumbnail ||
                      item.images?.[0] ||
                      "https://via.placeholder.com/200"
                    }
                    alt={item.title}
                    className="product-img"
                  />

                  {item.discount && (
                    <div className="discount-badge">
                      {item.discount}% OFF
                    </div>
                  )}

                </div>

                {/* Product Info */}

                <div className="product-info">

                  {item.category && (
                    <span className="product-category">
                      {item.category}
                    </span>
                  )}

                  <p className="product-title">
                    {item.title}
                  </p>

                  {/* Rating */}

                  {item.rating && (
                    <div className="product-rating">
                      <FiStar />

                      {typeof item.rating === "object"
                        ? item.rating.rate
                        : item.rating}

                      <span className="rating-count">

                        (
                        {typeof item.rating === "object"
                          ? item.rating.count
                          : 0}
                        )

                      </span>
                    </div>
                  )}

                  {/* Price */}

                  <div className="product-bottom">

                    <p className="product-price">
                      ${item.price?.toFixed(2)}
                    </p>

                  </div>

                  {/* Add To Cart */}

                  <button
                    className="add-to-cart-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCart(item)
                    }}
                  >
                    <FiShoppingCart />
                    Add to Cart
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* FOOTER */}

      <footer className="footer">

        <div className="footer-content">

          <div className="footer-section">
            <h4>About Us</h4>
            <p>Your premium destination for quality products.</p>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li>Help Center</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>

            <div className="social-links">
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
            </div>

          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2026 PremiumCart. All rights reserved.</p>
        </div>

      </footer>

    </div>
  )
}

export default ProductsUi