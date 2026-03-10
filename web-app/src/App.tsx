import { BrowserRouter, Routes, Route } from "react-router-dom"
import Catalog from "@/pages/Catalog"
import Cart from "@/pages/Cart"
import Login from "@/pages/Login"
import { Layout } from "@/components/layout/Layout"


export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>

    </BrowserRouter>
  )
}