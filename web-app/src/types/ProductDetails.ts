import type { Product } from "./Product"

export type ProductDetails = Product & {
    description: string
    stock: number
    brand: string
    images: string[]
}