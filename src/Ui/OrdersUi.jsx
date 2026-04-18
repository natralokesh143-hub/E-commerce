import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiDownload, FiTruck } from 'react-icons/fi';
import './OrdersUi.css';

const OrdersUi = () => {
  const orders = useSelector((state) => state.orders.orders);
  const navigate = useNavigate();
  const [expandedOrder, setExpandedOrder] = useState(null);

  const getOrderStatus = (index) => {
    const statuses = ['Delivered', 'Processing', 'Shipped', 'Pending'];
    return statuses[index % statuses.length];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'status-delivered';
      case 'Shipped':
        return 'status-shipped';
      case 'Processing':
        return 'status-processing';
      default:
        return 'status-pending';
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-header">
          <button className="back-link" onClick={() => navigate('/products')}>
            <FiArrowLeft /> Back to Shopping
          </button>
          <h1>My Orders</h1>
        </div>

        <div className="empty-orders">
          <div className="empty-icon">📦</div>
          <p className="empty-text">You haven't placed any orders yet</p>
          <p className="empty-subtext">Start shopping to make your first purchase</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      {/* Header */}
      <div className="orders-header">
        <button className="back-link" onClick={() => navigate('/products')}>
          <FiArrowLeft /> Back to Shopping
        </button>
        <h1>My Orders</h1>
        <div className="orders-count">{orders.length} order{orders.length !== 1 ? 's' : ''}</div>
      </div>

      <div className="orders-container">
        {orders.map((order, index) => {
          const status = getOrderStatus(index);
          const isExpanded = expandedOrder === index;
          const orderDate = new Date(order.date || new Date().getTime());

          return (
            <div className="order-card fade-in" key={index}>
              {/* Order Header */}
              <div 
                className="order-header"
                onClick={() => setExpandedOrder(isExpanded ? null : index)}
              >
                <div className="order-info-main">
                  <div className="order-id-section">
                    <p className="order-id">Order #{String(index + 1).padStart(4, '0')}</p>
                    <time className="order-date">
                      {orderDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                  </div>

                  <div className="order-status-section">
                    <span className={`order-status ${getStatusColor(status)}`}>
                      <FiTruck className="status-icon" />
                      {status}
                    </span>
                    <p className="order-total">${order.total.toFixed(2)}</p>
                  </div>
                </div>

                <button 
                  className={`expand-btn ${isExpanded ? 'expanded' : ''}`}
                  aria-label="Expand order details"
                >
                  ▼
                </button>
              </div>

              {/* Order Details */}
              {isExpanded && (
                <div className="order-details">
                  {/* Payment Info */}
                  <div className="order-section">
                    <h4 className="section-label">Payment Method</h4>
                    <p className="section-content">{order.paymentMode || 'Not specified'}</p>
                  </div>

                  {/* Items */}
                  <div className="order-section">
                    <h4 className="section-label">Items Ordered</h4>
                    <div className="order-items-list">
                      {order.items.map((item, itemIdx) => {
                        const imgSrc =
                          item.image ||
                          item.thumbnail ||
                          (Array.isArray(item.images) ? item.images[0] : item.images) ||
                          'https://via.placeholder.com/60';

                        return (
                          <div className="order-item" key={itemIdx}>
                            <img
                              src={imgSrc}
                              alt={item.title}
                              className="order-item-img"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/60';
                              }}
                            />
                            <div className="order-item-info">
                              <p className="item-title">{item.title}</p>
                              <p className="item-qty">Qty: {item.quantity || 1}</p>
                            </div>
                            <p className="item-price">
                              ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="order-section">
                    <div className="order-summary">
                      <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${(order.total * 0.909).toFixed(2)}</span>
                      </div>
                      <div className="summary-row">
                        <span>Tax (10%)</span>
                        <span>${(order.total * 0.091).toFixed(2)}</span>
                      </div>
                      <div className="summary-divider"></div>
                      <div className="summary-row total-row">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="order-actions">
                    <button className="btn btn-secondary btn-sm">
                      <FiDownload /> Download Invoice
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate('/products')}
                    >
                      Shop Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersUi;



