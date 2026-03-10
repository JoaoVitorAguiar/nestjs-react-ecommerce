import { useEffect, useState } from "react"
import { ProductGrid } from "@/components/product/ProductGrid"
import type { Product } from "@/types/Product"
import { getProducts } from "@/services/product.service"

export default function CatalogPage() {

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await getProducts()
                setProducts(data)
            } catch (error) {
                console.error("Error loading products:", error)
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <p>Loading products...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8">

            <h1 className="text-2xl font-bold">
                Catalog
            </h1>

            <ProductGrid products={products} />

        </div>
    )
} 