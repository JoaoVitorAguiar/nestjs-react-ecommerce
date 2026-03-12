# FluxStore API

Backend da aplicacao FluxStore, construido com NestJS.

## Responsabilidades

- autenticacao de usuarios (cadastro, login, validacao JWT)
- integracao com API externa de catalogo (DummyJSON)
- CRUD de carrinho por usuario

## Tecnologias

- NestJS
- TypeScript
- MongoDB + Mongoose
- JWT
- bcrypt
- class-validator / class-transformer
- Jest

## Arquitetura e padroes

- Arquitetura modular do NestJS:
  - `AuthModule`
  - `CatalogModule`
  - `CartModule`
- Inversao de dependencia e DI nativa do Nest
- DTOs para contrato e validacao de payload
- Guard (`AuthGuard`) para rotas autenticadas
- Service layer para regras de negocio
- Integracao com API externa isolada em `CatalogService`

## Endpoints principais

### Auth

- `POST /auth/sign-up`
- `POST /auth/sign-in`
- `GET /auth/me` (Bearer token)

### Catalog

- `GET /catalog?page=1&limit=12`
- `GET /catalog/:id`

### Cart

- `GET /cart`
- `POST /cart/items`
- `PATCH /cart/items/:productId`
- `DELETE /cart/items/:productId`
- `DELETE /cart`
- `POST /cart/sync`

## Variaveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.sample .env
```

Variaveis:

```env
PORT=8080
JWT_SECRET=change-me
JWT_EXPIRES_IN=1h
BCRYPT_ROUNDS=10
MONGO_URI=mongodb://root:root@localhost:27017/ecommerce?authSource=admin
CATALOG_API_URL=https://dummyjson.com
CORS_ORIGINS=http://localhost:5173
```

## Scripts

```bash
npm run start:dev
npm run build
npm run lint
npm run test
npm run test:e2e
```

## Testes

Arquivos de teste relevantes:

- `src/auth/auth.service.spec.ts`
- `src/auth/auth.controller.spec.ts`
- `src/catalog/catalog.service.spec.ts`
- `src/catalog/catalog.controller.spec.ts`
- `src/cart/cart.service.spec.ts`
- `src/cart/cart.controller.spec.ts`
- `test/app.e2e-spec.ts`

## Estrutura de pastas

```text
api/src
├── auth/
│   ├── dto/
│   ├── entities/
│   ├── guards/
│   └── interfaces/
├── cart/
│   ├── dto/
│   └── entities/
├── catalog/
│   └── dto/
└── config/
```
