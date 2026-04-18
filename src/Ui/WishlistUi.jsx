



import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
 import { removeFromWishlist } from '../Slices/WishlistSlice';
import { addToCart } from '../Slices/CartSlice';
import { FiArrowLeft, FiX, FiShoppingCart, FiSearch, FiFilter } from 'react-icons/fi';
import { Toaster, toast } from 'react-hot-toast';
import './WishlistUi.css';

const WishlistUi = () => {
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const cart = useSelector((state) => state.cart.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  const filteredWishlist = wishlist
    .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      return 0;
    });

  const handleRemove = (itemId) => {
    dispatch(removeFromWishlist(itemId));
    toast.success('Item removed from wishlist');
  };

  const handleAddToCart = (product) => {
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
      toast.error('Item already in cart');
      return;
    }
    dispatch(addToCart(product));
    toast.success('Added to cart!');
  };

  const handleMoveAllToCart = () => {
    let addedCount = 0;
    wishlist.forEach(item => {
      const exists = cart.find(cartItem => cartItem.id === item.id);
      if (!exists) {
        dispatch(addToCart(item));
        addedCount++;
      }
    });
    if (addedCount > 0) {
      toast.success(`${addedCount} items added to cart`);
    } else {
      toast.info('Items already in cart');
    }
  };

  return (
    <div className="wishlist-page">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="wishlist-header">
        <button className="back-link" onClick={() => navigate('/products')}>
          <FiArrowLeft /> Back to Shop
        </button>
        <h1>My Wishlist</h1>
        <div className="wishlist-count">{wishlist.length} items</div>
      </div>

      <div className="wishlist-container">
        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">❤️</div>
            <p className="empty-text">Your wishlist is empty</p>
            <p className="empty-subtext">Add items you love to your wishlist</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/products')}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Search & Filter */}
            <div className="wishlist-controls">
              <div className="search-bar">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search wishlist..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button 
                    className="clear-btn"
                    onClick={() => setSearchTerm('')}
                  >
                    <FiX />
                  </button>
                )}
              </div>

              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <button 
                className="btn btn-primary btn-sm"
                onClick={handleMoveAllToCart}
              >
                <FiShoppingCart /> Move All to Cart
              </button>
            </div>

            {/* Wishlist Items */}
            <div className="wishlist-grid">
              {filteredWishlist.map((item, index) => {
                const imgSrc =
                  item.image ||
                  item.thumbnail ||
                  (Array.isArray(item.images) ? item.images[0] : item.images) ||
                  'https://via.placeholder.com/200';

                return (
                  <div className="wishlist-card fade-in" key={index}>
                    <div className="wishlist-card-image">
                      <img
                        src={imgSrc}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/200';
                        }}
                      />
                      <button
                        className="remove-wishlist-btn"
                        onClick={() => handleRemove(item.id)}
                        title="Remove from wishlist"
                      >
                        <FiX />
                      </button>
                    </div>

                    <div className="wishlist-card-content">
                      <h3 className="wishlist-item-title">{item.title}</h3>
                      
                      {item.category && (
                        <p className="wishlist-category">{item.category}</p>
                      )}

                      {item.price && (
                        <p className="wishlist-price">${item.price.toFixed(2)}</p>
                      )}

                      {item.rating && (
                        <p className="wishlist-rating">
                          ⭐ {typeof item.rating === 'object' ? item.rating.rate : item.rating}
                        </p>
                      )}

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddToCart(item)}
                      >
                        <FiShoppingCart /> Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredWishlist.length === 0 && (
              <div className="no-results">
                <p>No items match your search</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistUi;




