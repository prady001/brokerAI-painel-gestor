export interface ClientResponse {
  id: string;
  full_name: string;
  cpf_cnpj: string | null;
  phone_whatsapp: string | null;
  email: string | null;
  birth_date: string | null;
  created_at: string;
}

export interface PolicyResponse {
  id: string;
  client_id: string;
  policy_number: string;
  type: 'auto' | 'life' | 'home' | 'travel' | 'business' | null;
  status: 'active' | 'expired' | 'cancelled';
  premium_amount: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface ClaimResponse {
  id: string;
  policy_id: string | null;
  client_id: string;
  type: string | null;
  severity: 'simple' | 'grave' | null;
  status: 'open' | 'in_progress' | 'waiting_insurer' | 'escalated' | 'closed';
  description: string | null;
  occurrence_date: string | null;
  opened_at: string | null;
}

export interface RenewalResponse {
  id: string;
  policy_id: string;
  client_id: string;
  expiry_date: string;
  status: 'pending' | 'contacted' | 'confirmed' | 'refused' | 'no_response' | 'lost';
  contact_count: number;
  last_contact_at: string | null;
  client_intent: string | null;
}

export interface ClientFull extends ClientResponse {
  policies: PolicyResponse[];
  claims: ClaimResponse[];
  renewals: RenewalResponse[];
}

export interface DashboardSummary {
  total_clients: number;
  active_policies: number;
  pending_renewals: number;
  open_claims: number;
  policies_expiring_30d: number;
  policies_expiring_60d: number;
  policies_expiring_90d: number;
}

export interface ActiveConversation {
  phone: string;
  type: 'claim' | 'onboarding';
  last_updated_at: string;
  ttl_seconds: number;
}

export interface AgentStatusResponse {
  active_claims: ActiveConversation[];
  active_onboardings: ActiveConversation[];
  total_active: number;
}
