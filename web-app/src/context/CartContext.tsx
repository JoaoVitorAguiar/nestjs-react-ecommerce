import type { CartItem } from "@/types/CartItem"
import type { Product } from "@/types/Product"
import { createContext, useEffect, useState, type ReactNode } from "react"

type CartContextType = {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: number) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  function addToCart(product: Product, quantity = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)

      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }

      return [...prev, { product, quantity }]
    })
  }

  function removeFromCart(productId: number) {
    setItems(prev => prev.filter(i => i.product.id !== productId))
  }

  function clearCart() {
    setItems([])
  }

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}