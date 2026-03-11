import { createContext } from "react"
import type { CartItem } from "@/types/CartItem"
import type { Product } from "@/types/Product"

export type CartContextType = {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number) => Promise<void>
  removeFromCart: (productId: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
}

export const CartContext = createContext<CartContextType | null>(null)
