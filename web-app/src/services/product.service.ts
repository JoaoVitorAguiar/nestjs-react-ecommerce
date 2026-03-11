import { api } from "./api"
import type { Product } from "@/types/Product"

export async function getProducts(): Promise<Product[]> {
    const response = await api.get("/catalog")

    if (!Array.isArray(response.data)) {
        throw new Error("Invalid catalog response: expected an array")
    }

    return response.data as Product[]
}
