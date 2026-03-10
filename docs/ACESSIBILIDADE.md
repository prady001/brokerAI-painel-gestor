# Acessibilidade — Painel do Gestor

Este documento descreve as práticas de acessibilidade do painel, em especial o suporte a **preferência de movimento reduzido** e o uso do **cursor glow** opcional.

---

## Preferência de movimento reduzido (`prefers-reduced-motion`)

O painel respeita a preferência do sistema operacional **Reduzir movimento** (Windows: Configurações > Acessibilidade > Efeitos visuais; macOS: Preferências do Sistema > Acessibilidade > Monitor > Reduzir movimento).

Quando o usuário ativa essa opção:

| Elemento | Comportamento com movimento reduzido |
|----------|--------------------------------------|
| **Reveal (entrada na tela)** | Sem translate, scale ou blur; apenas fade curto (opacidade ~0,2s). |
| **Cards com hover** (`.card-hover-glow`) | Sem `translateY` no hover; borda e cor de fundo continuam suaves. |
| **Botões** (`.btn-hover-overlay`) | Sem `translate` no hover; overlay de brilho e sombra permanecem. |
| **Links da sidebar** (`.nav-link-gradient-underline`) | Transição do sublinhado reduzida para 0,05s. |
| **Badge pulsante** (`.badge-dot`) | Animação de pulse desativada. |
| **Barra de KPI** (`.dash-kpi-fill`) | Transição da largura reduzida para 0,3s. |
| **Cursor glow** | Não é renderizado (componente não monta). |
| **Fade-in de conteúdo** | Conteúdo aparece imediatamente, sem transição. |

Implementação: as regras estão em `src/app/design-tokens.css` no bloco `@media (prefers-reduced-motion: reduce)`. O componente `ContentFadeIn` e o `CursorGlow` verificam a mídia em JavaScript para decidir se aplicam animação ou se renderizam o glow.

---

## Cursor glow (opcional)

O **cursor glow** é um efeito visual de brilho em gradiente que acompanha o ponteiro do mouse, apenas no layout do painel (não na tela de login).

- **Ativo em:** desktop, quando o usuário **não** tem preferência de movimento reduzido.
- **Inativo em:** dispositivos com `(hover: none)` (ex.: telas touch), ou quando `prefers-reduced-motion: reduce` está ativo.

O componente não adiciona listeners de mouse nem renderiza o efeito quando deve ficar inativo, para evitar impacto desnecessário em mobile e em usuários que preferem menos movimento.

---

## Como testar

1. **Reduzir movimento**
   - **Windows 11:** Configurações > Acessibilidade > Efeitos visuais > Ativar “Efeitos de animação desativados”.
   - **macOS:** Preferências do Sistema > Acessibilidade > Monitor > “Reduzir movimento”.
   - **Chrome/Edge:** DevTools (F12) > ⋮ > More tools > Rendering > “Emulate CSS media feature prefers-reduced-motion: reduce”.

2. **Cursor glow**
   - Com movimento reduzido **desativado** e uso de mouse: o brilho deve aparecer ao mover o cursor na área do painel.
   - Com movimento reduzido **ativado** ou em viewport que simula touch (`hover: none`): o brilho não deve aparecer.

---

## Contraste e foco

- Textos sobre fundo escuro seguem contraste legível; labels e textos secundários usam cores mais suaves.
- Botões e links possuem `focus-visible: ring` com offset para indicar foco por teclado de forma clara.
- O overlay de grain (textura de fundo) tem opacidade baixa para não prejudicar a leitura.
