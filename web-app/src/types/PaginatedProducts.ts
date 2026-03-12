import type { Product } from "./Product"

export type PaginatedProducts = {
    items: Product[]
    page: number
    limit: number
    total: number
    totalPages: number
}
