import type {
  AgentStatusResponse,
  ClientFull,
  ClientResponse,
  DashboardSummary,
} from './types';
import {
  getAgentStatus,
  getClientFull,
  getClients,
  getSummary,
  type ClientsParams,
} from './api-mock';

export const api = {
  summary: (): Promise<DashboardSummary> => getSummary(),
  clients: (params?: ClientsParams): Promise<ClientResponse[]> => getClients(params),
  clientFull: (id: string): Promise<ClientFull | null> => getClientFull(id),
  agentStatus: (): Promise<AgentStatusResponse> => getAgentStatus(),
};
