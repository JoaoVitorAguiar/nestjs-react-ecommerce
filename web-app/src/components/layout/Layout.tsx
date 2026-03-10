import { Navbar } from "./Navbar"

type Props = {
    children: React.ReactNode
}

export function Layout({ children }: Props) {
    return (
        <div className="min-h-screen bg-background text-text">

            <Navbar />

            <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6">
                {children}
            </main>

        </div>
    )
}