import { Button } from "@/components/ui/Button"

type Props = {
    quantity: number
    onIncrease: () => void
    onDecrease: () => void
}

export function QuantitySelector({ quantity, onIncrease, onDecrease }: Props) {
    return (
        <div className="flex items-center gap-2">

            <Button
                variant="secondary"
                onClick={onDecrease}
                className="px-3 py-1"
            >
                -
            </Button>

            <span className="text-sm font-medium w-6 text-center">
                {quantity}
            </span>

            <Button
                variant="secondary"
                onClick={onIncrease}
                className="px-3 py-1"
            >
                +
            </Button>

        </div>
    )
}