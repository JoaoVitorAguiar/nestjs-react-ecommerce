# FluxStore Web

Frontend da aplicacao FluxStore, construido com React + TypeScript.

## Responsabilidades

- interface de autenticacao (login e cadastro)
- listagem de catalogo com paginacao
- visualizacao de detalhe de produto
- gestao de carrinho para visitante e usuario autenticado

## Tecnologias

- React 19
- TypeScript
- Vite
- React Router
- Axios
- React Hook Form
- Zod
- TanStack Query
- Tailwind CSS
- Sonner (toasts)
- Vitest + Testing Library

## Contexts (state management)

### `AuthContext`

- guarda estado `isAuthenticated`
- expone `login` e `logout`
- persiste token no `localStorage`

### `ProductsContext`

- centraliza pagina atual e dados do catalogo
- usa TanStack Query para cache, retry e stale time
- expone navegacao de paginas (`nextPage`, `previousPage`, `setPage`)

### `CartContext`

- centraliza estado de itens do carrinho
- expone operacoes de CRUD (`addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`)
- aplica atualizacao otimista na UI
- usa estrategia local/remota conforme autenticacao

## Padroes de projeto aplicados

- Provider + custom hooks (`useAuth`, `useProducts`, `useCart`)
- Service layer para chamadas HTTP (`services/*`)
- Strategy pattern para carrinho:
  - `LocalCartStrategy`
  - `ServerCartStrategy`
- Separacao entre componentes de UI, layout e dominio
- Error Boundary para falhas de renderizacao

## Rotas

- `/` catalogo
- `/product/:id` detalhe do produto
- `/cart` carrinho
- `/login` login
- `/register` cadastro

## Variavel de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.sample .env
```

Exemplo:

```env
VITE_API_URL=http://localhost:8080
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run coverage
```

## Testes

Arquivos de teste atuais:

- `src/context/AuthContext.test.tsx`
- `src/context/CartContext.test.tsx`
- `src/pages/CatalogPage.test.tsx`
- `src/pages/CartPage.test.tsx`

## Estrutura de pastas

```text
web-app/src
├── components/
│   ├── cart/
│   ├── layout/
│   ├── product/
│   └── ui/
├── context/
├── errors/
├── hooks/
├── pages/
├── services/
├── test/
└── types/
```

## Placeholders de print

Os placeholders de screenshots ficam em:

- `../docs/screenshots/01-catalog.png`
- `../docs/screenshots/02-product-detail.png`
- `../docs/screenshots/03-cart.png`
- `../docs/screenshots/04-login.png`
- `../docs/screenshots/05-register.png`
