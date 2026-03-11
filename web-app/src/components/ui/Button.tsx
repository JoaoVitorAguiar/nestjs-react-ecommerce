type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary"
}

export function Button({ variant = "primary", className = "", ...props }: Props) {

  const variants = {
    primary: "bg-primary text-white hover:opacity-90",
    secondary: "bg-surface border border-white/10 hover:border-primary"
  }

  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium transition cursor-pointer ${variants[variant]} ${className}`}
      {...props}
    />
  )
}