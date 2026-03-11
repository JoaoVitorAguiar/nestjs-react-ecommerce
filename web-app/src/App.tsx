import { BrowserRouter, Routes, Route } from "react-router-dom"

import Catalog from "@/pages/CatalogPage"
import Cart from "@/pages/Cart"
import Login from "@/pages/LoginPage"
import Layout from "@/components/layout/Layout"
import ProductPage from "@/pages/ProductPage"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "./context/AuthContext"
import Register from "./pages/RegisterPage"


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
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductPage />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />


        </Routes>

      </AuthProvider>

    </BrowserRouter>
  )
}