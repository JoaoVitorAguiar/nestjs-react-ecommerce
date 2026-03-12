import { useState } from "react"
import type { ReactNode } from "react"
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"
import { getProducts } from "@/services/product.service"
import { ProductsContext } from "./products-context"

const PRODUCTS_STALE_TIME_MS = 1000 * 60 * 5
const PRODUCTS_GC_TIME_MS = 1000 * 60 * 30
const PRODUCTS_RETRY_COUNT = 2
const PRODUCTS_RETRY_DELAY_MS = 250
const PRODUCTS_PER_PAGE = 12

function ProductsStateProvider({ children }: { children: ReactNode }) {
    const [page, setPage] = useState(1)
    const limit = PRODUCTS_PER_PAGE

    const query = useQuery({
        queryKey: ["products", page, limit],
        queryFn: () => getProducts({ page, limit }),
    })

    const totalPages = query.data?.totalPages ?? 1
    const total = query.data?.total ?? 0
    const hasPreviousPage = page > 1
    const hasNextPage = page < totalPages

    function goToPage(nextPage: number) {
        setPage(Math.max(1, Math.min(nextPage, totalPages)))
    }

    function nextPage() {
        goToPage(page + 1)
    }

    function previousPage() {
        goToPage(page - 1)
    }

    return (
        <ProductsContext.Provider
            value={{
                products: query.data?.items ?? [],
                page,
                limit,
                total,
                totalPages,
                hasNextPage,
                hasPreviousPage,
                setPage: goToPage,
                nextPage,
                previousPage,
                isLoading: query.isLoading,
                isError: query.isError,
                error: query.error,
                refetch: query.refetch,
            }}
        >
            {children}
        </ProductsContext.Provider>
    )
}

export function ProductsProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: PRODUCTS_STALE_TIME_MS,
                        gcTime: PRODUCTS_GC_TIME_MS,
                        retry: PRODUCTS_RETRY_COUNT,
                        retryDelay: PRODUCTS_RETRY_DELAY_MS,
                    },
                },
            }),
    )

    return (
        <QueryClientProvider client={queryClient}>
            <ProductsStateProvider>{children}</ProductsStateProvider>
        </QueryClientProvider>
    )
}
