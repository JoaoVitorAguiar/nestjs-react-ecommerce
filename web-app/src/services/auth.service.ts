import { api } from "@/services/api"

type LoginPayload = {
    email: string
    password: string
}

type LoginResponse = {
    access_token: string
}

class AuthService {
    async login(data: LoginPayload) {
        const response = await api.post<LoginResponse>("/auth/sign-in", data)

        const { access_token } = response.data

        localStorage.setItem("token", access_token)

        return access_token
    }

    logout() {
        localStorage.removeItem("token")
        localStorage.removeItem("cart")
    }

    getToken() {
        return localStorage.getItem("token")
    }

    async register(data: { name: string; email: string; password: string }) {
        const response = await api.post("/auth/sign-up", data)
        return response.data
    }
}

export const authService = new AuthService()