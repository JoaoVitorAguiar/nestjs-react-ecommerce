import { Link } from "react-router-dom"
import { Button } from "@/components/ui/Button"

export default function ErrorPage() {
    return (
        <div className="min-h-screen bg-background text-text flex items-center justify-center px-4">

            <div className="flex flex-col items-center text-center gap-6">

                <h1 className="text-6xl font-bold">
                    Something went wrong
                </h1>

                <p className="text-muted-foreground max-w-md">
                    An unexpected error occurred. Please try again or return to the homepage.
                </p>

                <div className="flex gap-4">

                    <Button onClick={() => window.location.reload()}>
                        Reload page
                    </Button>

                    <Link to="/">
                        <Button variant="secondary">
                            Go home
                        </Button>
                    </Link>

                </div>

            </div>

        </div>
    )
}