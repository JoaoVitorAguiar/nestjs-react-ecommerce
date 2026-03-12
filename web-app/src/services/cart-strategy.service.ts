import type { CartItem } from "@/types/CartItem"
import * as cartService from "@/services/cart.service"
import { localStorageService } from "@/services/local-storage.service"

export interface CartStrategy {
    addItem(productId: number, quantity: number, updatedItems: CartItem[]): Promise<void>
    updateItem(productId: number, quantity: number, updatedItems: CartItem[]): Promise<void>
    removeItem(productId: number, updatedItems: CartItem[]): Promise<void>
    clear(): Promise<void>
}

class LocalCartStrategy implements CartStrategy {
    async addItem(_productId: number, _quantity: number, updatedItems: CartItem[]): Promise<void> {
        localStorageService.cart.set(updatedItems)
    }

    async updateItem(_productId: number, _quantity: number, updatedItems: CartItem[]): Promise<void> {
        localStorageService.cart.set(updatedItems)
    }

    async removeItem(_productId: number, updatedItems: CartItem[]): Promise<void> {
        localStorageService.cart.set(updatedItems)
    }

    async clear(): Promise<void> {
        localStorageService.cart.remove()
    }
}

class ServerCartStrategy implements CartStrategy {
    async addItem(productId: number, quantity: number): Promise<void> {
        await cartService.addCartItem({ productId, quantity })
    }

    async updateItem(productId: number, quantity: number): Promise<void> {
        await cartService.updateCartItem(productId, { quantity })
    }

    async removeItem(productId: number): Promise<void> {
        await cartService.removeCartItem(productId)
    }

    async clear(): Promise<void> {
        await cartService.clearCart()
    }
}

export function createCartStrategy(isAuthenticated: boolean): CartStrategy {
    return isAuthenticated
        ? new ServerCartStrategy()
        : new LocalCartStrategy()
}
