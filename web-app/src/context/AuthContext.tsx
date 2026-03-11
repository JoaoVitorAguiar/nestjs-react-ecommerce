import { authService } from "@/services/auth.service"
import { useState } from "react"
import type { ReactNode } from "react"
import { AuthContext } from "./auth-context"

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(authService.getToken()))

    async function login(email: string, password: string) {
        await authService.login({ email, password })

        setIsAuthenticated(true)
    }

    function logout() {
        authService.logout()
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
