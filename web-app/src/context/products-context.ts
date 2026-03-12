import { createContext } from "react"
import type { Product } from "@/types/Product"

export type ProductsContextType = {
    products: Product[]
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    setPage: (page: number) => void
    nextPage: () => void
    previousPage: () => void
    isLoading: boolean
    isError: boolean
    error: Error | null
    refetch: () => Promise<unknown>
}

export const ProductsContext = createContext<ProductsContextType | null>(null)
