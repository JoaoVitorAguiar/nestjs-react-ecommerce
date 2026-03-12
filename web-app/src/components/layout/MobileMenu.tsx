import { X } from "lucide-react"

import { NavLinks } from "./NavLinks"
import { UserMenu } from "./UserMenu"

type MobileMenuProps = {
    isOpen: boolean
    onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    if (!isOpen) {
        return null
    }

    return (
        <div
            id="mobile-navigation"
            className="md:hidden border-t border-white/10 px-4 pb-4"
        >
            <div className="mt-3 rounded-2xl border border-white/10 bg-surface/95 p-3 shadow-lg shadow-black/20">
                <div className="mb-3 flex items-center justify-between px-1">
                    <span className="text-xs uppercase tracking-[0.2em] text-white/60">
                        Navigation
                    </span>
                    <button
                        type="button"
                        className="rounded-md border border-white/10 p-1.5 text-white/80 hover:border-primary hover:text-primary transition"
                        onClick={onClose}
                        aria-label="Close navigation menu"
                    >
                        <X size={16} />
                    </button>
                </div>

                <NavLinks
                    className="flex-col gap-2 text-sm"
                    linkClassName="rounded-lg border border-white/10 px-3 py-2.5 hover:border-primary/60 hover:bg-white/5"
                    cartLinkClassName="rounded-lg border border-white/10 px-3 py-2.5 hover:border-primary/60 hover:bg-white/5 justify-between"
                    onNavigate={onClose}
                />

                <div className="my-3 h-px bg-white/10" />

                <UserMenu
                    mobile
                    onAction={onClose}
                />
            </div>
        </div>
    )
}
