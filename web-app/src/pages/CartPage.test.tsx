import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import type { ContextType } from 'react'
import CartPage from './CartPage'
import { CartContext } from '@/context/cart-context'
import type { CartItem } from '@/types/CartItem'
import type { Product } from '@/types/Product'

type CartContextValue = NonNullable<ContextType<typeof CartContext>>

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

function createCartContextValue(items: CartItem[]): CartContextValue {
  return {
    items,
    addToCart: vi.fn().mockResolvedValue(undefined),
    removeFromCart: vi.fn().mockResolvedValue(undefined),
    updateQuantity: vi.fn().mockResolvedValue(undefined),
    clearCart: vi.fn().mockResolvedValue(undefined),
  }
}

function renderCartPage(contextValue?: CartContextValue) {
  const page = <CartPage />
  if (!contextValue) {
    return render(
      <MemoryRouter>
        {page}
      </MemoryRouter>,
    )
  }

  return render(
    <MemoryRouter>
      <CartContext.Provider value={contextValue}>{page}</CartContext.Provider>
    </MemoryRouter>,
  )
}

describe('CartPage', () => {
  it('shows fallback when CartContext is not available', () => {
    renderCartPage()

    expect(screen.getByText('Cart not available')).toBeInTheDocument()
  })

  it('shows empty cart state when there are no items', () => {
    renderCartPage(createCartContextValue([]))

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument()
  })

  it('renders items and order summary total', () => {
    const contextValue = createCartContextValue([
      { product: productA, quantity: 2 },
      { product: productB, quantity: 1 },
    ])

    renderCartPage(contextValue)

    expect(screen.getByRole('heading', { name: 'Shopping Cart' })).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByText('Mouse')).toBeInTheDocument()
    expect(screen.getByText('$250.00')).toBeInTheDocument()
  })

  it('calls removeFromCart when user clicks Remove', async () => {
    const user = userEvent.setup()
    const contextValue = createCartContextValue([{ product: productA, quantity: 2 }])

    renderCartPage(contextValue)

    await user.click(screen.getByRole('button', { name: 'Remove' }))

    expect(contextValue.removeFromCart).toHaveBeenCalledWith(1)
  })

  it('calls clearCart when user clicks Clear cart', async () => {
    const user = userEvent.setup()
    const contextValue = createCartContextValue([{ product: productA, quantity: 2 }])

    renderCartPage(contextValue)

    await user.click(screen.getByRole('button', { name: 'Clear cart' }))

    expect(contextValue.clearCart).toHaveBeenCalledTimes(1)
  })

  it('updates quantity when clicking + and - for quantity > 1', async () => {
    const user = userEvent.setup()
    const contextValue = createCartContextValue([{ product: productA, quantity: 2 }])

    renderCartPage(contextValue)

    await user.click(screen.getByRole('button', { name: '+' }))
    await user.click(screen.getByRole('button', { name: '-' }))

    expect(contextValue.updateQuantity).toHaveBeenCalledWith(1, 3)
    expect(contextValue.updateQuantity).toHaveBeenCalledWith(1, 1)
    expect(contextValue.removeFromCart).not.toHaveBeenCalled()
  })

  it('removes item when clicking - and quantity is 1', async () => {
    const user = userEvent.setup()
    const contextValue = createCartContextValue([{ product: productA, quantity: 1 }])

    renderCartPage(contextValue)

    await user.click(screen.getByRole('button', { name: '-' }))

    expect(contextValue.removeFromCart).toHaveBeenCalledWith(1)
    expect(contextValue.updateQuantity).not.toHaveBeenCalled()
  })
})
