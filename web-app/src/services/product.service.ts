import { api } from "./api"
import type { Product } from "@/types/Product"

export async function getProducts(): Promise<Product[]> {
    const response = await api.get("/catalog")
    return response.data
}