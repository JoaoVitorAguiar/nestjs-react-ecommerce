import { Link } from "react-router-dom"
import { Button } from "@/components/ui/Button"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background text-text flex items-center justify-center px-4">

            <div className="flex flex-col items-center text-center gap-6">

                <h1 className="text-7xl font-bold">
                    404
                </h1>

                <p className="text-muted-foreground max-w-md">
                    The page you are looking for does not exist or may have been moved.
                </p>

                <Link to="/">
                    <Button>
                        Go back home
                    </Button>
                </Link>

            </div>

        </div>
    )
}