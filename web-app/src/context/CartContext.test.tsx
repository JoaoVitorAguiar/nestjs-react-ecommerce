import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider } from './CartContext'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import * as cartService from '@/services/cart.service'
import type { Product } from '@/types/Product'
import type { CartItem } from '@/types/CartItem'

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/services/cart.service', () => ({
  getCart: vi.fn(),
  addCartItem: vi.fn(),
  syncCart: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
  clearCart: vi.fn(),
}))

const mockedUseAuth = vi.mocked(useAuth)

const productA: Product = {
  id: 1,
  title: 'Phone',
  price: 100,
  rating: 4.5,
  thumbnail: 'phone.jpg',
}

const productB: Product = {
  id: 2,
  title: 'Mouse',
  price: 50,
  rating: 4.1,
  thumbnail: 'mouse.jpg',
}

const cartWithProductA = (quantity: number): CartItem[] => [
  { product: productA, quantity },
]

function CartConsumer() {
  const { items, addToCart, updateQuantity, removeFromCart, clearCart } = useCart()
  const qtyA = items.find((i) => i.product.id === 1)?.quantity ?? 0

  return (
    <div>
      <span data-testid="count">{items.length}</span>
      <span data-testid="qty-a">{qtyA}</span>
      <button onClick={() => void addToCart(productA, 2)}>add-a</button>
      <button onClick={() => void addToCart(productB, 1)}>add-b</button>
      <button onClick={() => void updateQuantity(1, 5)}>update-a</button>
      <button onClick={() => void removeFromCart(1)}>remove-a</button>
      <button onClick={() => void clearCart()}>clear</button>
    </div>
  )
}

function renderCartProvider() {
  return render(
    <CartProvider>
      <CartConsumer />
    </CartProvider>,
  )
}

describe('CartContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('loads cart from localStorage when user is not authenticated', async () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false } as ReturnType<typeof useAuth>)
    localStorage.setItem('cart', JSON.stringify(cartWithProductA(3)))

    renderCartProvider()

    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('1')
      expect(screen.getByTestId('qty-a')).toHaveTextContent('3')
    })

    expect(cartService.getCart).not.toHaveBeenCalled()
    expect(cartService.syncCart).not.toHaveBeenCalled()
  })

  it('loads server cart when authenticated and local cart is empty', async () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: true } as ReturnType<typeof useAuth>)
    vi.mocked(cartService.getCart).mockResolvedValue(cartWithProductA(2))

    renderCartProvider()

    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('1')
      expect(screen.getByTestId('qty-a')).toHaveTextContent('2')
    })

    expect(cartService.getCart).toHaveBeenCalledTimes(1)
    expect(cartService.syncCart).not.toHaveBeenCalled()
  })

  it('syncs local cart when authenticated and clears localStorage', async () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: true } as ReturnType<typeof useAuth>)
    localStorage.setItem('cart', JSON.stringify(cartWithProductA(1)))
    vi.mocked(cartService.getCart).mockResolvedValue([])
    vi.mocked(cartService.syncCart).mockResolvedValue(cartWithProductA(4))

    renderCartProvider()

    await waitFor(() => {
      expect(cartService.syncCart).toHaveBeenCalledWith(cartWithProductA(1))
      expect(screen.getByTestId('qty-a')).toHaveTextContent('4')
    })

    expect(localStorage.getItem('cart')).toBeNull()
    expect(cartService.getCart).toHaveBeenCalledTimes(1)
  })

  it('keeps server cart and does not sync local cart when server already has items', async () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: true } as ReturnType<typeof useAuth>)
    localStorage.setItem('cart', JSON.stringify(cartWithProductA(1)))
    vi.mocked(cartService.getCart).mockResolvedValue(cartWithProductA(2))

    renderCartProvider()

    await waitFor(() => {
      expect(screen.getByTestId('qty-a')).toHaveTextContent('2')
    })

    expect(cartService.syncCart).not.toHaveBeenCalled()
  })

  it('adds item as guest, merges quantity and persists in localStorage', async () => {
    const user = userEvent.setup()
    mockedUseAuth.mockReturnValue({ isAuthenticated: false } as ReturnType<typeof useAuth>)
    localStorage.setItem('cart', JSON.stringify(cartWithProductA(1)))

    renderCartProvider()

    await waitFor(() => {
      expect(screen.getByTestId('qty-a')).toHaveTextContent('1')
    })

    await user.click(screen.getByRole('button', { name: 'add-a' }))

    await waitFor(() => {
      expect(screen.getByTestId('qty-a')).toHaveTextContent('3')
    })

    expect(cartService.addCartItem).not.toHaveBeenCalled()
    expect(localStorage.getItem('cart')).toEqual(JSON.stringify(cartWithProductA(3)))
  })

  it('adds item as authenticated user and sends request to API', async () => {
    const user = userEvent.setup()
    mockedUseAuth.mockReturnValue({ isAuthenticated: true } as ReturnType<typeof useAuth>)
    vi.mocked(cartService.getCart).mockResolvedValue([])
    vi.mocked(cartService.addCartItem).mockResolvedValue(cartWithProductA(2))

    renderCartProvider()

    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('0')
    })

    await user.click(screen.getByRole('button', { name: 'add-a' }))

    await waitFor(() => {
      expect(screen.getByTestId('qty-a')).toHaveTextContent('2')
    })

    expect(cartService.addCartItem).toHaveBeenCalledWith({
      productId: 1,
      quantity: 2,
    })
  })

  it('updates quantity as guest and persists updated cart', async () => {
    const user = userEvent.setup()
    mockedUseAuth.mockReturnValue({ isAuthenticated: false } as ReturnType<typeof useAuth>)
    localStorage.setItem('cart', JSON.stringify(cartWithProductA(2)))

    renderCartProvider()

    await user.click(screen.getByRole('button', { name: 'update-a' }))

    await waitFor(() => {
      expect(screen.getByTestId('qty-a')).toHaveTextContent('5')
    })

    expect(cartService.updateCartItem).not.toHaveBeenCalled()
    expect(localStorage.getItem('cart')).toEqual(JSON.stringify(cartWithProductA(5)))
  })

  it('removes and clears cart as authenticated user with API calls', async () => {
    const user = userEvent.setup()
    mockedUseAuth.mockReturnValue({ isAuthenticated: true } as ReturnType<typeof useAuth>)
    vi.mocked(cartService.getCart).mockResolvedValue(cartWithProductA(2))

    renderCartProvider()

    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('1')
    })

    await user.click(screen.getByRole('button', { name: 'remove-a' }))
    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('0')
    })
    expect(cartService.removeCartItem).toHaveBeenCalledWith(1)

    await user.click(screen.getByRole('button', { name: 'add-b' }))
    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('1')
    })

    await user.click(screen.getByRole('button', { name: 'clear' }))
    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('0')
    })
    expect(cartService.clearCart).toHaveBeenCalledTimes(1)
  })
})
