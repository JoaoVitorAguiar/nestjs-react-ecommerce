import type { CartItem } from "@/types/CartItem"
import * as cartService from "@/services/cart.service"
import { localStorageService } from "@/services/local-storage.service"

export async function initializeCart(isAuthenticated: boolean): Promise<CartItem[]> {
    const localCart = localStorageService.cart.get() as CartItem[]

    if (!isAuthenticated) {
        return localCart
    }

    const serverCart = await cartService.getCart()

    if (serverCart.length > 0) {
        return serverCart
    }

    if (localCart.length > 0) {
        const synced = await cartService.syncCart(localCart)
        localStorageService.cart.remove()
        return synced
    }

    return []
}
