

# Refatoração Bento Box + Plus Jakarta Sans + Design Spacing

## Resumo
Transformar o dashboard em layout Bento Grid com células de tamanhos variados, trocar a fonte global para Plus Jakarta Sans, aumentar border-radius para 24px e ampliar espaçamento entre elementos.

## Alterações

### 1. Fonte global — `src/index.css` + `tailwind.config.ts`
- Trocar import do Google Fonts de `Inter` para `Plus Jakarta Sans` (weights 400-800)
- Atualizar `fontFamily.sans` no Tailwind para `['Plus Jakarta Sans', 'sans-serif']`
- Atualizar `body` font-family no CSS

### 2. Border-radius global — `src/index.css`
- Alterar `--radius` de `0.75rem` para `1.5rem` (24px)

### 3. GlassCard — `src/components/GlassCard.tsx`
- Trocar `rounded-xl` por `rounded-3xl` (24px)
- Aumentar padding: `p-5 sm:p-8`

### 4. KpiCard — `src/components/KpiCard.tsx`
- Trocar `rounded-xl` por `rounded-3xl`
- Aumentar padding: `p-5 sm:p-8`

### 5. Dashboard Bento Layout — `src/pages/Dashboard.tsx`
Layout em grid assimétrico inspirado em bento grids:

```text
Desktop (lg):
┌──────────┬──────────┬──────────┬──────────┐
│   KPI 1  │   KPI 2  │   KPI 3  │   KPI 4  │
├──────────┴──────────┼──────────┴──────────┤
│                     │                      │
│   Bar Chart         │   Line Chart         │
│   (span 2 cols)     │   (span 2 cols)      │
│                     │                      │
└─────────────────────┴──────────────────────┘
```

- Aumentar gaps: `gap-4 sm:gap-6` → `gap-5 sm:gap-8`
- KPIs grid: `gap-4 sm:gap-6`
- Charts grid: `gap-5 sm:gap-8`
- Altura dos charts um pouco maior: `h-[240px] sm:h-[320px]`

### 6. Espaçamento global no layout — `src/components/layout/AppLayout.tsx`
- Aumentar padding do `<main>`: `p-4 sm:p-8`

### Resumo técnico
- 6 arquivos editados
- 1 dependência externa (Google Fonts URL change, zero npm installs)
- Foco: fonte, border-radius, gaps, bento grid proportions

