import { useContext } from "react"

import { CartContext } from "@/context/cart-context"

import { Container } from "@/components/ui/Container"
import { CartItem } from "@/components/cart/CartItem"
import { CartSummary } from "@/components/cart/CartSummary"

export default function CartPage() {

    const cart = useContext(CartContext)

    if (!cart) {
        return <p className="p-10">Cart not available</p>
    }

    const { items, removeFromCart, clearCart } = cart

    if (items.length === 0) {
        return (
            <Container className="py-10">
                <p className="text-lg">Your cart is empty</p>
            </Container>
        )
    }

    const total = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    )

    return (
        <Container className="py-10">

            <h1 className="text-2xl md:text-3xl font-bold mb-8">
                Shopping Cart
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 flex flex-col gap-4">

                    {items.map(item => (
                        <CartItem
                            key={item.product.id}
                            item={item}
                            onRemove={removeFromCart}
                        />
                    ))}

                </div>

                <CartSummary
                    total={total}
                    onClear={clearCart}
                />

            </div>

        </Container>
    )
}
