type Props = React.InputHTMLAttributes<HTMLInputElement>

export function Input({ className = "", ...props }: Props) {
    return (
        <input
            className={`w-full px-3 py-2 rounded-lg bg-surface border border-white/10 focus:border-primary outline-none transition ${className}`}
            {...props}
        />
    )
}