import { api } from "./api"
import type { Product } from "@/types/Product"
import type { PaginatedProducts } from "@/types/PaginatedProducts"

type GetProductsParams = {
    page: number
    limit: number
}

type RawPaginatedProducts = {
    items: Product[]
    page: number
    limit: number
    total: number
    totalPages: number
}

export async function getProducts({ page, limit }: GetProductsParams): Promise<PaginatedProducts> {
    const response = await api.get("/catalog", {
        params: { page, limit }
    })

    const data = response.data as RawPaginatedProducts

    if (!Array.isArray(data.items)) {
        throw new Error("Invalid catalog response: expected items array")
    }

    return {
        items: data.items,
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages
    }
}
