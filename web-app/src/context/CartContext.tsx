import { useEffect, useState } from "react"
import type { ReactNode } from "react"

import * as cartService from "@/services/cart.service"

import type { CartItem } from "@/types/CartItem"
import type { Product } from "@/types/Product"
import { useAuth } from "@/hooks/useAuth"
import { CartContext } from "./cart-context"

export function CartProvider({ children }: { children: ReactNode }) {

  const [items, setItems] = useState<CartItem[]>([])
  const { isAuthenticated } = useAuth()

  function saveLocalCart(cart: CartItem[]) {
    localStorage.setItem("cart", JSON.stringify(cart))
  }

  function loadLocalCart(): CartItem[] {
    const local = JSON.parse(localStorage.getItem("cart") || "[]")
    return Array.isArray(local) ? local : []
  }

  async function loadServerCart() {
    const serverCart = await cartService.getCart()
    setItems(serverCart)
  }

  async function syncLocalCart(localCart: CartItem[]) {

    const serverCart = await cartService.syncCart(localCart)

    setItems(serverCart)

    localStorage.removeItem("cart")
  }

  useEffect(() => {

    const localCart = loadLocalCart()

    if (!isAuthenticated) {
      queueMicrotask(() => {
        setItems(localCart)
      })
      return
    }

    if (localCart.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void syncLocalCart(localCart)
      return
    }

    void loadServerCart()

  }, [isAuthenticated])

  async function addToCart(product: Product, quantity = 1) {

    const existing = items.find(i => i.product.id === product.id)

    let updated: CartItem[]

    if (existing) {
      updated = items.map(i =>
        i.product.id === product.id
          ? { ...i, quantity: i.quantity + quantity }
          : i
      )
    } else {
      updated = [...items, { product, quantity }]
    }

    setItems(updated)

    if (!isAuthenticated) {
      saveLocalCart(updated)
    }

    if (isAuthenticated) {
      await cartService.addCartItem({
        productId: product.id,
        quantity
      })
    }
  }

  async function updateQuantity(productId: number, quantity: number) {

    const updated = items.map(i =>
      i.product.id === productId
        ? { ...i, quantity }
        : i
    )

    setItems(updated)

    if (!isAuthenticated) {
      saveLocalCart(updated)
    }

    if (isAuthenticated) {
      await cartService.updateCartItem(productId, { quantity })
    }
  }

  async function removeFromCart(productId: number) {

    const updated = items.filter(i => i.product.id !== productId)

    setItems(updated)

    if (!isAuthenticated) {
      saveLocalCart(updated)
    }

    if (isAuthenticated) {
      await cartService.removeCartItem(productId)
    }
  }

  async function clearCart() {

    setItems([])

    if (!isAuthenticated) {
      localStorage.removeItem("cart")
    }

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
