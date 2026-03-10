import type {
  AgentStatusResponse,
  ClientFull,
  ClientResponse,
  DashboardSummary,
} from './types';

const MOCK_CLIENTS: ClientResponse[] = [
  {
    id: '3dce3590-aaa0-450a-8f5f-ff31d413d2d1',
    full_name: 'Mateus Bellon Melzi',
    cpf_cnpj: '544.210.318-79',
    phone_whatsapp: '5517992852877',
    email: 'mateus@example.com',
    birth_date: '1990-01-15',
    created_at: '2026-03-10T00:19:25.164273',
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    full_name: 'Maria Silva Santos',
    cpf_cnpj: '123.456.789-00',
    phone_whatsapp: '5511987654321',
    email: null,
    birth_date: null,
    created_at: '2026-03-09T14:30:00.000000',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    full_name: 'João Oliveira Costa',
    cpf_cnpj: '987.654.321-11',
    phone_whatsapp: '5521988776655',
    email: 'joao@example.com',
    birth_date: '1985-05-20',
    created_at: '2026-03-08T10:15:00.000000',
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    full_name: 'Ana Paula Ferreira',
    cpf_cnpj: '111.222.333-44',
    phone_whatsapp: '5531999887766',
    email: null,
    birth_date: null,
    created_at: '2026-03-07T08:00:00.000000',
  },
  {
    id: 'd4e5f6a7-b8c9-0123-def0-234567890123',
    full_name: 'Carlos Eduardo Lima',
    cpf_cnpj: '555.666.777-88',
    phone_whatsapp: '5541987654321',
    email: 'carlos@example.com',
    birth_date: '1978-11-03',
    created_at: '2026-03-06T16:45:00.000000',
  },
];

const MOCK_POLICIES: ClientFull['policies'] = [
  {
    id: 'b6a790d3-1111-2222-3333-444455556666',
    client_id: '3dce3590-aaa0-450a-8f5f-ff31d413d2d1',
    policy_number: '1263287',
    type: 'auto',
    status: 'active',
    premium_amount: '1200.00',
    start_date: '2026-03-10',
    end_date: '2027-03-09',
  },
  {
    id: 'c7b801e4-2222-3333-4444-555566667777',
    client_id: '3dce3590-aaa0-450a-8f5f-ff31d413d2d1',
    policy_number: '1263288',
    type: 'home',
    status: 'active',
    premium_amount: '850.50',
    start_date: '2025-06-01',
    end_date: '2026-05-31',
  },
  {
    id: 'd8c912f5-3333-4444-5555-666677778888',
    client_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    policy_number: '2001001',
    type: 'auto',
    status: 'expired',
    premium_amount: '980.00',
    start_date: '2024-01-15',
    end_date: '2025-01-14',
  },
];

const MOCK_CLAIMS: ClientFull['claims'] = [
  {
    id: 'claim-001',
    policy_id: 'b6a790d3-1111-2222-3333-444455556666',
    client_id: '3dce3590-aaa0-450a-8f5f-ff31d413d2d1',
    type: 'colisão',
    severity: 'grave',
    status: 'in_progress',
    description: 'Batida na traseira',
    occurrence_date: '2026-02-15',
    opened_at: '2026-02-16T10:00:00',
  },
  {
    id: 'claim-002',
    policy_id: 'b6a790d3-1111-2222-3333-444455556666',
    client_id: '3dce3590-aaa0-450a-8f5f-ff31d413d2d1',
    type: 'guincho',
    severity: 'simple',
    status: 'closed',
    description: null,
    occurrence_date: '2025-11-20',
    opened_at: '2025-11-20T14:30:00',
  },
];

const MOCK_RENEWALS: ClientFull['renewals'] = [
  {
    id: 'ren-001',
    policy_id: 'c7b801e4-2222-3333-4444-555566667777',
    client_id: '3dce3590-aaa0-450a-8f5f-ff31d413d2d1',
    expiry_date: '2026-05-31',
    status: 'contacted',
    contact_count: 2,
    last_contact_at: '2026-03-08T11:00:00',
    client_intent: 'wants_quote',
  },
  {
    id: 'ren-002',
    policy_id: 'b6a790d3-1111-2222-3333-444455556666',
    client_id: '3dce3590-aaa0-450a-8f5f-ff31d413d2d1',
    expiry_date: '2027-03-09',
    status: 'pending',
    contact_count: 0,
    last_contact_at: null,
    client_intent: null,
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getSummary(): Promise<DashboardSummary> {
  await delay(100);
  return {
    total_clients: 42,
    active_policies: 38,
    pending_renewals: 7,
    open_claims: 3,
    policies_expiring_30d: 4,
    policies_expiring_60d: 6,
    policies_expiring_90d: 9,
  };
}

export interface ClientsParams {
  skip?: number;
  limit?: number;
  search?: string;
}

export async function getClients(params: ClientsParams = {}): Promise<ClientResponse[]> {
  await delay(150);
  const { skip = 0, limit = 50, search = '' } = params;
  let list = [...MOCK_CLIENTS];
  if (search.trim()) {
    const term = search.trim().toLowerCase();
    list = list.filter(
      (c) =>
        c.full_name.toLowerCase().includes(term) ||
        (c.phone_whatsapp?.includes(term) ?? false) ||
        (c.cpf_cnpj?.replace(/\D/g, '').includes(term.replace(/\D/g, '')) ?? false)
    );
  }
  return list.slice(skip, skip + limit);
}

export async function getClientFull(id: string): Promise<ClientFull | null> {
  await delay(120);
  const client = MOCK_CLIENTS.find((c) => c.id === id);
  if (!client) return null;
  return {
    ...client,
    policies: MOCK_POLICIES.filter((p) => p.client_id === id),
    claims: MOCK_CLAIMS.filter((c) => c.client_id === id),
    renewals: MOCK_RENEWALS.filter((r) => r.client_id === id),
  };
}

export async function getAgentStatus(): Promise<AgentStatusResponse> {
  await delay(80);
  return {
    active_claims: [
      {
        phone: '5511921297395',
        type: 'claim',
        last_updated_at: '2026-03-10T15:30:00',
        ttl_seconds: 86234,
      },
    ],
    active_onboardings: [
      {
        phone: '5517992852877',
        type: 'onboarding',
        last_updated_at: '2026-03-10T14:20:00',
        ttl_seconds: 2591400,
      },
    ],
    total_active: 2,
  };
}
