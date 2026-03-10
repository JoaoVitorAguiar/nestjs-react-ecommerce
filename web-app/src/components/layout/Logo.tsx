import { Link } from "react-router-dom"

export function Logo() {
    return (
        <Link
            to="/"
            className="text-lg md:text-xl font-bold text-secondary hover:text-primary transition"
        >
            FluxStore
        </Link>
    )
}