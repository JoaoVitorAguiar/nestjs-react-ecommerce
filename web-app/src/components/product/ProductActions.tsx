import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"

import type { ProductDetails } from "@/types/ProductDetails"
import { useCart } from "@/hooks/useCart"

type Props = {
    product: ProductDetails
}

export default function ProductActions({ product }: Props) {
    const { addToCart } = useCart()

    const [quantity, setQuantity] = useState(1)

    function decrease() {
        setQuantity(q => Math.max(1, q - 1))
    }

    function increase() {
        setQuantity(q => q + 1)
    }

    function handleAddToCart() {
        if (quantity > product.stock) {
            toast.error(`Only ${product.stock} units available in stock`)
            return
        }
        addToCart(product, quantity)
    }

    return (
        <div className="flex flex-col gap-4">

            <div className="flex items-center gap-4">

                <button
                    onClick={decrease}
                    className="px-3 py-1 bg-surface rounded hover:bg-primary/20"
                >
                    -
                </button>

                <span className="font-medium">
                    {quantity}
                </span>

                <button
                    onClick={increase}
                    className="px-3 py-1 bg-surface rounded hover:bg-primary/20"
                >
                    +
                </button>

            </div>

            <Button onClick={handleAddToCart}>
                Add to cart
            </Button>

        </div>
    )
}
