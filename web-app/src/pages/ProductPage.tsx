import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { api } from "@/services/api"

import { Rating } from "@/components/ui/Rating"
import ProductActions from "@/components/product/ProductActions"
import type { ProductDetails } from "@/types/ProductDetails"
import ProductGallery from "@/components/product/ProductGallery"

export default function ProductPage() {
    const { id } = useParams()

    const [product, setProduct] = useState<ProductDetails | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await api.get(`/catalog/${id}`)
                setProduct(response.data)
            } catch (error) {
                console.error("Error loading product", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    if (loading) {
        return <p className="p-10">Loading product...</p>
    }

    if (!product) {
        return <p className="p-10">Product not found</p>
    }

    return (
        <div className="container mx-auto px-4 py-10">

            <div className="grid lg:grid-cols-2 gap-12">

                <div className="flex flex-col gap-4">

                    <ProductGallery
                        images={product.images}
                        title={product.title}
                    />

                </div>

                <div className="flex flex-col gap-6">

                    <h1 className="text-3xl font-bold">
                        {product.title}
                    </h1>

                    <div className="flex items-center gap-3">
                        <Rating value={product.rating} />
                        <span className="text-sm text-muted-foreground">
                            {product.rating.toFixed(1)} rating
                        </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Brand: <span className="font-medium">{product.brand}</span>
                    </p>

                    <p className="text-3xl font-semibold text-primary">
                        ${product.price}
                    </p>

                    <p className="text-sm">
                        {product.stock > 0 ? (
                            <span className="text-green-600 font-medium">
                                In stock ({product.stock})
                            </span>
                        ) : (
                            <span className="text-red-600 font-medium">
                                Out of stock
                            </span>
                        )}
                    </p>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-semibold">
                            Description
                        </h2>

                        <p className="text-muted-foreground leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <ProductActions product={product} />

                </div>

            </div>

        </div>
    )
}