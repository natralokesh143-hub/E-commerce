import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductsUi from "./Ui/ProductsUi";
import CartUi from "./Ui/CartUi";
import WishlistUi from "./Ui/WishlistUi";
import "./App.css";
import AuthUi from "./Ui/AuthUi";
import ProfileUi from "./Ui/ProfileUi";
import OrdersUi from "./Ui/OrdersUi";
import ProductDetails from "./pages/ProductDetails"

const App = () => {
  return (
    <BrowserRouter>
      <div>

        <Routes>
          <Route path="/" element = {<AuthUi/>}/>
          <Route path="/products" element={<ProductsUi />} />
          <Route path="/cart" element={<CartUi />} />
          <Route path="/wishlist" element={<WishlistUi />} />
          <Route path="/orders" element={<OrdersUi />} />
          <Route path="/profile" element = {<ProfileUi/>}/>
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;