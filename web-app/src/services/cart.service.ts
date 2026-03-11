import { api } from "./api"
import type { CartItem } from "@/types/CartItem"

export type AddCartItemPayload = {
    productId: number
    quantity: number
}

export type UpdateCartItemPayload = {
    quantity: number
}

type RawCartItem = {
    productId: number
    title: string
    price: number
    quantity: number
    thumbnail: string
}

function mapCartItems(items: RawCartItem[]): CartItem[] {
    return items.map(item => ({
        product: {
            id: item.productId,
            title: item.title,
            price: item.price,
            rating: 0,
            thumbnail: item.thumbnail
        },
        quantity: item.quantity
    }))
}

export async function getCart(): Promise<CartItem[]> {
    const response = await api.get("/cart")

    return mapCartItems(response.data.items)
}

export async function addCartItem(dto: AddCartItemPayload): Promise<CartItem[]> {
    const response = await api.post("/cart/items", dto)

    return mapCartItems(response.data.items)
}

export async function syncCart(items: CartItem[]): Promise<CartItem[]> {
    const payload = items.map(i => ({
        productId: i.product.id,
        quantity: i.quantity
    }))

    const response = await api.post("/cart/sync", {
        items: payload
    })

    return mapCartItems(response.data.items)
}

export async function updateCartItem(
    productId: number,
    dto: UpdateCartItemPayload
): Promise<CartItem[]> {

    const response = await api.patch(`/cart/items/${productId}`, dto)

    return mapCartItems(response.data.items)
}

export async function removeCartItem(productId: number): Promise<CartItem[]> {
    const response = await api.delete(`/cart/items/${productId}`)

    return mapCartItems(response.data.items)
}

export async function clearCart(): Promise<void> {
    await api.delete("/cart")
}
