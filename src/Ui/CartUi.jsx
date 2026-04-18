

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiX, FiMinus, FiPlus, FiArrowLeft, FiTrendingUp } from "react-icons/fi";
import { incrementQuantity, decrementQuantity, removeFromCart, clearCart } from "../Slices/CartSlice";
import { addOrder } from "../Slices/OrdersSlice";
import { toast, Toaster } from "react-hot-toast";
import "./CartUi.css";

const CartUi = () => {
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [paymentMode, setPaymentMode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const TAX_RATE = 0.1; // 10% tax
  const SHIPPING_COST = cart.length > 0 ? 0 : 0; // Free shipping

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  const taxAmount = subtotal * TAX_RATE;
  const discountAmount = appliedCoupon === "SAVE10" ? subtotal * 0.1 : 0;
  const total = subtotal + taxAmount + SHIPPING_COST - discountAmount;

  const handleApplyCoupon = () => {
    if (couponCode === "SAVE10") {
      setAppliedCoupon("SAVE10");
      toast.success("Coupon applied! 10% discount");
    } else if (couponCode) {
      toast.error("Invalid coupon code");
    }
  };

  const handleCheckout = () => {
    // Validation
    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!paymentMode) {
      toast.error("Please select a payment method");
      return;
    }
    if (!address.fullName || !address.street || !address.city || !address.state || !address.zip || !address.country) {
      toast.error("Please enter a complete delivery address");
      return;
    }

    // Place order
    dispatch(addOrder({ items: cart, total, paymentMode, address }));
    dispatch(clearCart());
    toast.success("Order placed successfully!");
    setTimeout(() => navigate("/orders"), 1500);
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.success("Item removed from cart");
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="cart-page">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="cart-header">
        <button className="back-link" onClick={() => navigate("/products")}>
          <FiArrowLeft /> Continue Shopping
        </button>
        <h1>Your Cart</h1>
        <div className="cart-count">{cart.length} items</div>
      </div>

      <div className="cart-container">
        {cart.length === 0 ? (
          <div className="empty-cart-wrapper">
            <div className="empty-cart-icon">🛒</div>
            <p className="empty-cart-text">Your cart is empty</p>
            <p className="empty-cart-subtext">Add some items to get started!</p>
            <button className="btn btn-primary" onClick={() => navigate("/products")}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items-section">
              <h2 className="section-title">Order Summary</h2>
              <div className="cart-items-list">
                {cart.map((item, index) => (
                  <div className="cart-item fade-in" key={index}>
                    <div className="cart-item-image">
                      <img
                        src={item.images?.[0] || item.thumbnail || item.image || "https://via.placeholder.com/120"}
                        alt={item.title}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/120"; }}
                      />
                    </div>

                    <div className="cart-item-details">
                      <h3 className="product-title">{item.title}</h3>
                      <p className="product-price">${item.price?.toFixed(2)}</p>
                    </div>

                    <div className="quantity-controls">
                      <button className="qty-btn" onClick={() => dispatch(decrementQuantity(item.id))}><FiMinus /></button>
                      <span className="quantity">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => dispatch(incrementQuantity(item.id))}><FiPlus /></button>
                    </div>

                    <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>

                    <button className="remove-btn" onClick={() => handleRemoveItem(item.id)}><FiX /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="cart-summary">
              <h2 className="section-title">Order Total</h2>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="breakdown-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="breakdown-row"><span>Tax (10%)</span><span>${taxAmount.toFixed(2)}</span></div>
                <div className="breakdown-row"><span>Shipping</span><span className="shipping-free">FREE</span></div>
                {appliedCoupon && (
                  <div className="breakdown-row discount"><span>Discount ({appliedCoupon})</span><span>-${discountAmount.toFixed(2)}</span></div>
                )}
                <div className="breakdown-divider"></div>
                <div className="total-row"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>

              {/* Coupon Section */}
              <div className="coupon-section">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="coupon-input"
                />
                <button className="btn btn-secondary btn-sm" onClick={handleApplyCoupon}>Apply</button>
              </div>

              {/* Delivery Address */}
              <div className="address-section">
                <label className="section-subtitle">Delivery Address</label>
                <input type="text" name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleAddressChange} />
                <input type="text" name="street" placeholder="Street Address" value={address.street} onChange={handleAddressChange} />
                <input type="text" name="city" placeholder="City" value={address.city} onChange={handleAddressChange} />
                <input type="text" name="state" placeholder="State" value={address.state} onChange={handleAddressChange} />
                <input type="text" name="zip" placeholder="ZIP Code" value={address.zip} onChange={handleAddressChange} />
                <input type="text" name="country" placeholder="Country" value={address.country} onChange={handleAddressChange} />
              </div>

              {/* Payment Method */}
              <div className="payment-section">
                <label className="section-subtitle">Payment Method</label>
                <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="payment-select">
                  <option value="">Choose payment method...</option>
                  <option value="Credit Card">💳 Credit Card</option>
                  <option value="Debit Card">🏦 Debit Card</option>
                  <option value="PayPal">🅿️ PayPal</option>
                  <option value="Apple Pay">🍎 Apple Pay</option>
                  <option value="Cash on Delivery">📦 Cash on Delivery</option>
                </select>
              </div>

              {/* Checkout Button */}
              <button className="btn btn-primary btn-lg checkout-btn" onClick={handleCheckout}>
                <FiTrendingUp /> Complete Purchase
              </button>

              <p className="security-notice">✅ 100% Secure. Money-back guarantee.</p>

              {/* Clear Cart */}
              <button className="clear-cart-btn" onClick={() => { dispatch(clearCart()); toast.success("Cart cleared"); }}>
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartUi;