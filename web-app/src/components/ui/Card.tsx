type Props = {
    children: React.ReactNode
    className?: string
}

export function Card({ children, className = "" }: Props) {
    return (
        <div
            className={`bg-surface border border-white/5 rounded-xl p-4 shadow-sm ${className}`}
        >
            {children}
        </div>
    )
}