import { createContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

import * as cartService from "@/services/cart.service"

import type { CartItem } from "@/types/CartItem"
import type { Product } from "@/types/Product"
import { useAuth } from "@/hooks/useAuth"

type CartContextType = {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
}

export const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {

  const [items, setItems] = useState<CartItem[]>([])
  const { isAuthenticated } = useAuth()

  useEffect(() => {

    const local = JSON.parse(localStorage.getItem("cart") || "[]")

    setItems(Array.isArray(local) ? local : [])

    if (isAuthenticated) {
      loadServerCart()
    }

  }, [isAuthenticated])


  async function loadServerCart() {

    const serverCart = await cartService.getCart()

    setItems(serverCart)

    localStorage.setItem("cart", JSON.stringify(serverCart))
  }


  async function addToCart(product: Product, quantity = 1) {

    setItems(prev => {

      const existing = prev.find(i => i.product.id === product.id)

      let updated

      if (existing) {
        updated = prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      } else {
        updated = [...prev, { product, quantity }]
      }

      localStorage.setItem("cart", JSON.stringify(updated))

      return updated
    })

    if (isAuthenticated) {
      await cartService.addCartItem({
        productId: product.id,
        quantity
      })
    }
  }


  async function updateQuantity(productId: number, quantity: number) {

    setItems(prev => {

      const updated = prev.map(i =>
        i.product.id === productId
          ? { ...i, quantity }
          : i
      )

      localStorage.setItem("cart", JSON.stringify(updated))

      return updated
    })

    if (isAuthenticated) {
      await cartService.updateCartItem(productId, { quantity })
    }
  }


  async function removeFromCart(productId: number) {

    setItems(prev => {

      const updated = prev.filter(i => i.product.id !== productId)

      localStorage.setItem("cart", JSON.stringify(updated))

      return updated
    })

    if (isAuthenticated) {
      await cartService.removeCartItem(productId)
    }
  }


  async function clearCart() {

    setItems([])

    localStorage.removeItem("cart")

    if (isAuthenticated) {
      await cartService.clearCart()
    }
  }


  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}