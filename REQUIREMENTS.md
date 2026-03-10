# Requisitos — Painel do Gestor

## Contexto do produto

O BrokerAI é uma plataforma de agentes de IA para corretoras de seguros brasileiras. Os agentes (onboarding, sinistros, renovações) operam via WhatsApp de forma autônoma. O corretor hoje não tem visibilidade do que está acontecendo — não sabe quantos clientes foram cadastrados, quais apólices vencem, quais sinistros estão abertos.

O painel do gestor resolve isso: uma interface web de leitura para o corretor ter visão completa da operação.

---

## Usuário

**Um único usuário:** o corretor de seguros dono da corretora.

- Acessa pelo computador (prioridade) ou celular (secundário)
- Não é desenvolvedor — interface deve ser intuitiva
- Precisa de informação rápida, não de configurações complexas

---

## Objetivos

1. **Visibilidade da base** — saber quantos clientes existem e suas apólices
2. **Alertas de vencimento** — nunca perder uma renovação por falta de acompanhamento
3. **Status dos agentes** — saber se há conversas ativas no WhatsApp
4. **Busca rápida** — encontrar um cliente específico em segundos

---

## Requisitos funcionais

### RF-01 — Autenticação
- O corretor deve fazer login com usuário e senha
- Sessão dura 8 horas
- Logout encerra a sessão imediatamente
- Rotas protegidas redirecionam para `/login` sem sessão ativa

### RF-02 — Dashboard (tela inicial)
- Exibir 4 contadores: total de clientes, apólices ativas, renovações pendentes, sinistros em aberto
- Exibir lista de apólices vencendo nos próximos 90 dias, agrupadas por faixa:
  - 🔴 Crítico: vence em até 30 dias
  - 🟡 Atenção: vence em 31–60 dias
  - 🟢 Ok: vence em 61–90 dias
- Dados sempre frescos (sem cache)

### RF-03 — Lista de clientes
- Tabela com colunas: Nome | CPF (mascarado) | Telefone | Data de cadastro
- Busca por nome ou telefone com debounce de 300ms
- Paginação: 50 registros por página
- Clicar em uma linha navega para o detalhe do cliente

### RF-04 — Detalhe do cliente
- Dados cadastrais: nome completo, CPF (mascarado), telefone, email, data de nascimento
- Lista de apólices: número, seguradora, tipo, vigência (início–fim), valor do prêmio, status
- Lista de sinistros: tipo, severidade, status, data de abertura
- Lista de renovações: status, intenção do cliente, data do último contato
- Todos os dados carregados em uma única requisição ao backend

### RF-05 — Status dos agentes
- Lista de conversas de sinistro ativas: telefone do cliente + quando foi a última mensagem
- Lista de onboardings em andamento: telefone do cliente + TTL restante
- Indicador de total de conversas ativas

### RF-06 — Proteção de dados
- CPF sempre mascarado nas listagens: `***.456.789-**`
- CPF completo apenas na tela de detalhe individual
- Interface em português pt-BR

---

## Requisitos não-funcionais

### RNF-01 — Performance
- Tela do dashboard deve carregar em menos de 2 segundos
- Busca de clientes com debounce — sem requisições a cada tecla
- Paginação server-side — não carregar toda a base de uma vez

### RNF-02 — Segurança
- Token JWT armazenado em cookie `httpOnly` — inacessível ao JavaScript
- NUNCA usar `localStorage` para o token
- Middleware protege todas as rotas autenticadas no servidor (Edge Runtime)
- Variável `FASTAPI_URL` sem `NEXT_PUBLIC_` — nunca exposta ao browser

### RNF-03 — Compatibilidade
- Funciona nos navegadores modernos: Chrome, Firefox, Safari, Edge
- Responsivo (funciona no celular, mas não é a prioridade)

### RNF-04 — Manutenibilidade
- TypeScript com tipos explícitos — sem `any` implícito
- Tipos do backend documentados em `src/lib/types.ts`
- `npm run build` deve passar sem erros

### RNF-05 — Idioma
- Toda a interface em português pt-BR: labels, mensagens de erro, placeholders, botões

---

## Fora do escopo (MVP)

- ❌ Edição de dados (somente leitura)
- ❌ Múltiplos usuários / controle de acesso por papel
- ❌ Export PDF ou Excel
- ❌ Notificações em tempo real (WebSocket)
- ❌ Comissões (agente não implementado no backend)
- ❌ Ações sobre conversas ativas (apenas visualização)
- ❌ Gráficos históricos / evolução ao longo do tempo

---

## Critérios de aceitação

- [ ] Login com credenciais corretas redireciona para `/dashboard`
- [ ] Login com credenciais erradas exibe mensagem de erro em pt-BR
- [ ] Acesso a rota protegida sem login redireciona para `/login`
- [ ] `/dashboard` exibe 4 cards de métricas corretos
- [ ] `/dashboard` exibe apólices agrupadas por faixa de vencimento com cores corretas
- [ ] `/clients` busca por nome com debounce 300ms atualiza a URL e a tabela
- [ ] `/clients` paginação navega corretamente entre páginas
- [ ] `/clients/[id]` exibe apólices, sinistros e renovações do cliente
- [ ] CPF mascarado em todas as listagens
- [ ] `loading.tsx` exibe skeleton enquanto dados carregam
- [ ] `error.tsx` exibe mensagem de erro com botão "Tentar novamente"
- [ ] `npm run build` sem erros de TypeScript
- [ ] Interface inteiramente em pt-BR
