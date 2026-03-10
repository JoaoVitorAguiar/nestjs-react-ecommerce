import { Link } from "react-router-dom"

export function NavLinks() {
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
                className="hover:text-primary transition"
            >
                Cart
            </Link>

        </nav>
    )
}