# Painel do Gestor — BrokerAI

## O que é este projeto

Frontend Next.js 14 do painel web para o corretor de seguros visualizar sua base de clientes, apólices, sinistros e renovações. Somente leitura, usuário único.

**Plano completo:** `C:\Users\mateu\Documents\brokerAI\docs\plans\2026-03-10-feat-painel-gestor-plan.md`

---

## Backend

O backend FastAPI roda em `http://localhost:8000` (via `docker compose up api` no projeto `brokerAI`).

### Rotas disponíveis (implementadas no backend)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/login` | Login — retorna cookie `httpOnly` |
| `POST` | `/auth/logout` | Remove o cookie |
| `GET` | `/dashboard/summary` | 7 métricas agregadas |
| `GET` | `/dashboard/clients` | Lista clientes (params: `skip`, `limit`, `search`) |
| `GET` | `/dashboard/clients/{id}/full` | Cliente + apólices + sinistros + renovações |
| `GET` | `/dashboard/agent-status` | Conversas ativas no Redis |

**Nota:** O backend precisa ser implementado primeiro (rotas `/auth` e `/dashboard` ainda não existem). O plano completo descreve tudo.

### Autenticação

O login envia credenciais para `/auth/login`, que seta um cookie `httpOnly` chamado `access_token`. Todas as rotas `/dashboard/*` leem esse cookie automaticamente.

**NUNCA salvar o token em `localStorage`** — vulnerável a XSS. Usar cookie `httpOnly`.

---

## Stack

- **Next.js 14** — App Router
- **TypeScript**
- **TailwindCSS**
- **Português pt-BR** em toda a interface

---

## Estrutura de arquivos a criar

```
src/
  app/
    layout.tsx
    page.tsx                    # redirect → /dashboard
    api/
      auth/
        login/route.ts          # BFF: chama FastAPI, repassa Set-Cookie httpOnly
        logout/route.ts         # limpa cookie
    login/
      page.tsx                  # formulário de login (Client Component)
    dashboard/
      layout.tsx                # sidebar + header
      page.tsx                  # métricas (Server Component)
      loading.tsx               # skeleton automático
      error.tsx                 # error boundary
    clients/
      page.tsx                  # tabela com busca (Server Component)
      loading.tsx
      error.tsx
      [id]/
        page.tsx                # detalhe do cliente (Server Component)
        loading.tsx
    agent-status/
      page.tsx
  lib/
    api.ts                      # fetch tipado para Server Components
    types.ts                    # tipos espelho dos schemas Python do backend
  middleware.ts                 # protege rotas — lê cookie (Edge compatible)
  components/
    StatCard.tsx
    ClientTable.tsx
    PolicyList.tsx
    ClaimList.tsx
    RenewalList.tsx
    ExpiryAlert.tsx
```

---

## Autenticação — Route Handler BFF

O frontend NUNCA chama o FastAPI diretamente para login. Usa um Route Handler como proxy:

```typescript
// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server"
const API = process.env.FASTAPI_URL ?? "http://localhost:8000"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const upstream = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}))
    return NextResponse.json(err, { status: upstream.status })
  }
  // Repassa o Set-Cookie httpOnly do FastAPI para o browser
  const res = NextResponse.json({ ok: true })
  const setCookie = upstream.headers.get("set-cookie")
  if (setCookie) res.headers.set("set-cookie", setCookie)
  return res
}
```

---

## Middleware (proteção de rotas)

```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  // Cookie httpOnly — disponível no Edge Runtime via req.cookies
  const token = req.cookies.get("access_token")
  const isLoginPage = req.nextUrl.pathname === "/login"
  if (!token && !isLoginPage) return NextResponse.redirect(new URL("/login", req.url))
  if (token && isLoginPage) return NextResponse.redirect(new URL("/dashboard", req.url))
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/clients/:path*", "/agent-status/:path*", "/login"],
}
```

---

## API helper (Server Components)

```typescript
// src/lib/api.ts
import { cookies } from "next/headers"
import type { ClientFull, ClientResponse, DashboardSummary } from "./types"

const API = process.env.FASTAPI_URL ?? "http://localhost:8000"

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get("access_token")?.value
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Cookie: token ? `access_token=${token}` : "",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  })
  if (res.status === 401) throw new Error("UNAUTHORIZED")
  if (!res.ok) throw new Error(`API ${res.status} ${path}`)
  return res.json() as Promise<T>
}

export const api = {
  summary: () => apiFetch<DashboardSummary>("/dashboard/summary"),
  clients: (params?: { skip?: number; search?: string }) => {
    const qs = new URLSearchParams()
    if (params?.skip) qs.set("skip", String(params.skip))
    if (params?.search) qs.set("search", params.search)
    return apiFetch<ClientResponse[]>(`/dashboard/clients?${qs}`)
  },
  clientFull: (id: string) => apiFetch<ClientFull>(`/dashboard/clients/${id}/full`),
}
```

---

## Tipos TypeScript (`src/lib/types.ts`)

```typescript
// ATENÇÃO: Python Decimal serializa como string no JSON
// premium_amount deve ser string | null, nunca number

export interface ClientResponse {
  id: string
  full_name: string
  cpf_cnpj: string | null
  phone_whatsapp: string | null
  email: string | null
  birth_date: string | null
  created_at: string
}

export interface PolicyResponse {
  id: string
  client_id: string
  policy_number: string
  type: "auto" | "life" | "home" | "travel" | "business" | null
  status: "active" | "expired" | "cancelled"
  premium_amount: string | null  // Decimal Python → string JSON
  start_date: string | null
  end_date: string | null
}

export interface ClaimResponse {
  id: string
  policy_id: string | null
  client_id: string
  type: string | null
  severity: "simple" | "grave" | null
  status: "open" | "in_progress" | "waiting_insurer" | "escalated" | "closed"
  description: string | null
  occurrence_date: string | null
  opened_at: string | null
}

export interface RenewalResponse {
  id: string
  policy_id: string
  client_id: string
  expiry_date: string
  status: "pending" | "contacted" | "confirmed" | "refused" | "no_response" | "lost"
  contact_count: number
  last_contact_at: string | null
  client_intent: string | null
}

export interface ClientFull extends ClientResponse {
  policies: PolicyResponse[]
  claims: ClaimResponse[]
  renewals: RenewalResponse[]
}

export interface DashboardSummary {
  total_clients: number
  active_policies: number
  pending_renewals: number
  open_claims: number
  policies_expiring_30d: number
  policies_expiring_60d: number
  policies_expiring_90d: number
}
```

---

## `.env.local`

```env
FASTAPI_URL=http://localhost:8000
```

`FASTAPI_URL` sem `NEXT_PUBLIC_` — usada apenas no servidor. Nunca exposta ao browser.

---

## Inicialização

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

---

## Regras de implementação

1. **Idioma:** português pt-BR em toda a interface (labels, mensagens, textos)
2. **Autenticação:** cookie `httpOnly` via Route Handler BFF — nunca `localStorage`
3. **Fetch de dados:** Server Components chamam `api.*` diretamente — Client Components só para interatividade (busca, paginação)
4. **Paginação:** estado na URL via `searchParams` (não `useState`)
5. **Loading/Error:** criar `loading.tsx` e `error.tsx` por rota — Suspense automático do Next.js
6. **Tipos:** sempre tipado — sem `any` implícito nas respostas da API

---

## Telas e o que exibir

### `/dashboard`
- 4 cards: total de clientes, apólices ativas, renovações pendentes, sinistros em aberto
- Lista de apólices vencendo: 🔴 ≤30d | 🟡 31–60d | 🟢 61–90d

### `/clients`
- Tabela: Nome | CPF (mascarado) | Telefone | Data de cadastro
- Busca por nome ou telefone com debounce 300ms via URL `?search=`
- Paginação 50 por página

### `/clients/[id]`
- Dados cadastrais do cliente
- Lista de apólices (número, tipo, vigência, status)
- Lista de sinistros (tipo, severidade, status)
- Lista de renovações (status, intenção, último contato)

### `/agent-status`
- Conversas de sinistro ativas (telefone, quando foi a última mensagem, TTL restante)
- Onboardings em andamento (telefone, TTL restante)
