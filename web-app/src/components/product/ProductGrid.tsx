import type { Product } from "@/types/Product"
import { ProductCard } from "./ProductCard"

type Props = {
    products: Product[]
}

export function ProductGrid({ products }: Props) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                />
            ))}
        </div>
    )
}