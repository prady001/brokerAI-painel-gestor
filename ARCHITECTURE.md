# Arquitetura — Painel do Gestor

## Visão geral do sistema

```
┌─────────────────────────────────────────────────────────┐
│                    BrokerAI (backend)                   │
│                   FastAPI — porta 8000                  │
│                                                         │
│  /auth/login       ← valida credenciais, seta cookie   │
│  /auth/logout      ← remove cookie                     │
│  /dashboard/*      ← rotas de leitura (JWT cookie)     │
│  /admin/*          ← rotas internas (token estático)   │
│  /webhook/*        ← recebe mensagens WhatsApp          │
│                                                         │
│  PostgreSQL 16 ← clientes, apólices, sinistros          │
│  Redis 7       ← estado das conversas ativas            │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP (servidor→servidor)
                           │ sem CORS, sem expor URL
┌──────────────────────────▼──────────────────────────────┐
│              Painel do Gestor (este projeto)             │
│              Next.js 14 App Router — porta 3000          │
│                                                         │
│  middleware.ts      ← verifica cookie, redireciona      │
│  app/api/auth/*     ← Route Handlers BFF (proxy login)  │
│  app/login/         ← formulário (Client Component)     │
│  app/dashboard/     ← métricas (Server Component)       │
│  app/clients/       ← lista e detalhe (Server Component)│
│  app/agent-status/  ← status Redis (Server Component)   │
│  lib/api.ts         ← fetch autenticado do servidor     │
│  lib/types.ts       ← tipos TypeScript do backend       │
└─────────────────────────────────────────────────────────┘
          ▲
          │ HTTP (browser→Next.js, same-origin)
┌─────────┴───────────────────────────────────────────────┐
│                      Browser                            │
│  Cookie httpOnly: access_token=<JWT>                    │
│  (inacessível ao JavaScript — protegido contra XSS)     │
└─────────────────────────────────────────────────────────┘
```

---

## Decisões arquiteturais

### DA-01 — Cookie httpOnly em vez de localStorage

**Decisão:** O JWT é armazenado em cookie `httpOnly`, não em `localStorage`.

**Motivo:** O painel exibe dados sensíveis (CPF, sinistros, renovações). `localStorage` é acessível a qualquer JavaScript na página — uma dependência npm comprometida ou XSS exporia o token e todos os dados. Cookie `httpOnly` é invisível ao JavaScript.

**Consequência:** O login não pode ser feito diretamente do browser para o FastAPI (cross-origin com cookie). Usa-se um Route Handler Next.js como BFF (Backend-for-Frontend) que recebe as credenciais, chama o FastAPI, e repassa o `Set-Cookie` para o browser.

### DA-02 — Server Components para fetch de dados

**Decisão:** Todas as telas que buscam dados são Server Components. Client Components apenas para interatividade (busca, formulários).

**Motivo:** Server Components chamam o FastAPI diretamente (servidor para servidor), sem CORS, sem expor a URL interna do backend, e sem passar o token pelo browser. A URL `FASTAPI_URL` nunca tem prefixo `NEXT_PUBLIC_`.

**Consequência:** `loading.tsx` e `error.tsx` por rota para tratamento automático com Suspense.

### DA-03 — Estado de busca/paginação na URL

**Decisão:** A busca e paginação usam `searchParams` da URL como fonte de verdade, não `useState`.

**Motivo:** URLs são compartilháveis, o back/forward do browser funciona corretamente, e Server Components recebem `searchParams` nativamente sem JavaScript extra.

**Consequência:** O componente de busca é Client Component com `useRouter().push()` + debounce. A tabela em si é Server Component.

### DA-04 — Rota `/clients/{id}/full` — 1 request para tudo

**Decisão:** A tela de detalhe do cliente usa uma única rota que retorna cliente + apólices + sinistros + renovações.

**Motivo:** Evita coordenar 4 `Promise.all` no frontend, simplifica o código e melhora a performance percebida.

**Consequência:** O backend usa `selectinload` do SQLAlchemy para carregar os relacionamentos em queries separadas mas sem N+1.

### DA-05 — Separação `/admin` vs `/dashboard` no backend

**Decisão:** Duas prefixos separados no FastAPI:
- `/admin/*` → token Bearer estático, para automações internas
- `/dashboard/*` → JWT em cookie, para o corretor humano

**Motivo:** Mecanismos de autenticação distintos para contextos distintos. Token estático (sem expiração) é adequado para machine-to-machine. JWT com expiração é necessário para sessão humana via browser.

---

## Fluxo de autenticação

```
1. Corretor acessa /dashboard
   → middleware.ts verifica cookie access_token
   → cookie ausente → redirect para /login

2. Corretor submete o formulário de login
   → POST /api/auth/login (Route Handler Next.js)
   → Route Handler chama POST http://fastapi:8000/auth/login
   → FastAPI valida usuário/senha (bcrypt + hmac.compare_digest)
   → FastAPI responde com Set-Cookie: access_token=<JWT>; HttpOnly; SameSite=Lax
   → Route Handler repassa o Set-Cookie para o browser
   → Browser armazena o cookie (inacessível ao JS)
   → Frontend redireciona para /dashboard

3. Corretor acessa /dashboard
   → middleware.ts verifica cookie → presente → passa
   → Server Component renderiza
   → lib/api.ts lê cookie via cookies() de next/headers
   → fetch para FastAPI com Cookie: access_token=<JWT>
   → FastAPI valida JWT, retorna dados
   → Server Component renderiza com os dados

4. Corretor faz logout
   → POST /api/auth/logout (Route Handler)
   → Route Handler remove o cookie
   → Redirect para /login
```

---

## Estrutura de componentes

```
app/dashboard/page.tsx (Server Component)
  └── <StatCard /> — card de métrica (Server Component)
  └── <ExpiryAlert /> — lista de vencimentos (Server Component)

app/clients/page.tsx (Server Component)
  └── <SearchInput /> — busca com debounce ("use client")
  └── <ClientTable /> — tabela de resultados (Server Component)
  └── <Pagination /> — paginação ("use client")

app/clients/[id]/page.tsx (Server Component)
  └── <PolicyList /> — lista de apólices (Server Component)
  └── <ClaimList /> — lista de sinistros (Server Component)
  └── <RenewalList /> — lista de renovações (Server Component)

app/agent-status/page.tsx (Server Component)
  └── Listas de conversas ativas (Server Component)
```

**Regra:** Um componente só usa `"use client"` se precisar de `useState`, `useEffect`, `useRouter`, eventos de mouse/teclado. Tudo que só exibe dados é Server Component.

---

## Camada de dados

```
Server Component
  │
  ▼
lib/api.ts
  apiFetch<T>(path)
    │ lê cookies() de next/headers
    │ injeta Cookie: access_token=<JWT>
    │ fetch para FASTAPI_URL (env var privada)
    ▼
  FastAPI /dashboard/*
    │ verifica JWT do cookie
    │ consulta PostgreSQL
    ▼
  Dados tipados (lib/types.ts)
```

---

## Variáveis de ambiente

| Variável | Escopo | Descrição |
|---|---|---|
| `FASTAPI_URL` | Servidor (sem NEXT_PUBLIC_) | URL interna do backend FastAPI |

**Apenas uma variável.** Não há segredos de autenticação no frontend — o JWT é gerenciado pelo backend.

---

## Índices de banco necessários (migration 0002 no backend)

O backend precisa criar estes índices antes do painel funcionar com boa performance:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX ix_policies_status ON policies (status);
CREATE INDEX ix_clients_phone ON clients (phone_whatsapp);
CREATE INDEX ix_clients_full_name_trgm ON clients USING gin (full_name gin_trgm_ops);
```

Sem esses índices, a busca por nome e a query de summary farão sequential scan.

---

## CORS

O FastAPI precisa de:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,  # necessário para cookies
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
```

**Atenção:** `allow_credentials=True` + `allow_origins=["*"]` é inválido — o browser rejeita. Sempre especificar origens explicitamente.
