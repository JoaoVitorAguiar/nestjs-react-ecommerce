import { useEffect, useState } from "react"
import type { ReactNode } from "react"

import type { CartItem } from "@/types/CartItem"
import type { Product } from "@/types/Product"
import { useAuth } from "@/hooks/useAuth"
import { CartContext } from "./cart-context"
import { toast } from "sonner"
import { initializeCart } from "@/services/cart-initialization.service"
import { createCartStrategy } from "@/services/cart-strategy.service"

export function CartProvider({ children }: { children: ReactNode }) {

  const [items, setItems] = useState<CartItem[]>([])
  const { isAuthenticated } = useAuth()
  const strategy = createCartStrategy(isAuthenticated)

  useEffect(() => {
    void (async () => {
      try {
        const initialItems = await initializeCart(isAuthenticated)
        setItems(initialItems)
      } catch {
        setItems([])
        toast.error("Could not load cart. Try again.")
      }
    })()
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

    try {
      await strategy.addItem(product.id, quantity, updated)
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

    try {
      await strategy.updateItem(productId, quantity, updated)
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

    try {
      await strategy.removeItem(productId, updated)
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

    try {
      await strategy.clear()
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
