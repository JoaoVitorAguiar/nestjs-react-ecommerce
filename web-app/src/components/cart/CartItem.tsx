import { useContext } from "react"
import { Link } from "react-router-dom"
import { CartContext } from "@/context/CartContext"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { QuantitySelector } from "./QuantitySelector"

import type { CartItem as CartItemType } from "@/types/CartItem"

type Props = {
    item: CartItemType
    onRemove: (id: number) => void
}

export function CartItem({ item, onRemove }: Props) {

    const cart = useContext(CartContext)

    if (!cart) return null

    const { updateQuantity } = cart

    function increase() {
        updateQuantity(item.product.id, item.quantity + 1)
    }

    function decrease() {

        if (item.quantity <= 1) {
            onRemove(item.product.id)
            return
        }

        updateQuantity(item.product.id, item.quantity - 1)
    }

    return (
        <Card className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">

            <Link
                to={`/product/${item.product.id}`}
                className="flex gap-4 items-start sm:items-center flex-1 group"
            >

                <img
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-md"
                />

                <div className="flex flex-col gap-1">

                    <h2 className="font-semibold group-hover:underline">
                        {item.product.title}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        ${item.product.price}
                    </p>

                </div>

            </Link>

            <QuantitySelector
                quantity={item.quantity}
                onIncrease={increase}
                onDecrease={decrease}
            />

            <Button
                variant="secondary"
                onClick={() => onRemove(item.product.id)}
            >
                Remove
            </Button>

        </Card>
    )
}