import { Logo } from "./Logo"
import { NavLinks } from "./NavLinks"
import { UserMenu } from "./UserMenu"

export function Navbar() {
    return (
        <header className="border-b border-white/10 bg-surface/60 backdrop-blur">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">

                <Logo />

                <div className="flex items-center gap-8">
                    <NavLinks />
                    <UserMenu />
                </div>

            </div>
        </header>
    )
}