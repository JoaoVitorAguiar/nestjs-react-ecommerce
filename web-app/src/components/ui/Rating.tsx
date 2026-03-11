type Props = {
    value: number
    max?: number
}

export function Rating({ value, max = 5 }: Props) {
    const stars = []

    for (let i = 1; i <= max; i++) {
        stars.push(
            <span key={i}>
                {i <= Math.round(value) ? "★" : "☆"}
            </span>
        )
    }

    return (
        <div className="flex items-center gap-1 text-yellow-400 text-sm">
            {stars}
            <span className="text-xs text-gray-400 ml-1">
                ({value.toFixed(1)})
            </span>
        </div>
    )
}