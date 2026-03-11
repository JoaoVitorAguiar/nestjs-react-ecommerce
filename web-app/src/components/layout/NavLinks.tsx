import { Link } from "react-router-dom"
import { useContext } from "react"
import { ShoppingCart } from "lucide-react"

import { CartContext } from "@/context/cart-context"

export function NavLinks() {

    const cart = useContext(CartContext)

    const itemCount = cart?.items.length ?? 0

    return (
        <nav className="flex gap-4 md:gap-6 text-sm md:text-base">

            <Link
                to="/"
                className="hover:text-primary transition"
            >
                Catalog
            </Link>

            <Link
                to="/cart"
                className="flex items-center gap-2 hover:text-primary transition relative"
            >

                <ShoppingCart size={20} />

                Cart

                {itemCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                        {itemCount}
                    </span>
                )}

            </Link>

        </nav>
    )
}