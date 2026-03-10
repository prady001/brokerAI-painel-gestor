# Design system — Painel do Gestor

O painel do gestor utiliza o mesmo sistema visual da landing page da BrokerAI: tema escuro, gradiente azul–ciano, tipografia Inter/JetBrains Mono, cards e botões no mesmo padrão. A referência de implementação é o repositório da landing (ex.: `brokerAI-landing-page/styles.css` e `index.html`).

## Tokens e base

- **Tailwind:** cores, fontes, border-radius e sombras estão em `tailwind.config.ts`.
- **CSS:** variáveis adicionais (gradientes, scrollbar) em `src/app/design-tokens.css`, importado em `globals.css`.

### Cores

| Uso        | Token / classe Tailwind      | Valor / descrição                    |
|-----------|------------------------------|--------------------------------------|
| Fundo     | `bg-bg-deep`, `bg-bg-base`, `bg-bg-surface`, `bg-bg-card` | Fundo geral, sidebar, cards          |
| Acentos   | `blue`, `blue-light`, `cyan`, `green` | Links, botão primário, status ok     |
| Texto     | `text-text-primary`, `text-text-secondary`, `text-text-muted` | Títulos, corpo, labels               |
| Bordas    | `border-border`, `border-border-hover` | Cards, inputs, sidebar               |

### Tipografia

- **UI:** Inter (`font-sans`).
- **Dados/números:** JetBrains Mono (`font-mono`).

### Componentes

- **Botão primário:** gradiente azul–ciano (`from-blue to-cyan`), sombra `shadow-btn-primary`, hover com leve `-translate-y-0.5` e `shadow-btn-primary-hover`. Focus visível: `focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep`.
- **Botão ghost/outline:** fundo `bg-white/5`, borda `border-border-hover`, texto `text-text-primary`, mesmo padrão de focus.
- **Cards:** `bg-bg-card`, `border border-border`, `rounded-lg` (ou `rounded-xl`), `shadow-card-glow`, hover opcional `hover:border-border-hover`.
- **Sidebar / nav item:** ativo com `bg-blue-500/10` e `text-text-primary`; inativo `text-text-muted`, hover `hover:bg-white/5 hover:text-text-secondary`.
- **Tabelas:** header `text-text-muted` uppercase; linhas com `border-b border-border`, texto `text-text-secondary`; links em `text-blue-light` com hover sublinhado.
- **Badges de status:** verde (ok), âmbar (atenção), vermelho (risco), cinza (neutro), conforme padrão da landing (ex.: `.dash-status-ok`, `.dash-risk-high`).

## Acessibilidade

- **Contraste:** texto principal e secundário sobre fundos escuros atendem a um contraste legível; labels e muted em tons mais suaves.
- **Focus visível:** todos os links e botões usam `focus:outline-none` e `focus-visible:ring-2 focus-visible:ring-blue-500` (ou equivalente) com `ring-offset` no fundo escuro, para que o foco por teclado seja claramente visível.
- **Estados hover:** mantidos em links, botões e itens de navegação para feedback visual.

Ao criar novos componentes, reutilizar essas classes e tokens para manter a consistência com a landing.
