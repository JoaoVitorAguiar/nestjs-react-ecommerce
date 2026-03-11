import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/Button"
import { useAuth } from "@/hooks/useAuth"

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must have at least 6 characters")
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    })

    async function onSubmit(data: LoginFormData) {
        try {
            await login(data.email, data.password)

            navigate("/")
        } catch {
            alert("Invalid credentials")
        }
    }

    return (
        <div className="min-h-screen bg-background text-text flex items-center justify-center px-4">
            <div className="w-full max-w-md border rounded-xl p-8 flex flex-col gap-6 shadow-sm">

                <h1 className="text-2xl font-bold text-center">
                    Login
                </h1>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >

                    <div className="flex flex-col gap-1">

                        <label className="text-sm font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            {...register("email")}
                            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                        {errors.email && (
                            <span className="text-red-500 text-sm">
                                {errors.email.message}
                            </span>
                        )}

                    </div>

                    <div className="flex flex-col gap-1">

                        <label className="text-sm font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            {...register("password")}
                            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                        {errors.password && (
                            <span className="text-red-500 text-sm">
                                {errors.password.message}
                            </span>
                        )}

                    </div>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                    </Button>

                </form>

            </div>

        </div>
    )
}