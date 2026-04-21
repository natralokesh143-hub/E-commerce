import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { addToCart } from "../Slices/CartSlice"
import { toast } from "react-hot-toast"
import "./ProductDetails.css"


const ProductDetails = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { products } = useSelector((state) => state.products)

  const product = products.find((p) => p.id === Number(id))

  if (!product) {
    return <h2 className="not-found">Product not found</h2>
  }

  const handleCart = () => {
    dispatch(addToCart(product))
    toast.success("Added to cart")
  }

  return (
    <div className="product-details-page">

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="details-container">

        <div className="details-image">
          <img
            src={product.image || product.thumbnail || product.images?.[0]}
            alt={product.title}
          />
        </div>

        <div className="details-info">
          <h2>{product.title}</h2>

          {product.category && (
            <p className="details-category">{product.category}</p>
          )}

          <p className="details-price">
            ${product.price?.toFixed(2)}
          </p>

          <p className="details-description">
            {product.description}
          </p>

          {product.rating && (
            <p className="details-rating">
              ⭐ {typeof product.rating === "object"
                ? product.rating.rate
                : product.rating}
            </p>
          )}

          <button
            className="details-cart-btn"
            onClick={handleCart}
          >
            Add To Cart
          </button>

        </div>

      </div>
    </div>
  )
}

export default ProductDetails