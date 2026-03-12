import { useState } from "react"
import { Menu, X } from "lucide-react"

import { Logo } from "./Logo"
import { NavLinks } from "./NavLinks"
import { UserMenu } from "./UserMenu"

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    function closeMobileMenu() {
        setIsMobileMenuOpen(false)
    }

    return (
        <header className="border-b border-white/10 bg-surface/60 backdrop-blur relative">
            <div className="layout-shell flex items-center justify-between py-4">

                <Logo />

                <button
                    type="button"
                    className="md:hidden inline-flex items-center justify-center rounded-lg border border-white/10 p-2 hover:border-primary transition"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-navigation"
                >
                    {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className="hidden md:flex items-center gap-8">
                    <NavLinks />
                    <UserMenu />
                </div>

            </div>

            {isMobileMenuOpen && (
                <div
                    id="mobile-navigation"
                    className="md:hidden border-t border-white/10"
                >
                    <div className="layout-shell flex flex-col gap-4 py-4">
                        <NavLinks
                            className="flex-col gap-3"
                            onNavigate={closeMobileMenu}
                        />
                        <UserMenu
                            mobile
                            onAction={closeMobileMenu}
                        />
                    </div>
                </div>
            )}
        </header>
    )
}
