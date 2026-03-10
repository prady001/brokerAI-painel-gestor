# Contrato da API Backend

O backend FastAPI (`C:\Users\mateu\Documents\brokerAI`) expõe as seguintes rotas para o painel.

**Base URL (desenvolvimento):** `http://localhost:8000`

---

## Autenticação

Todas as rotas `/dashboard/*` requerem o cookie `access_token` (JWT, `httpOnly`).

O cookie é obtido via `POST /auth/login` e removido via `POST /auth/logout`.

Rotas sem cookie válido retornam `401 Unauthorized`.

---

## POST /auth/login

Login do corretor.

**Request:**
```json
{ "username": "corretor", "password": "senha" }
```

**Response (200):**
```json
{ "ok": true }
```
+ Header: `Set-Cookie: access_token=<JWT>; HttpOnly; SameSite=Lax; Max-Age=28800`

**Response (401):**
```json
{ "detail": "Credenciais inválidas" }
```

---

## POST /auth/logout

Remove o cookie de sessão.

**Response (200):**
```json
{ "ok": true }
```
+ Header: `Set-Cookie: access_token=; Max-Age=0`

---

## GET /dashboard/summary

Métricas agregadas da corretora.

**Response (200):**
```json
{
  "total_clients": 42,
  "active_policies": 38,
  "pending_renewals": 7,
  "open_claims": 3,
  "policies_expiring_30d": 4,
  "policies_expiring_60d": 6,
  "policies_expiring_90d": 9
}
```

---

## GET /dashboard/clients

Lista de clientes com busca e paginação.

**Query params:**
| Param | Tipo | Default | Descrição |
|---|---|---|---|
| `skip` | int | 0 | Offset para paginação |
| `limit` | int | 50 | Máximo de registros (máx: 200) |
| `search` | string | — | Busca por nome (GIN trigram) ou CPF (exato) ou telefone |

**Response (200):**
```json
[
  {
    "id": "3dce3590-aaa0-450a-8f5f-ff31d413d2d1",
    "full_name": "Mateus Bellon Melzi",
    "cpf_cnpj": "544.210.318-79",
    "phone_whatsapp": "5517992852877",
    "email": null,
    "birth_date": null,
    "created_at": "2026-03-10T00:19:25.164273"
  }
]
```

**Nota:** O CPF retornado pelo backend está completo. O frontend deve mascarar para `***.210.318-**` nas listagens.

---

## GET /dashboard/clients/{id}/full

Detalhe completo do cliente: dados + apólices + sinistros + renovações em 1 request.

**Response (200):**
```json
{
  "id": "3dce3590-...",
  "full_name": "Mateus Bellon Melzi",
  "cpf_cnpj": "544.210.318-79",
  "phone_whatsapp": "5517992852877",
  "email": null,
  "birth_date": null,
  "created_at": "2026-03-10T00:19:25.164273",
  "policies": [
    {
      "id": "b6a790d3-...",
      "client_id": "3dce3590-...",
      "insurer_id": "5491163d-...",
      "policy_number": "1263287",
      "type": "auto",
      "status": "active",
      "premium_amount": "1200.00",
      "start_date": "2026-03-10",
      "end_date": "2024-09-21",
      "seller_phone": null
    }
  ],
  "claims": [],
  "renewals": []
}
```

**Nota:** `premium_amount` é `string` (Python Decimal → JSON string). Converter para exibição: `parseFloat(policy.premium_amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })`.

**Response (404):**
```json
{ "detail": "Cliente não encontrado" }
```

---

## GET /dashboard/agent-status

Conversas ativas no Redis (onboarding e sinistros).

**Response (200):**
```json
{
  "active_claims": [
    {
      "phone": "5511921297395",
      "type": "claim",
      "last_updated_at": "2026-03-10T15:30:00",
      "ttl_seconds": 86234
    }
  ],
  "active_onboardings": [
    {
      "phone": "5517992852877",
      "type": "onboarding",
      "last_updated_at": "2026-03-10T14:20:00",
      "ttl_seconds": 2591400
    }
  ],
  "total_active": 2
}
```

**Nota:** `ttl_seconds` indica quanto tempo resta para a conversa expirar automaticamente. Conversas com TTL muito alto (próximo de 30 dias = 2.592.000s) podem ser conversas antigas não encerradas.

---

## Tipos de dados do domínio

### Status de apólice (`policies.status`)
- `active` — apólice vigente
- `expired` — vencida
- `cancelled` — cancelada

### Tipo de apólice (`policies.type`)
- `auto` — seguro de automóvel
- `life` — seguro de vida
- `home` — seguro residencial
- `travel` — seguro viagem
- `business` — seguro empresarial

### Status de sinistro (`claims.status`)
- `open` — aberto, aguardando coleta de informações
- `in_progress` — em andamento com a seguradora
- `waiting_insurer` — aguardando retorno da seguradora
- `escalated` — escalado para o corretor
- `closed` — encerrado

### Severidade de sinistro (`claims.severity`)
- `simple` — assistência, guincho, vidro
- `grave` — colisão, furto, acidente com vítima

### Status de renovação (`renewals.status`)
- `pending` — agendada, sem contato ainda
- `contacted` — cliente foi contatado, aguardando resposta
- `confirmed` — cliente confirmou renovação
- `refused` — cliente recusou
- `no_response` — sem resposta após múltiplos contatos
- `lost` — perda definitiva

### Intenção do cliente na renovação (`renewals.client_intent`)
- `wants_renewal` — quer renovar
- `refused` — não quer renovar
- `wants_quote` — quer pesquisar preços antes
