import { Link, useNavigate } from "react-router-dom"
import { User } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "../ui/Button"

export function UserMenu() {

    const { isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate("/")
    }

    if (!isAuthenticated) {
        return (
            <Link
                to="/login"
                className="flex items-center gap-2 hover:text-primary transition"
            >
                <User size={20} />
                Login
            </Link>
        )
    }

    return (
        <div className="flex items-center gap-2">

            <User size={20} />

            <Button
                variant="secondary"
                onClick={handleLogout}
            >
                Logout
            </Button>

        </div>
    )
}