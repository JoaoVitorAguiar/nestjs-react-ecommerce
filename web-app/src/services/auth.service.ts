import { api } from "@/services/api"
import { localStorageService } from "./local-storage.service"

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

        localStorageService.token.set(access_token)

        return access_token
    }

    logout() {
        localStorageService.token.remove()
        localStorageService.cart.remove()
    }

    getToken() {
        return localStorageService.token.get()
    }

    async register(data: { name: string; email: string; password: string }) {
        const response = await api.post("/auth/sign-up", data)
        return response.data
    }
}

export const authService = new AuthService()
