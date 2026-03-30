

# Glassmorphism — Cards, Sidebar e Header

## Resumo
Aplicar estilo glassmorphism com fundo azul marinho escuro (#0b2297) a 85% de opacidade, backdrop-blur de 12px, e borda interna dourada (#daa520) a 20% de opacidade em todos os cards e na sidebar.

## Alterações

### 1. CSS global — `src/index.css`
- Atualizar `.glass-card` para: `background: rgba(11, 34, 151, 0.85)`, `backdrop-filter: blur(12px)`, `box-shadow: inset 0 0 0 1px rgba(218, 165, 32, 0.2)`, remover `border` externo (substituído pelo inset shadow dourado)
- Textos internos dos cards passam a ser claros (brancos) — ajustar variáveis `--card` e `--card-foreground` para cores claras
- Atualizar `--sidebar-background` para azul marinho com transparência (via classe customizada, já que CSS vars não suportam rgba diretamente)

### 2. GlassCard — `src/components/GlassCard.tsx`
- Remover `border` via Tailwind (agora via box-shadow inset no `.glass-card`)
- Garantir que textos filhos usem `text-white` ou `text-white/70` para contraste

### 3. KpiCard — `src/components/KpiCard.tsx`
- Aplicar mesmas classes `glass-card`
- Trocar `text-foreground` por `text-white` e `text-muted-foreground` por `text-white/60` para legibilidade sobre fundo escuro

### 4. Sidebar — `src/components/layout/AppSidebar.tsx`
- Trocar `bg-sidebar` por classe glassmorphism customizada: fundo azul marinho 85%, blur 12px, borda inset dourada
- Manter textos claros (já usa `text-sidebar-foreground`)

### 5. Header — `src/components/layout/AppLayout.tsx`
- Aplicar glassmorphism no header: mesmo fundo azul marinho com transparência e blur
- Borda inferior dourada sutil em vez de `border-border/50`

### 6. Background da página — `src/index.css`
- Escurecer o `--background` para um tom navy muito escuro (#050d2e) para que o efeito glass se destaque

### Detalhes técnicos
- O `box-shadow: inset 0 0 0 1px rgba(218, 165, 32, 0.2)` simula uma borda interna dourada sem conflitar com border-radius
- `backdrop-filter: blur(12px)` aplicado via classe utilitária customizada
- 6 arquivos editados, zero dependências novas

