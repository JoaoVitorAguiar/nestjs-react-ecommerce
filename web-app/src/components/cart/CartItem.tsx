import { useContext } from "react"
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

            <img
                src={item.product.thumbnail}
                alt={item.product.title}
                className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-md"
            />

            <div className="flex flex-col flex-1 gap-1">

                <h2 className="font-semibold">
                    {item.product.title}
                </h2>

                <p className="text-sm text-muted-foreground">
                    ${item.product.price}
                </p>

                <QuantitySelector
                    quantity={item.quantity}
                    onIncrease={increase}
                    onDecrease={decrease}
                />

            </div>

            <Button
                variant="secondary"
                onClick={() => onRemove(item.product.id)}
            >
                Remove
            </Button>

        </Card>
    )
}