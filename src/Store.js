import { configureStore } from "@reduxjs/toolkit";
import ProductsReducer from "./Slices/ProductsSlice.js";
import CartReducer from "./Slices/CartSlice.js";
import WishListReducer from "./Slices/WishlistSlice.js";
import AuthReducer from "./Slices/AuthSlice.js";
import OrdersReducer from "./Slices/OrdersSlice.js";


var Store = configureStore({
    reducer : {
        products : ProductsReducer,
        cart : CartReducer,
            wishlist : WishListReducer,
        auth : AuthReducer,
        orders: OrdersReducer
    }
})

export default Store 