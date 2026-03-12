import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"

type Props = {
    total: number
    onClear: () => void
}

export function CartSummary({ total, onClear }: Props) {

    return (
        <Card className="flex flex-col gap-4 h-fit">

            <h2 className="text-lg md:text-xl font-semibold">
                Order Summary
            </h2>

            <div className="flex justify-between text-sm">
                <span>Total</span>
                <span className="font-semibold">
                    ${total.toFixed(2)}
                </span>
            </div>

            <Button
                className="w-full"
                onClick={() => toast.info("Checkout coming soon")}
            >
                Checkout
            </Button>

            <Button
                variant="secondary"
                className="w-full"
                onClick={onClear}
            >
                Clear cart
            </Button>

        </Card>
    )
}
