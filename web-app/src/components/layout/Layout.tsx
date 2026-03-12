import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"

export default function Layout() {
    return (
        <div className="min-h-screen bg-background text-text">

            <Navbar />

            <main className="layout-shell py-6">
                <Outlet />
            </main>

        </div>
    )
}
