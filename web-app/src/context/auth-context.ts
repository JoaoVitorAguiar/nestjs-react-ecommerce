import { createContext } from "react"

export type AuthContextType = {
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
