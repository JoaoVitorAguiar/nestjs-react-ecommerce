const TOKEN_KEY = "token"
const CART_KEY = "cart"

export const localStorageService = {
    token: {
        get() {
            return localStorage.getItem(TOKEN_KEY)
        },
        set(value: string) {
            localStorage.setItem(TOKEN_KEY, value)
        },
        remove() {
            localStorage.removeItem(TOKEN_KEY)
        }
    },
    cart: {
        get() {
            const local = JSON.parse(localStorage.getItem(CART_KEY) || "[]")
            return Array.isArray(local) ? local : []
        },
        set(value: unknown) {
            localStorage.setItem(CART_KEY, JSON.stringify(value))
        },
        remove() {
            localStorage.removeItem(CART_KEY)
        }
    }
}
