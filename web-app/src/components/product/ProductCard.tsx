import { Link } from "react-router-dom"
import { Card } from "@/components/ui/Card"
import { Rating } from "@/components/ui/Rating"
import type { Product } from "@/types/Product"

type Props = {
    product: Product
}

export function ProductCard({ product }: Props) {
    return (
        <Link to={`/product/${product.id}`} className="h-full">

            <Card className="flex flex-col h-full gap-3 hover:scale-[1.02] transition cursor-pointer">

                <div className="aspect-square overflow-hidden rounded-lg bg-surface">

                    <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover"
                    />

                </div>

                <div className="flex flex-col flex-1 gap-2">

                    <h3 className="font-semibold line-clamp-2 min-h-12">
                        {product.title}
                    </h3>

                    <Rating value={product.rating} />

                    <p className="font-medium text-primary mt-auto">
                        ${product.price}
                    </p>

                </div>

            </Card>

        </Link>
    )
}