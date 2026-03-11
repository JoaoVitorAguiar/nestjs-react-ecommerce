import { authService } from "@/services/auth.service"
import { createContext, useEffect, useState } from "react"
import type { ReactNode } from "react"


type AuthContextType = {
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const token = authService.getToken()

        if (token) {
            setIsAuthenticated(true)
        }
    }, [])

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