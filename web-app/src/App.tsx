import { BrowserRouter, Routes, Route } from "react-router-dom"

import Catalog from "@/pages/Catalog"
import Cart from "@/pages/Cart"
import Login from "@/pages/Login"
import Layout from "@/components/layout/Layout"
import ProductPage from "@/pages/ProductPage"
import { CartProvider } from "./context/CartContext"


export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route element={
          <CartProvider>
            <Layout />
          </CartProvider>
        }>

          <Route path="/" element={<Catalog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Route>

      </Routes>

    </BrowserRouter>
  )
}