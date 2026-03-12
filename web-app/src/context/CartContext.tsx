import { useEffect, useState } from "react"
import type { ReactNode } from "react"

import * as cartService from "@/services/cart.service"

import type { CartItem } from "@/types/CartItem"
import type { Product } from "@/types/Product"
import { useAuth } from "@/hooks/useAuth"
import { CartContext } from "./cart-context"
import { toast } from "sonner"

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
      // Defer state update to the microtask queue to avoid ESLint set-state-in-effect warning
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

    const previous = items
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
      toast.success(
        quantity > 1
          ? `${quantity}x ${product.title} added to cart`
          : `${product.title} added to cart`
      )
      return
    }

    try {
      await cartService.addCartItem({
        productId: product.id,
        quantity
      })
      toast.success(
        quantity > 1
          ? `${quantity}x ${product.title} added to cart`
          : `${product.title} added to cart`
      )
    } catch {
      setItems(previous)
      toast.error("Could not add item to cart. Try again.")
    }
  }

  async function updateQuantity(productId: number, quantity: number) {

    const previous = items
    const updated = items.map(i =>
      i.product.id === productId
        ? { ...i, quantity }
        : i
    )

    setItems(updated)

    if (!isAuthenticated) {
      saveLocalCart(updated)
      return
    }

    try {
      await cartService.updateCartItem(productId, { quantity })
    } catch {
      setItems(previous)
      toast.error("Could not update item quantity. Try again.")
    }
  }

  async function removeFromCart(productId: number) {

    const previous = items
    const itemToRemove = items.find(i => i.product.id === productId)
    const updated = items.filter(i => i.product.id !== productId)

    setItems(updated)

    if (!isAuthenticated) {
      saveLocalCart(updated)
      if (itemToRemove) {
        toast.success(`${itemToRemove.product.title} removed from cart`)
      }
      return
    }

    try {
      await cartService.removeCartItem(productId)
      if (itemToRemove) {
        toast.success(`${itemToRemove.product.title} removed from cart`)
      }
    } catch {
      setItems(previous)
      toast.error("Could not remove item from cart. Try again.")
    }
  }

  async function clearCart() {

    const previous = items

    if (items.length === 0) {
      toast.message("Your cart is already empty")
      return
    }

    setItems([])

    if (!isAuthenticated) {
      localStorage.removeItem("cart")
      toast.success("Cart cleared")
      return
    }

    try {
      await cartService.clearCart()
      toast.success("Cart cleared")
    } catch {
      setItems(previous)
      toast.error("Could not clear cart. Try again.")
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
