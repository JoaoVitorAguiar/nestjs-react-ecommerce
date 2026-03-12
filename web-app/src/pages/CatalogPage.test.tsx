import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CatalogPage from './CatalogPage'
import { getProducts } from '@/services/product.service'
import { ProductsProvider } from '@/context/ProductsContext'

vi.mock('@/services/product.service', () => ({
  getProducts: vi.fn(),
}))

const mockedGetProducts = vi.mocked(getProducts)

function renderCatalogPage() {
  return render(
    <ProductsProvider>
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    </ProductsProvider>,
  )
}

describe('CatalogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows loading first and then renders products from service', async () => {
    mockedGetProducts.mockResolvedValue({
      items: [
        {
          id: 1,
          title: 'Phone',
          price: 999,
          rating: 4.5,
          thumbnail: 'phone.jpg',
        },
        {
          id: 2,
          title: 'Mouse',
          price: 49,
          rating: 4.1,
          thumbnail: 'mouse.jpg',
        },
      ],
      page: 1,
      limit: 12,
      total: 2,
      totalPages: 1,
    })

    renderCatalogPage()

    expect(screen.getByText('Loading products...')).toBeInTheDocument()

    expect(await screen.findByRole('heading', { name: 'Catalog' })).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByText('Mouse')).toBeInTheDocument()
    expect(mockedGetProducts).toHaveBeenCalledTimes(1)
    expect(mockedGetProducts).toHaveBeenCalledWith({ page: 1, limit: 12 })
  })

  it('requests products only once on mount', async () => {
    mockedGetProducts.mockResolvedValue({
      items: [],
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 1,
    })

    renderCatalogPage()

    await screen.findByRole('heading', { name: 'Catalog' })

    expect(mockedGetProducts).toHaveBeenCalledTimes(1)
  })

  it('handles service error, logs it and leaves catalog rendered without items', async () => {
    const error = new Error('network failure')
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockedGetProducts.mockRejectedValue(error)

    renderCatalogPage()

    expect(await screen.findByRole('heading', { name: 'Catalog' })).toBeInTheDocument()

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith('Error loading products:', error)
    })

    expect(screen.queryByAltText('Phone')).not.toBeInTheDocument()
  })
})
