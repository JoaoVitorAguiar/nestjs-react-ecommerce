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
        console.log(response.data)

        const { access_token } = response.data

        localStorage.setItem("token", access_token)

        return access_token
    }

    logout() {
        localStorage.removeItem("token")
    }

    getToken() {
        return localStorage.getItem("token")
    }
}

export const authService = new AuthService()