import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import type { Product } from "@/types/Product"

type Props = {
    product: Product
}

export function ProductCard({ product }: Props) {
    return (
        <Card className="flex flex-col gap-3">

            <div className="w-full h-40 overflow-hidden rounded-lg bg-surface flex items-center justify-center">

                <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover"
                />

            </div>

            <h3 className="font-semibold line-clamp-2">
                {product.title}
            </h3>

            <p className="text-sm opacity-70">
                ${product.price}
            </p>

            <Button className="mt-auto">
                Add to cart
            </Button>

        </Card>
    )
}