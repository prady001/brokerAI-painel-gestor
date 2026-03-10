# Guia de Implementação — Painel do Gestor

## Pré-requisitos

1. **Backend rodando:** `cd C:\Users\mateu\Documents\brokerAI && docker compose up api`
2. **Node.js 20+** instalado
3. Esta pasta aberta no Claude Code

---

## Passo 0 — Inicializar o projeto Next.js

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

Responda ao prompt:
- ✅ TypeScript — Yes
- ✅ ESLint — Yes
- ✅ Tailwind CSS — Yes
- ✅ `src/` directory — Yes
- ✅ App Router — Yes
- ✅ import alias — Yes (`@/*`)

Depois:
```bash
npm install use-debounce  # para debounce na busca
```

Criar `.env.local`:
```env
FASTAPI_URL=http://localhost:8000
```

---

## Sequência de implementação

Implementar nesta ordem — cada passo depende do anterior.

### Passo 1 — Tipos TypeScript

Criar `src/lib/types.ts` com todos os tipos do backend.

**Ver:** CLAUDE.md → seção "Tipos TypeScript"

Ponto crítico: `premium_amount` é `string | null` (não `number`) porque Python Decimal serializa como string no JSON.

---

### Passo 2 — API helper

Criar `src/lib/api.ts` com as funções de fetch autenticado para Server Components.

**Ver:** CLAUDE.md → seção "API helper"

O helper lê o cookie `access_token` via `cookies()` de `next/headers` e o inclui no header `Cookie` da requisição para o FastAPI. Funciona apenas em Server Components e Route Handlers (não em Client Components).

---

### Passo 3 — Route Handlers de autenticação (BFF)

Criar dois Route Handlers:

**`src/app/api/auth/login/route.ts`**
- Recebe `{ username, password }` do formulário
- Chama `POST http://fastapi:8000/auth/login`
- Repassa o header `Set-Cookie` da resposta do FastAPI para o browser
- O browser armazena o cookie `httpOnly` automaticamente

**`src/app/api/auth/logout/route.ts`**
- Remove o cookie `access_token`

**Ver:** CLAUDE.md → seção "Autenticação — Route Handler BFF"

---

### Passo 4 — Middleware de proteção de rotas

Criar `src/middleware.ts`.

**Ver:** CLAUDE.md → seção "Middleware"

Regras:
- Sem cookie → redirect para `/login`
- Com cookie em `/login` → redirect para `/dashboard`
- Funciona no Edge Runtime (lê `req.cookies`, não `localStorage`)

---

### Passo 5 — Tela de login

Criar `src/app/login/page.tsx` como **Client Component** (`"use client"`).

**Comportamento:**
- Formulário com campos `username` e `password`
- Submit chama `POST /api/auth/login` (Route Handler local, não o FastAPI diretamente)
- Sucesso → `router.push("/dashboard")`
- Erro → exibe mensagem em pt-BR: "Usuário ou senha inválidos"

**Exemplo:**
```tsx
"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCarregando(true)
    setErro("")

    const form = new FormData(e.currentTarget)
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.get("username"),
        password: form.get("password"),
      }),
    })

    setCarregando(false)
    if (res.ok) {
      router.push("/dashboard")
      router.refresh()
    } else {
      setErro("Usuário ou senha inválidos")
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">BrokerAI</h1>
        <p className="text-gray-500 text-sm">Painel do Corretor</p>

        <div>
          <label className="block text-sm font-medium text-gray-700">Usuário</label>
          <input name="username" required className="mt-1 w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <input name="password" type="password" required className="mt-1 w-full border rounded-lg px-3 py-2" />
        </div>

        {erro && <p className="text-red-600 text-sm">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  )
}
```

---

### Passo 6 — Layout do dashboard

Criar `src/app/dashboard/layout.tsx` com sidebar e header.

**Navegação (sidebar):**
- Dashboard (`/dashboard`)
- Clientes (`/clients`)
- Status dos Agentes (`/agent-status`)
- Sair (chama `POST /api/auth/logout` → redirect `/login`)

O layout pode ser Client Component se tiver estado de colapso da sidebar.

---

### Passo 7 — Tela `/dashboard`

**`src/app/dashboard/page.tsx`** — Server Component:

```tsx
import { api } from "@/lib/api"

export default async function DashboardPage() {
  const summary = await api.summary()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard titulo="Clientes" valor={summary.total_clients} />
        <StatCard titulo="Apólices Ativas" valor={summary.active_policies} />
        <StatCard titulo="Renovações Pendentes" valor={summary.pending_renewals} cor="yellow" />
        <StatCard titulo="Sinistros em Aberto" valor={summary.open_claims} cor="red" />
      </div>

      {/* Apólices vencendo */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Apólices Vencendo</h2>
        <div className="space-y-2">
          <ExpiryRow label="Crítico (até 30 dias)" count={summary.policies_expiring_30d} cor="red" />
          <ExpiryRow label="Atenção (31–60 dias)" count={summary.policies_expiring_60d} cor="yellow" />
          <ExpiryRow label="Ok (61–90 dias)" count={summary.policies_expiring_90d} cor="green" />
        </div>
      </div>
    </div>
  )
}
```

**`src/app/dashboard/loading.tsx`** — skeleton automático:
```tsx
export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
```

**`src/app/dashboard/error.tsx`** — error boundary:
```tsx
"use client"
export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="text-center py-10">
      <p className="text-red-600">Erro ao carregar o painel: {error.message}</p>
      <button onClick={reset} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
        Tentar novamente
      </button>
    </div>
  )
}
```

---

### Passo 8 — Tela `/clients`

**`src/app/clients/page.tsx`** — Server Component:

```tsx
import { api } from "@/lib/api"
import { SearchInput } from "@/components/SearchInput"
import { Suspense } from "react"

interface Props {
  searchParams: Promise<{ search?: string; skip?: string }>
}

export default async function ClientsPage({ searchParams }: Props) {
  const params = await searchParams
  const skip = Number(params.skip ?? 0)
  const search = params.search ?? ""
  const clients = await api.clients({ skip, search })

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Clientes</h1>

      {/* SearchInput é Client Component — dentro de Suspense */}
      <Suspense>
        <SearchInput placeholder="Buscar por nome ou telefone..." />
      </Suspense>

      {/* Tabela */}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-4 py-3 font-medium text-gray-700">Nome</th>
            <th className="px-4 py-3 font-medium text-gray-700">CPF</th>
            <th className="px-4 py-3 font-medium text-gray-700">Telefone</th>
            <th className="px-4 py-3 font-medium text-gray-700">Cadastrado em</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(c => (
            <tr key={c.id} className="border-t hover:bg-gray-50 cursor-pointer">
              <td className="px-4 py-3">
                <a href={`/clients/${c.id}`} className="font-medium text-blue-600 hover:underline">
                  {c.full_name}
                </a>
              </td>
              <td className="px-4 py-3 font-mono text-gray-500">{maskCpf(c.cpf_cnpj)}</td>
              <td className="px-4 py-3">{c.phone_whatsapp ?? "—"}</td>
              <td className="px-4 py-3 text-gray-500">{formatDate(c.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="flex gap-2">
        {skip > 0 && (
          <a href={`/clients?skip=${skip - 50}${search ? `&search=${search}` : ""}`}
             className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            ← Anterior
          </a>
        )}
        {clients.length === 50 && (
          <a href={`/clients?skip=${skip + 50}${search ? `&search=${search}` : ""}`}
             className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Próxima →
          </a>
        )}
      </div>
    </div>
  )
}

function maskCpf(cpf: string | null): string {
  if (!cpf) return "—"
  return cpf.replace(/^(\d{3})\.\d{3}\.(\d{3})-(\d{2})$/, "***.$2-**")
    || cpf.slice(0, 3) + ".***.***-**"
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR")
}
```

**`src/components/SearchInput.tsx`** — Client Component com debounce:

```tsx
"use client"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

interface Props {
  placeholder?: string
}

export function SearchInput({ placeholder = "Buscar..." }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete("skip") // volta para a primeira página
    if (term) {
      params.set("search", term)
    } else {
      params.delete("search")
    }
    router.push(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <input
      type="search"
      placeholder={placeholder}
      defaultValue={searchParams.get("search") ?? ""}
      onChange={e => handleSearch(e.target.value)}
      className="w-full max-w-md border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  )
}
```

---

### Passo 9 — Tela `/clients/[id]`

**`src/app/clients/[id]/page.tsx`** — Server Component:

```tsx
import { api } from "@/lib/api"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ClientDetailPage({ params }: Props) {
  const { id } = await params

  let client
  try {
    client = await api.clientFull(id)
  } catch {
    notFound()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <a href="/clients" className="text-blue-600 text-sm hover:underline">← Clientes</a>
        <h1 className="text-2xl font-bold mt-1">{client.full_name}</h1>
      </div>

      {/* Dados cadastrais */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Dados Cadastrais</h2>
        <dl className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
          <InfoItem label="CPF" value={client.cpf_cnpj ?? "—"} />
          <InfoItem label="Telefone" value={client.phone_whatsapp ?? "—"} />
          <InfoItem label="E-mail" value={client.email ?? "—"} />
          <InfoItem label="Nascimento" value={client.birth_date ? formatDate(client.birth_date) : "—"} />
          <InfoItem label="Cadastrado em" value={formatDate(client.created_at)} />
        </dl>
      </section>

      {/* Apólices */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Apólices ({client.policies.length})</h2>
        {client.policies.length === 0 ? (
          <p className="text-gray-500">Nenhuma apólice cadastrada.</p>
        ) : (
          <div className="space-y-2">
            {client.policies.map(p => (
              <div key={p.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <span className="font-mono font-medium">{p.policy_number}</span>
                  <span className="ml-2 text-gray-500 text-sm">{policyTypeLabel(p.type)}</span>
                </div>
                <div className="text-right text-sm">
                  <div>{formatDate(p.start_date)} – {formatDate(p.end_date)}</div>
                  <div className={`font-medium ${p.status === "active" ? "text-green-600" : "text-gray-400"}`}>
                    {policyStatusLabel(p.status)}
                  </div>
                  {p.premium_amount && (
                    <div className="text-gray-500">
                      {parseFloat(p.premium_amount).toLocaleString("pt-BR", {
                        style: "currency", currency: "BRL"
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sinistros */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Sinistros ({client.claims.length})</h2>
        {client.claims.length === 0 ? (
          <p className="text-gray-500">Nenhum sinistro registrado.</p>
        ) : (
          <div className="space-y-2">
            {client.claims.map(c => (
              <div key={c.id} className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <span className="font-medium">{c.type ?? "Tipo não informado"}</span>
                  <span className={`text-sm font-medium ${claimSeverityColor(c.severity)}`}>
                    {claimSeverityLabel(c.severity)}
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-500">{claimStatusLabel(c.status)}</div>
                {c.description && <p className="mt-2 text-sm text-gray-700">{c.description}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Renovações */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Renovações ({client.renewals.length})</h2>
        {client.renewals.length === 0 ? (
          <p className="text-gray-500">Nenhuma renovação registrada.</p>
        ) : (
          <div className="space-y-2">
            {client.renewals.map(r => (
              <div key={r.id} className="border rounded-lg p-4">
                <div className="flex justify-between">
                  <span>Vencimento: {formatDate(r.expiry_date)}</span>
                  <span className="text-sm font-medium">{renewalStatusLabel(r.status)}</span>
                </div>
                {r.client_intent && (
                  <div className="mt-1 text-sm text-gray-500">
                    Intenção: {renewalIntentLabel(r.client_intent)}
                  </div>
                )}
                {r.last_contact_at && (
                  <div className="text-sm text-gray-400">
                    Último contato: {formatDate(r.last_contact_at)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// Helpers de formatação
function formatDate(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("pt-BR")
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-gray-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  )
}

function policyTypeLabel(type: string | null): string {
  const map: Record<string, string> = {
    auto: "Automóvel", life: "Vida", home: "Residencial",
    travel: "Viagem", business: "Empresarial"
  }
  return type ? (map[type] ?? type) : "—"
}

function policyStatusLabel(status: string): string {
  const map: Record<string, string> = {
    active: "Ativa", expired: "Vencida", cancelled: "Cancelada"
  }
  return map[status] ?? status
}

function claimSeverityLabel(severity: string | null): string {
  if (severity === "grave") return "Grave"
  if (severity === "simple") return "Simples"
  return "—"
}

function claimSeverityColor(severity: string | null): string {
  return severity === "grave" ? "text-red-600" : "text-blue-600"
}

function claimStatusLabel(status: string): string {
  const map: Record<string, string> = {
    open: "Aberto", in_progress: "Em andamento", waiting_insurer: "Aguardando seguradora",
    escalated: "Escalado", closed: "Encerrado"
  }
  return map[status] ?? status
}

function renewalStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "Pendente", contacted: "Contactado", confirmed: "Confirmado",
    refused: "Recusado", no_response: "Sem resposta", lost: "Perdido"
  }
  return map[status] ?? status
}

function renewalIntentLabel(intent: string | null): string {
  if (intent === "wants_renewal") return "Quer renovar"
  if (intent === "refused") return "Não quer renovar"
  if (intent === "wants_quote") return "Quer cotação"
  return intent ?? "—"
}
```

---

### Passo 10 — Tela `/agent-status`

**`src/app/agent-status/page.tsx`** — Server Component:

```tsx
import { api } from "@/lib/api"

export default async function AgentStatusPage() {
  const status = await api.agentStatus()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Status dos Agentes</h1>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {status.total_active} ativas
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-lg font-semibold mb-3">
            Sinistros ({status.active_claims.length})
          </h2>
          {status.active_claims.length === 0 ? (
            <p className="text-gray-500">Nenhuma conversa de sinistro ativa.</p>
          ) : (
            <div className="space-y-2">
              {status.active_claims.map(c => (
                <ConversationCard key={c.phone} conv={c} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3">
            Onboardings ({status.active_onboardings.length})
          </h2>
          {status.active_onboardings.length === 0 ? (
            <p className="text-gray-500">Nenhum onboarding em andamento.</p>
          ) : (
            <div className="space-y-2">
              {status.active_onboardings.map(c => (
                <ConversationCard key={c.phone} conv={c} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function ConversationCard({ conv }: { conv: { phone: string; last_updated_at: string | null; ttl_seconds: number } }) {
  const ttlDias = Math.floor(conv.ttl_seconds / 86400)
  return (
    <div className="border rounded-lg p-4">
      <div className="font-mono font-medium">{conv.phone}</div>
      {conv.last_updated_at && (
        <div className="text-sm text-gray-500 mt-1">
          Última mensagem: {new Date(conv.last_updated_at).toLocaleString("pt-BR")}
        </div>
      )}
      <div className="text-xs text-gray-400 mt-1">Expira em {ttlDias} dias</div>
    </div>
  )
}
```

---

## Ordem de desenvolvimento resumida

```
1. npx create-next-app + npm install use-debounce
2. src/lib/types.ts
3. src/lib/api.ts
4. src/app/api/auth/login/route.ts
5. src/app/api/auth/logout/route.ts
6. src/middleware.ts
7. src/app/login/page.tsx
8. src/app/dashboard/layout.tsx (sidebar)
9. src/app/dashboard/page.tsx + loading.tsx + error.tsx
10. src/app/clients/page.tsx + loading.tsx
11. src/components/SearchInput.tsx
12. src/app/clients/[id]/page.tsx + loading.tsx
13. src/app/agent-status/page.tsx
14. npm run build (verificar erros TypeScript)
```

---

## Verificação final

```bash
npm run build    # deve passar sem erros
npm run dev      # testar manualmente em http://localhost:3000
```

Checklist manual:
- [ ] Login com credenciais erradas → mensagem de erro em pt-BR
- [ ] Login com credenciais corretas → redireciona para /dashboard
- [ ] Acesso direto a /dashboard sem login → redireciona para /login
- [ ] Dashboard exibe contadores corretos
- [ ] Busca por nome em /clients filtra os resultados
- [ ] CPF mascarado nas listagens
- [ ] /clients/[id] exibe apólices, sinistros e renovações
- [ ] Logout encerra sessão
