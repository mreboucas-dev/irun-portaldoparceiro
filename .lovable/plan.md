

# Light Mode Premium — Estilo Stripe/Vercel

## Resumo
Migrar todo o portal do tema escuro glassmorphism para um Light Mode Premium com fundo claro (#F8FAFC), cards brancos com bordas sutis e sombras soft, hierarquia de cores refinada e gráficos com gradientes que "derretem" no branco.

## Alterações

### 1. CSS Variables e utilitários — `src/index.css`
- `:root` → fundo `#F8FAFC` (210 40% 98%), foreground escuro `#0f172a`, card branco `#FFFFFF`, border `#E2E8F0`, muted-foreground `#64748b`
- Primary → azul marinho `#0b2297`, accent → dourado `#daa520`
- Sidebar: fundo branco `#FFFFFF`, foreground escuro, accent azul marinho suave, border `#E2E8F0`
- Substituir `.glass-card` por: `background: #FFFFFF`, `border: 1px solid #E2E8F0`, `box-shadow: 0 1px 3px rgba(0,0,0,0.08)` — remover backdrop-filter
- `.glass-sidebar` → `background: #FFFFFF`, `border-right: 1px solid #E2E8F0`
- `.glass-header` → `background: rgba(248,250,252,0.8)`, `backdrop-filter: blur(8px)`, `border-bottom: 1px solid #E2E8F0`
- Mover `.dark` para manter as variáveis escuras como fallback (mas não ativo)

### 2. GlassCard — `src/components/GlassCard.tsx`
- Trocar `text-white` por herança natural (foreground escuro)
- whileHover shadow → `0 4px 16px rgba(0,0,0,0.08)`

### 3. KpiCard — `src/components/KpiCard.tsx`
- Trocar `text-white` → `text-foreground`, `text-white/60` → `text-muted-foreground`
- whileHover shadow → sombra light

### 4. Dashboard — `src/pages/Dashboard.tsx`
- Textos: `text-white` → `text-foreground`, `text-white/60` → `text-muted-foreground`
- Gradientes dos gráficos: manter azul/dourado mas fazer fade para branco no final (`stopColor="#ffffff"` com `stopOpacity={0.1}`)
- Eixos: `stroke` de `rgba(255,255,255,0.4)` → `#94a3b8` (slate-400)

### 5. Cupons — `src/pages/Cupons.tsx`
- Eixos: stroke → `#94a3b8`
- Heatmap: intensidade baseada em azul marinho sobre fundo branco
- Tooltip: fundo branco com borda `#E2E8F0`

### 6. Equipe — `src/pages/Equipe.tsx`
- Tooltip do PieChart: fundo branco, borda `#E2E8F0`, texto escuro
- `hover:bg-white/5` → `hover:bg-slate-50`
- `border-white/10` → `border-border`

### 7. Relatorios — `src/pages/Relatorios.tsx`
- PolarGrid: `stroke` → `#e2e8f0`
- PolarAngleAxis: `stroke` → `#64748b`

### 8. Desafios — `src/pages/Desafios.tsx`
- whileHover background → `hsl(var(--muted) / 0.5)` (slate claro)

### 9. Solicitacoes — `src/pages/Solicitacoes.tsx`
- Sem mudanças específicas (já usa `text-foreground`/`text-muted-foreground` que serão atualizados via variáveis)

### 10. Sidebar — `src/components/layout/AppSidebar.tsx`
- `glass-sidebar` agora será branco com borda direita sutil
- Logo `iR` badge: manter gold-gradient
- Texto `text-sidebar-foreground` → escuro via variáveis

### 11. Header — `src/components/layout/AppLayout.tsx`
- `glass-header` → fundo branco translúcido com blur e borda inferior
- Texto `text-primary` mantém azul marinho

### 12. Table — `src/components/ui/table.tsx`
- Bordas `border-white/10` e `border-white/5` → `border-border` (que será `#E2E8F0`)

### Detalhes técnicos
- 11 arquivos editados, zero dependências novas
- Todas as cores migradas via CSS variables — facilita futuro dark mode toggle
- Gradientes dos gráficos terminam em branco para "derreter" no card

