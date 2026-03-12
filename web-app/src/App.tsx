import { BrowserRouter, Routes, Route } from "react-router-dom"

import Catalog from "@/pages/CatalogPage"
import Login from "@/pages/LoginPage"
import Layout from "@/components/layout/Layout"
import ProductPage from "@/pages/ProductPage"
import Register from "@/pages/RegisterPage"
import CartPage from "@/pages/CartPage"
import { CartProvider } from "./context/CartContext"
import { AuthProvider } from "./context/AuthContext"
import NotFound from "./errors/NotFound"
import { ErrorBoundary } from "./errors/ErrorBoundary"
import { Toaster } from "sonner"


export default function App() {
  return (
    <>
      <BrowserRouter>
        <ErrorBoundary>

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

              <Route path="*" element={<NotFound />} />
            </Routes>

          </AuthProvider>

        </ErrorBoundary>
      </BrowserRouter>

      <Toaster richColors position="top-right" />
    </>
  )
}
