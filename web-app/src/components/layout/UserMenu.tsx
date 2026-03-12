import { Link, useNavigate } from "react-router-dom"
import { UserRound } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "../ui/Button"

type UserMenuProps = {
    className?: string
    mobile?: boolean
    onAction?: () => void
}

export function UserMenu({ className = "", mobile = false, onAction }: UserMenuProps) {

    const { isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate("/")
        onAction?.()
    }

    if (!isAuthenticated) {
        return (
            <Link
                to="/login"
                className={`flex items-center gap-2 hover:text-primary transition ${mobile ? "rounded-lg border border-white/10 px-3 py-2.5 hover:border-primary/60 hover:bg-white/5" : ""} ${className}`}
                onClick={onAction}
            >
                <UserRound size={20} />
                Login
            </Link>
        )
    }

    return (
        <div
            className={`flex items-center gap-2 ${mobile ? "justify-between rounded-lg border border-white/10 px-3 py-2.5" : ""} ${className}`}
        >

            <div className="flex items-center gap-2">
                <UserRound size={20} />
                {mobile && <span>Account</span>}
            </div>

            <Button
                variant="secondary"
                className={mobile ? "px-3 py-1.5 text-sm" : ""}
                onClick={handleLogout}
            >
                Logout
            </Button>

        </div>
    )
}
