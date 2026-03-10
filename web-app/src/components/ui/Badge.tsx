type Props = {
    children: React.ReactNode
    variant?: "primary" | "secondary"
}

export function Badge({ children, variant = "primary" }: Props) {

    const variants = {
        primary: "bg-primary text-white",
        secondary: "bg-secondary text-black"
    }

    return (
        <span
            className={`px-2 py-1 text-xs rounded-md font-medium ${variants[variant]}`}
        >
            {children}
        </span>
    )
}