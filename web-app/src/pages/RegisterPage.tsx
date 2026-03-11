import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/Button"
import { authService } from "@/services/auth.service"
import { registerSchema, type RegisterFormData } from "./register.schema"

export default function RegisterPage() {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    })

    async function onSubmit(data: RegisterFormData) {
        try {
            await authService.register(data)

            navigate("/login")
        } catch {
            alert("Error creating account")
        }
    }

    return (
        <div className="min-h-screen bg-background text-text flex items-center justify-center px-4">

            <div className="w-full max-w-md border rounded-xl p-8 flex flex-col gap-6 shadow-sm">

                <h1 className="text-2xl font-bold text-center">
                    Create Account
                </h1>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">
                            Name
                        </label>

                        <input
                            {...register("name")}
                            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                        {errors.name && (
                            <span className="text-red-500 text-sm">
                                {errors.name.message}
                            </span>
                        )}
                    </div>

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
                        {isSubmitting ? "Creating..." : "Create account"}
                    </Button>

                </form>

                <p className="text-sm text-center text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-primary font-medium hover:underline"
                    >
                        Login
                    </Link>
                </p>

            </div>

        </div>
    )
}
