import { useEffect } from "react"
import { ProductGrid } from "@/components/product/ProductGrid"
import { useProducts } from "@/hooks/useProducts"
import { Button } from "@/components/ui/Button"

export default function CatalogPage() {
    const {
        products,
        page,
        totalPages,
        total,
        hasNextPage,
        hasPreviousPage,
        nextPage,
        previousPage,
        isLoading,
        isError,
        error
    } = useProducts()

    useEffect(() => {
        if (isError && error) {
            console.error("Error loading products:", error)
        }
    }, [isError, error])

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <p>Loading products...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8">

            <h1 className="text-2xl font-bold">
                Catalog
            </h1>

            <ProductGrid products={products} />

            <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages} - {total} items
                </p>

                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        onClick={previousPage}
                        disabled={!hasPreviousPage}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={nextPage}
                        disabled={!hasNextPage}
                    >
                        Next
                    </Button>
                </div>
            </div>

        </div>
    )
} 
