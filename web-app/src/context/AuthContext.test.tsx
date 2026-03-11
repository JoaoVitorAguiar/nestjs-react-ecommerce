import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from './AuthContext'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/auth.service'

vi.mock('@/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    getToken: vi.fn(),
  },
}))

function AuthConsumer() {
  const { isAuthenticated, login, logout } = useAuth()

  return (
    <div>
      <span data-testid="auth-state">
        {isAuthenticated ? 'authenticated' : 'guest'}
      </span>
      <button onClick={() => login('user@mail.com', '123456')}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts as guest when no token exists', async () => {
    vi.mocked(authService.getToken).mockReturnValue(null)

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    )

    expect(screen.getByTestId('auth-state')).toHaveTextContent('guest')
    expect(authService.getToken).toHaveBeenCalledTimes(1)
  })

  it('hydrates as authenticated when token exists', async () => {
    vi.mocked(authService.getToken).mockReturnValue('token-123')

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('authenticated')
    })
  })

  it('logs in through authService and updates state', async () => {
    const user = userEvent.setup()
    vi.mocked(authService.getToken).mockReturnValue(null)
    vi.mocked(authService.login).mockResolvedValue('token-123')

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'login' }))

    expect(authService.login).toHaveBeenCalledWith({
      email: 'user@mail.com',
      password: '123456',
    })
    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('authenticated')
    })
  })

  it('logs out through authService and updates state', async () => {
    const user = userEvent.setup()
    vi.mocked(authService.getToken).mockReturnValue('token-123')

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('authenticated')
    })

    await user.click(screen.getByRole('button', { name: 'logout' }))

    expect(authService.logout).toHaveBeenCalledTimes(1)
    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('guest')
    })
  })
})
