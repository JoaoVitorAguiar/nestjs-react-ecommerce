import { BrowserRouter, Routes, Route } from "react-router-dom"

import Catalog from "@/pages/CatalogPage"
import Login from "@/pages/LoginPage"
import Layout from "@/components/layout/Layout"
import ProductPage from "@/pages/ProductPage"
import Register from "@/pages/RegisterPage"
import CartPage from "@/pages/CartPage"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "./context/AuthContext"


export default function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <Routes>

          <Route
            element={
              <CartProvider>
                <Layout />
              </CartProvider>
            }
          >
            <Route path="/" element={<Catalog />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


        </Routes>

      </AuthProvider>

    </BrowserRouter>
  )
}